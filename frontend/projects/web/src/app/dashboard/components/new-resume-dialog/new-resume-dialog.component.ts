import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { DocumentType, TemplateRecord } from '../../../workspace/models/workspace.models';
import { TemplatesService } from '../../../workspace/services/templates.service';

export interface NewDocumentDialogResult {
  title: string;
  type: DocumentType;
  templateId: number | null;
}

@Component({
  selector: 'app-new-resume-dialog',
  templateUrl: './new-resume-dialog.component.html',
  styleUrls: ['./new-resume-dialog.component.scss']
})
export class NewResumeDialogComponent implements OnInit {
  title = 'Untitled resume';
  type: DocumentType = 'resume';
  selectedTemplateId: number | null = null;
  templates: TemplateRecord[] = [];
  isLoading = true;
  errorMessage = '';

  constructor(
    public dialogRef: MatDialogRef<NewResumeDialogComponent>,
    private templatesService: TemplatesService
  ) {}

  ngOnInit(): void {
    this.templatesService.list().subscribe({
      next: response => {
        this.templates = response.templates;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Templates are unavailable right now. You can still start blank.';
        this.isLoading = false;
      }
    });
  }

  selectTemplate(id: number | null): void {
    this.selectedTemplateId = id;
  }

  cancel(): void {
    this.dialogRef.close();
  }

  continue(): void {
    const title = this.title.trim();
    if (!title) {
      this.errorMessage = 'Add a document title first.';
      return;
    }

    const result: NewDocumentDialogResult = {
      title,
      type: this.type,
      templateId: this.selectedTemplateId
    };
    this.dialogRef.close(result);
  }
}
