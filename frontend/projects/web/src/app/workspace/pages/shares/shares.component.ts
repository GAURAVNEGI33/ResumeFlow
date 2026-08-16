import { Component, OnInit } from '@angular/core';
import { forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ShareRecord } from '../../models/workspace.models';
import { DocumentsService } from '../../services/documents.service';
import { SharesService } from '../../services/shares.service';

@Component({
  selector: 'app-shares',
  templateUrl: './shares.component.html',
  styleUrls: ['./shares.component.scss']
})
export class SharesComponent implements OnInit {
  shares: ShareRecord[] = [];
  isLoading = true;
  errorMessage = '';
  copiedId: number | null = null;

  constructor(private documentsService: DocumentsService, private sharesService: SharesService) {}

  ngOnInit(): void {
    this.loadShares();
  }

  loadShares(): void {
    this.isLoading = true;
    this.documentsService.list().subscribe({
      next: response => {
        if (!response.documents.length) {
          this.shares = [];
          this.isLoading = false;
          return;
        }

        const requests = response.documents.map(document =>
          this.sharesService.listByDocument(document.id).pipe(
            map(result => result.shares.map(share => ({ ...share, documentTitle: document.title }))),
            catchError(() => of([] as ShareRecord[]))
          )
        );

        forkJoin(requests).subscribe(results => {
          this.shares = results.reduce<ShareRecord[]>((all, current) => [...all, ...current], [])
            .sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
          this.isLoading = false;
        });
      },
      error: () => {
        this.errorMessage = 'Shared links could not be loaded.';
        this.isLoading = false;
      }
    });
  }

  publicUrl(share: ShareRecord): string {
    return `${window.location.origin}/r/${share.slug}`;
  }

  copyLink(share: ShareRecord): void {
    navigator.clipboard.writeText(this.publicUrl(share)).then(() => {
      this.copiedId = share.id;
      window.setTimeout(() => this.copiedId = null, 1800);
    }).catch(() => this.errorMessage = 'The link could not be copied automatically.');
  }

  openLink(share: ShareRecord): void {
    window.open(this.publicUrl(share), '_blank', 'noopener,noreferrer');
  }

  printLink(share: ShareRecord): void {
    window.open(this.publicUrl(share), '_blank', 'noopener,noreferrer');
  }

  revoke(share: ShareRecord): void {
    if (!window.confirm(`Revoke the public link for “${share.documentTitle || 'this document'}”?`)) return;
    this.sharesService.remove(share.id).subscribe({
      next: () => this.shares = this.shares.filter(item => item.id !== share.id),
      error: () => this.errorMessage = 'The shared link could not be revoked.'
    });
  }
}
