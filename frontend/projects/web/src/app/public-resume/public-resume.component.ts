import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SharesService, PublicShareResponse } from '../workspace/services/shares.service';
import { ExportService } from '../workspace/services/export.service';

@Component({
  selector: 'app-public-resume',
  templateUrl: './public-resume.component.html',
  styleUrls: ['./public-resume.component.scss']
})
export class PublicResumeComponent implements OnInit {
  slug = '';
  isLoading = true;
  isError = false;
  errorMessage = '';
  shareData: PublicShareResponse['share'] | null = null;
  isDownloading = false;

  constructor(
    private route: ActivatedRoute,
    private sharesService: SharesService,
    private exportService: ExportService
  ) {}

  ngOnInit(): void {
    this.slug = this.route.snapshot.paramMap.get('slug') || '';
    if (!this.slug) {
      this.isError = true;
      this.errorMessage = 'No resume identifier specified.';
      this.isLoading = false;
      return;
    }
    this.loadResume();
  }

  loadResume(): void {
    this.isLoading = true;
    this.isError = false;

    this.sharesService.getBySlug(this.slug).subscribe({
      next: (res) => {
        this.shareData = res.share;
        this.isLoading = false;
      },
      error: (err) => {
        this.isError = true;
        this.errorMessage = err.error?.message || 'This resume is private, expired, or does not exist.';
        this.isLoading = false;
      }
    });
  }

  printResume(): void {
    window.print();
  }

  downloadPdf(): void {
    if (!this.shareData || !this.shareData.document) return;
    this.isDownloading = true;

    const html = this.generatePdfHtml();
    const docId = this.shareData.document.id;
    const title = this.shareData.document.title || 'resume';

    this.exportService.exportPdf(docId, html).subscribe({
      next: (blob) => {
        this.exportService.downloadFile(blob, `${title}.pdf`);
        this.isDownloading = false;
      },
      error: () => {
        // Fallback to native window.print() if backend export encounters an issue
        this.isDownloading = false;
        window.print();
      }
    });
  }

  private generatePdfHtml(): string {
    const doc = this.shareData?.document;
    const user = doc?.User;
    const sections = (doc?.Sections || []).map(section => `
      <div style="margin-bottom: 18px;">
        <h3 style="color: #087a5b; border-bottom: 2px solid #39d98a; padding-bottom: 4px; margin-bottom: 8px; font-size: 1.1rem; text-transform: uppercase; letter-spacing: 0.05em;">
          ${section.heading}
        </h3>
        <ul style="margin: 0; padding-left: 20px; color: #333; line-height: 1.6;">
          ${(section.Items || []).map(item => `<li style="margin-bottom: 4px;">${item.content}</li>`).join('')}
        </ul>
      </div>
    `).join('');

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>${doc?.title || 'Resume'}</title>
      </head>
      <body style="font-family: Arial, Helvetica, sans-serif; color: #1a1a1a; padding: 24px; max-width: 800px; margin: 0 auto;">
        <header style="border-bottom: 3px solid #087a5b; padding-bottom: 12px; margin-bottom: 20px;">
          <h1 style="font-size: 2rem; color: #087a5b; margin: 0 0 6px 0;">${user?.name || 'Candidate Name'}</h1>
          <p style="margin: 0; color: #666; font-size: 0.95rem;">
            ${user?.email ? `<span>Email: ${user.email}</span>` : ''}
            ${doc?.title ? ` &bull; <span>${doc.title}</span>` : ''}
          </p>
        </header>
        <main>
          ${sections}
        </main>
      </body>
      </html>
    `;
  }
}
