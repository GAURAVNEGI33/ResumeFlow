import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DocumentType, TemplateRecord } from '../../models/workspace.models';
import { DocumentsService } from '../../services/documents.service';
import { TemplatesService } from '../../services/templates.service';

interface TemplateDesign {
  layout: 'simple' | 'sidebar';
  accent: string;
  font: string;
  density: 'compact' | 'comfortable';
}

@Component({
  selector: 'app-template-gallery',
  templateUrl: './template-gallery.component.html',
  styleUrls: ['./template-gallery.component.scss']
})
export class TemplateGalleryComponent implements OnInit {
  templates: TemplateRecord[] = [];
  isLoading = true;
  isSaving = false;
  showCreateForm = false;
  errorMessage = '';
  newTemplate = {
    name: '',
    accent: '#087a5b',
    font: 'Outfit',
    layout: 'simple' as 'simple' | 'sidebar',
    density: 'comfortable' as 'compact' | 'comfortable'
  };

  constructor(
    private templatesService: TemplatesService,
    private documentsService: DocumentsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadTemplates();
  }

  loadTemplates(): void {
    this.isLoading = true;
    this.templatesService.list().subscribe({
      next: response => {
        this.templates = response.templates;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Templates could not be loaded.';
        this.isLoading = false;
      }
    });
  }

  design(template: TemplateRecord): TemplateDesign {
    const fallback: TemplateDesign = {
      layout: template.name.toLowerCase().includes('sidebar') ? 'sidebar' : 'simple',
      accent: '#087a5b',
      font: 'Outfit',
      density: 'comfortable'
    };

    if (!template.config) return fallback;
    try {
      return { ...fallback, ...JSON.parse(template.config) };
    } catch {
      return fallback;
    }
  }

  createTemplate(): void {
    if (!this.newTemplate.name.trim()) {
      this.errorMessage = 'Add a template name first.';
      return;
    }

    this.isSaving = true;
    const config = JSON.stringify({
      accent: this.newTemplate.accent,
      font: this.newTemplate.font,
      layout: this.newTemplate.layout,
      density: this.newTemplate.density
    });

    this.templatesService.create({ name: this.newTemplate.name.trim(), config }).subscribe({
      next: response => {
        this.templates = [response.template, ...this.templates];
        this.showCreateForm = false;
        this.isSaving = false;
      },
      error: () => {
        this.errorMessage = 'The template could not be created.';
        this.isSaving = false;
      }
    });
  }

  useTemplate(template: TemplateRecord, type: DocumentType = 'resume'): void {
    this.documentsService.create({
      title: `Untitled ${type === 'cover_letter' ? 'cover letter' : 'resume'}`,
      type,
      templateId: template.id
    }).subscribe({
      next: response => this.router.navigate(['/editor', response.document.id]),
      error: () => this.errorMessage = 'A document could not be created from this template.'
    });
  }
}
