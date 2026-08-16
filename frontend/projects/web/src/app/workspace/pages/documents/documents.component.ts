import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DocumentRecord, DocumentType, TemplateRecord } from '../../models/workspace.models';
import { DocumentsService } from '../../services/documents.service';
import { TemplatesService } from '../../services/templates.service';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss']
})
export class DocumentsComponent implements OnInit {
  documents: DocumentRecord[] = [];
  templates: TemplateRecord[] = [];
  searchQuery = '';
  typeFilter: 'all' | DocumentType = 'all';
  isLoading = true;
  isSaving = false;
  showCreateForm = false;
  errorMessage = '';
  createModel: { title: string; type: DocumentType; templateId: number | null } = {
    title: '',
    type: 'resume',
    templateId: null
  };

  constructor(
    private documentsService: DocumentsService,
    private templatesService: TemplatesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDocuments();
    this.templatesService.list().subscribe({
      next: response => this.templates = response.templates,
      error: () => this.templates = []
    });
  }

  get filteredDocuments(): DocumentRecord[] {
    const query = this.searchQuery.trim().toLowerCase();
    return this.documents.filter(document => {
      const matchesSearch = !query || document.title.toLowerCase().includes(query);
      const matchesType = this.typeFilter === 'all' || document.type === this.typeFilter;
      return matchesSearch && matchesType;
    });
  }

  loadDocuments(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.documentsService.list().subscribe({
      next: response => {
        this.documents = response.documents;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Your documents could not be loaded.';
        this.isLoading = false;
      }
    });
  }

  createDocument(): void {
    const title = this.createModel.title.trim();
    if (!title) {
      this.errorMessage = 'Add a title before creating the document.';
      return;
    }

    this.isSaving = true;
    this.documentsService.create({
      title,
      type: this.createModel.type,
      templateId: this.createModel.templateId
    }).subscribe({
      next: response => {
        this.isSaving = false;
        this.router.navigate(['/editor', response.document.id]);
      },
      error: () => {
        this.errorMessage = 'The document could not be created.';
        this.isSaving = false;
      }
    });
  }

  duplicate(document: DocumentRecord): void {
    this.documentsService.duplicate(document.id).subscribe({
      next: response => this.documents = [response.document, ...this.documents],
      error: () => this.errorMessage = 'The document could not be duplicated.'
    });
  }

  remove(document: DocumentRecord): void {
    if (!window.confirm(`Delete “${document.title}”? This cannot be undone.`)) return;
    this.documentsService.remove(document.id).subscribe({
      next: () => this.documents = this.documents.filter(item => item.id !== document.id),
      error: () => this.errorMessage = 'The document could not be deleted.'
    });
  }

  templateName(document: DocumentRecord): string {
    if (document.Template?.name) return document.Template.name;
    return this.templates.find(template => template.id === document.templateId)?.name || '';
  }

  typeLabel(type: DocumentType): string {
    if (type === 'cover_letter') return 'Cover letter';
    return type === 'cv' ? 'CV' : 'Resume';
  }
}
