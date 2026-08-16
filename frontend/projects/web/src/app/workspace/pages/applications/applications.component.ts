import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApplicationRecord, ApplicationStatus, DocumentRecord } from '../../models/workspace.models';
import { ApplicationsService } from '../../services/applications.service';
import { DocumentsService } from '../../services/documents.service';

interface StatusColumn {
  key: ApplicationStatus;
  label: string;
}

@Component({
  selector: 'app-applications',
  templateUrl: './applications.component.html',
  styleUrls: ['./applications.component.scss']
})
export class ApplicationsComponent implements OnInit {
  viewMode: 'board' | 'table' = 'board';
  showCreateForm = false;
  isLoading = true;
  isSaving = false;
  errorMessage = '';
  applications: ApplicationRecord[] = [];
  documents: DocumentRecord[] = [];

  readonly statuses: StatusColumn[] = [
    { key: 'saved', label: 'Saved' },
    { key: 'applied', label: 'Applied' },
    { key: 'interview', label: 'Interview' },
    { key: 'offer', label: 'Offer' },
    { key: 'rejected', label: 'Rejected' }
  ];
  readonly statusIds = this.statuses.map(status => status.key);
  columns: Record<ApplicationStatus, ApplicationRecord[]> = this.emptyColumns();
  newApplication: { company: string; role: string; status: ApplicationStatus; documentId: number | null } = {
    company: '',
    role: '',
    status: 'saved',
    documentId: null
  };

  constructor(
    private applicationsService: ApplicationsService,
    private documentsService: DocumentsService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadApplications();
    this.documentsService.list().subscribe({
      next: response => this.documents = response.documents,
      error: () => this.documents = []
    });
  }

  loadApplications(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.applicationsService.list().subscribe({
      next: response => {
        this.applications = response.applications;
        this.rebuildColumns();
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Applications could not be loaded.';
        this.isLoading = false;
      }
    });
  }

  createApplication(): void {
    if (!this.newApplication.company.trim() || !this.newApplication.role.trim() || !this.newApplication.documentId) {
      this.errorMessage = 'Company, role and a linked document are required.';
      return;
    }

    this.isSaving = true;
    this.applicationsService.create({
      company: this.newApplication.company.trim(),
      role: this.newApplication.role.trim(),
      status: this.newApplication.status,
      documentId: this.newApplication.documentId
    }).subscribe({
      next: response => {
        this.applications = [response.application, ...this.applications];
        this.rebuildColumns();
        this.showCreateForm = false;
        this.isSaving = false;
        this.newApplication = { company: '', role: '', status: 'saved', documentId: null };
      },
      error: () => {
        this.errorMessage = 'The application could not be created.';
        this.isSaving = false;
      }
    });
  }

  drop(event: CdkDragDrop<ApplicationRecord[]>, status: ApplicationStatus): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      return;
    }

    const application = event.previousContainer.data[event.previousIndex];
    transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
    const oldStatus = application.status;
    application.status = status;

    this.applicationsService.update(application.id, { status }).subscribe({
      next: () => this.snackBar.open(`Moved to ${this.statusLabel(status)}`, 'Close', { duration: 2400 }),
      error: () => {
        application.status = oldStatus;
        this.loadApplications();
        this.errorMessage = 'The status change could not be saved.';
      }
    });
  }

  updateStatus(application: ApplicationRecord, status: ApplicationStatus): void {
    this.applicationsService.update(application.id, { status }).subscribe({
      next: response => {
        application.status = response.application.status;
        this.rebuildColumns();
      },
      error: () => this.errorMessage = 'The application could not be updated.'
    });
  }

  remove(application: ApplicationRecord): void {
    if (!window.confirm(`Delete the ${application.role} application at ${application.company}?`)) return;
    this.applicationsService.remove(application.id).subscribe({
      next: () => {
        this.applications = this.applications.filter(item => item.id !== application.id);
        this.rebuildColumns();
      },
      error: () => this.errorMessage = 'The application could not be deleted.'
    });
  }

  statusLabel(status: ApplicationStatus): string {
    return this.statuses.find(item => item.key === status)?.label || status;
  }

  documentTitle(application: ApplicationRecord): string {
    if (application.Document?.title) return application.Document.title;
    return this.documents.find(document => document.id === application.documentId)?.title || 'No linked document';
  }

  private rebuildColumns(): void {
    this.columns = this.emptyColumns();
    this.applications.forEach(application => this.columns[application.status].push(application));
  }

  private emptyColumns(): Record<ApplicationStatus, ApplicationRecord[]> {
    return { saved: [], applied: [], interview: [], offer: [], rejected: [] };
  }
}
