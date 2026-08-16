import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { DashboardService } from '../services/dashboard.service';
import { DocumentsService } from '../workspace/services/documents.service';
import { ApplicationStatus, DocumentType } from '../workspace/models/workspace.models';
import { NewDocumentDialogResult, NewResumeDialogComponent } from './components/new-resume-dialog/new-resume-dialog.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  userName = 'User';
  isLoading = true;
  errorMessage = '';

  stats = { documents: 0, applications: 0, versions: 0, exports: 0 };
  recentDocuments: Array<{
    id: number;
    title: string;
    type: DocumentType;
    updatedAt: string;
    Template?: { name: string };
  }> = [];
  applicationPipeline: Record<ApplicationStatus, number> = {
    saved: 0,
    applied: 0,
    interview: 0,
    offer: 0,
    rejected: 0
  };

  readonly pipelineStatuses: Array<{ key: ApplicationStatus; label: string }> = [
    { key: 'saved', label: 'Saved' },
    { key: 'applied', label: 'Applied' },
    { key: 'interview', label: 'Interview' },
    { key: 'offer', label: 'Offer' },
    { key: 'rejected', label: 'Rejected' }
  ];

  constructor(
    private auth: AuthService,
    private dashboardService: DashboardService,
    private documentsService: DocumentsService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userName = this.auth.getUser()?.name || 'User';
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.dashboardService.getStats().subscribe({
      next: response => {
        this.stats = response.data.counts;
        this.recentDocuments = response.data.recentDocuments;
        this.applicationPipeline = response.data.applicationPipeline;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Dashboard data could not be loaded. Please try again.';
        this.isLoading = false;
      }
    });
  }

  getPipelinePercentage(status: ApplicationStatus): number {
    if (!this.stats.applications) return 0;
    return (this.applicationPipeline[status] / this.stats.applications) * 100;
  }

  documentTypeLabel(type: DocumentType): string {
    if (type === 'cover_letter') return 'Cover letter';
    return type === 'cv' ? 'CV' : 'Resume';
  }

  openNewResumeDialog(): void {
    const dialogRef = this.dialog.open(NewResumeDialogComponent, {
      width: 'min(700px, calc(100vw - 32px))',
      panelClass: 'new-resume-dialog-container'
    });

    dialogRef.afterClosed().subscribe((result: NewDocumentDialogResult | undefined) => {
      if (!result) return;
      this.documentsService.create(result).subscribe({
        next: response => this.router.navigate(['/editor', response.document.id]),
        error: () => this.errorMessage = 'The resume could not be created. Please try again.'
      });
    });
  }
}
