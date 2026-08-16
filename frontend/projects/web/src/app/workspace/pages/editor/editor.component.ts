import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ActivatedRoute } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthService } from '../../../auth/auth.service';
import { DocumentRecord, DocumentType, ItemRecord, SectionRecord, ShareRecord, TemplateRecord, VersionRecord } from '../../models/workspace.models';
import { DocumentsService } from '../../services/documents.service';
import { EditorService } from '../../services/editor.service';
import { SharesService } from '../../services/shares.service';
import { TemplatesService } from '../../services/templates.service';
import { ExportService } from '../../services/export.service';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {
  documentId = 0;
  document: DocumentRecord | null = null;
  sections: SectionRecord[] = [];
  templates: TemplateRecord[] = [];
  versions: VersionRecord[] = [];
  shares: ShareRecord[] = [];
  activeTab: 'editor' | 'versions' | 'shares' = 'editor';
  isLoading = true;
  isSaving = false;
  settingsOpen = false;
  errorMessage = '';
  successMessage = '';
  profilePhoto = '';
profilePhotoError = '';
  newSectionHeading = '';
  versionLabel = '';
  settings: { title: string; type: DocumentType; templateId: number | null } = {
    title: '', type: 'resume', templateId: null
  };

  constructor(
    private route: ActivatedRoute,
    public auth: AuthService,
    private documentsService: DocumentsService,
    private editorService: EditorService,
    private templatesService: TemplatesService,
    private sharesService: SharesService,
    private exportService: ExportService
  ) {}

  ngOnInit(): void {
    this.documentId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadEditor();
  }

  get profileName(): string {
    return this.auth.getUser()?.name || 'Your Name';
  }

  get activeTemplate(): TemplateRecord | undefined {
    return this.templates.find(template => template.id === this.document?.templateId);
  }

  get documentTypeLabel(): string {
    if (!this.document) return 'Document';
    if (this.document.type === 'cover_letter') return 'Cover letter';
    return this.document.type === 'cv' ? 'CV' : 'Resume';
  }

  get previewAccent(): string {
    if (!this.activeTemplate?.config) return '#087a5b';
    try { return JSON.parse(this.activeTemplate.config).accent || '#087a5b'; }
    catch { return '#087a5b'; }
  }

  get previewLayout(): string {
    if (!this.activeTemplate?.config) return 'simple';
    try { return JSON.parse(this.activeTemplate.config).layout || 'simple'; }
    catch { return 'simple'; }
  }
isSidebarSection(section: SectionRecord): boolean {
  return this.previewLayout === 'sidebar' && section.isSidebar;
}

updateSectionPlacement(
  section: SectionRecord,
  isSidebar: boolean
): void {
  const previousValue = section.isSidebar;

  section.isSidebar = isSidebar;

  this.editorService
    .updateSection(section.id, { isSidebar })
    .subscribe({
      next: response => {
        section.isSidebar = response.section.isSidebar;
      },
      error: () => {
        section.isSidebar = previousValue;
        this.errorMessage = 'Section placement could not be saved.';
      }
    });
}
  loadEditor(): void {
    if (!this.documentId) {
      this.errorMessage = 'Invalid document.';
      this.isLoading = false;
      return;
    }

    this.isLoading = true;
    forkJoin({
      document: this.documentsService.get(this.documentId),
      sections: this.editorService.listSections(this.documentId),
      templates: this.templatesService.list().pipe(catchError(() => of({ success: false, templates: [] }))),
      versions: this.editorService.listVersions(this.documentId).pipe(catchError(() => of({ success: false, versions: [] }))),
      shares: this.sharesService.listByDocument(this.documentId).pipe(catchError(() => of({ success: false, shares: [] })))
    }).subscribe({
      next: result => {
        this.document = result.document.document;
        this.templates = result.templates.templates;
        this.versions = result.versions.versions;
        this.shares = result.shares.shares;
        this.settings = {
          title: this.document.title,
          type: this.document.type,
          templateId: this.document.templateId || null
        };
        this.loadSectionItems(result.sections.sections);
      },
      error: () => {
        this.errorMessage = 'The document could not be loaded.';
        this.isLoading = false;
      }
    });
  }

  loadSectionItems(sections: SectionRecord[]): void {
    if (!sections.length) {
      this.sections = [];
      this.isLoading = false;
      return;
    }

    const requests = sections.map(section =>
      this.editorService.listItems(section.id).pipe(
        map(response => ({ ...section, items: response.items })),
        catchError(() => of({ ...section, items: [] }))
      )
    );
    forkJoin(requests).subscribe(items => {
      this.sections = items.sort((a, b) => a.position - b.position);
      this.isLoading = false;
    });
  }

  openSettings(): void {
    if (!this.document) return;
    this.settings = {
      title: this.document.title,
      type: this.document.type,
      templateId: this.document.templateId || null
    };
    this.settingsOpen = true;
  }

  saveSettings(): void {
    if (!this.document || !this.settings.title.trim()) return;
    this.isSaving = true;
    this.documentsService.update(this.document.id, {
      title: this.settings.title.trim(),
      type: this.settings.type,
      templateId: this.settings.templateId
    }).subscribe({
      next: response => {
        this.document = response.document;
        this.settingsOpen = false;
        this.isSaving = false;
        this.showSuccess('Document settings saved.');
      },
      error: () => {
        this.errorMessage = 'Settings could not be saved.';
        this.isSaving = false;
      }
    });
  }

  addSection(): void {
    const heading = this.newSectionHeading.trim();
    if (!heading) return;
    this.editorService.createSection({
      documentId: this.documentId,
      heading,
      position: this.sections.length
    }).subscribe({
      next: response => {
        this.sections.push({ ...response.section, items: [] });
        this.newSectionHeading = '';
      },
      error: () => this.errorMessage = 'The section could not be added.'
    });
  }

  saveSection(section: SectionRecord): void {
    this.editorService.updateSection(section.id, { heading: section.heading }).subscribe({
      error: () => this.errorMessage = 'The section heading could not be saved.'
    });
  }

  removeSection(section: SectionRecord): void {
    if (!window.confirm(`Delete the “${section.heading}” section?`)) return;
    this.editorService.removeSection(section.id).subscribe({
      next: () => this.sections = this.sections.filter(item => item.id !== section.id),
      error: () => this.errorMessage = 'The section could not be deleted.'
    });
  }

  addItem(section: SectionRecord): void {
    const position = section.items?.length || 0;
    this.editorService.createItem({ sectionId: section.id, content: 'New resume detail', position }).subscribe({
      next: response => {
        section.items = [...(section.items || []), response.item];
      },
      error: () => this.errorMessage = 'The bullet could not be added.'
    });
  }

  saveItem(item: ItemRecord): void {
    this.editorService.updateItem(item.id, { content: item.content }).subscribe({
      error: () => this.errorMessage = 'The resume detail could not be saved.'
    });
  }

  removeItem(section: SectionRecord, item: ItemRecord): void {
    this.editorService.removeItem(item.id).subscribe({
      next: () => section.items = (section.items || []).filter(value => value.id !== item.id),
      error: () => this.errorMessage = 'The resume detail could not be deleted.'
    });
  }

  dropSection(event: CdkDragDrop<SectionRecord[]>): void {
  if (event.previousIndex === event.currentIndex) return;

  moveItemInArray(
    this.sections,
    event.previousIndex,
    event.currentIndex
  );

  const requests = this.sections.map((section, index) => {
    section.position = index;

    return this.editorService.updateSection(section.id, {
      position: index
    });
  });

  forkJoin(requests).subscribe({
    next: () => this.showSuccess('Section order saved.'),
    error: () => {
      this.errorMessage = 'Section order could not be saved.';
      this.loadEditor();
    }
  });
}

dropItem(
  event: CdkDragDrop<ItemRecord[]>,
  section: SectionRecord
): void {
  if (event.previousIndex === event.currentIndex) return;

  const items = section.items || [];

  moveItemInArray(
    items,
    event.previousIndex,
    event.currentIndex
  );

  section.items = items;

  const requests = items.map((item, index) => {
    item.position = index;

    return this.editorService.updateItem(item.id, {
      position: index
    });
  });

  forkJoin(requests).subscribe({
    next: () => this.showSuccess('Bullet order saved.'),
    error: () => {
      this.errorMessage = 'Bullet order could not be saved.';
      this.loadEditor();
    }
  });
}

  createVersion(): void {
    const label = this.versionLabel.trim() || `Version ${this.versions.length + 1}`;
    const snapshot = JSON.stringify({ document: this.document, sections: this.sections });
    this.editorService.createVersion({ documentId: this.documentId, label, snapshot }).subscribe({
      next: response => {
        this.versions = [response.version, ...this.versions];
        this.versionLabel = '';
        this.showSuccess('Version saved.');
      },
      error: () => this.errorMessage = 'The version could not be saved.'
    });
  }

  createShare(): void {
    const base = (this.document?.title || 'resume').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const slug = `${base || 'resume'}-${Date.now().toString(36).slice(-5)}`;
    this.sharesService.create(this.documentId, slug).subscribe({
      next: response => {
        this.shares = [response.share, ...this.shares];
        this.showSuccess('Public link created.');
      },
      error: () => this.errorMessage = 'The public link could not be created.'
    });
  }

  revokeShare(share: ShareRecord): void {
    this.sharesService.remove(share.id).subscribe({
      next: () => this.shares = this.shares.filter(item => item.id !== share.id),
      error: () => this.errorMessage = 'The link could not be revoked.'
    });
  }

  shareUrl(share: ShareRecord): string {
    return `${window.location.origin}/r/${share.slug}`;
  }

  copyShare(share: ShareRecord): void {
    navigator.clipboard.writeText(this.shareUrl(share)).then(() => this.showSuccess('Link copied.'));
  }
onProfilePhotoSelected(event: Event): void {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];

  this.profilePhotoError = '';

  if (!file) {
    return;
  }

  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/webp'
  ];

  if (!allowedTypes.includes(file.type)) {
    this.profilePhotoError =
      'Only JPG, PNG or WebP images are allowed.';

    input.value = '';
    return;
  }

  const maximumSize = 1024 * 1024; // 1 MB

  if (file.size > maximumSize) {
    this.profilePhotoError =
      'Image must be smaller than 1 MB.';

    input.value = '';
    return;
  }

  const reader = new FileReader();

  reader.onload = (): void => {
    const imageSource = reader.result;

    if (typeof imageSource !== 'string') {
      this.profilePhotoError =
        'Image could not be loaded.';

      return;
    }

    const image = new Image();

    image.onload = (): void => {
      const cropSize = Math.min(
        image.width,
        image.height
      );

      const sourceX =
        (image.width - cropSize) / 2;

      const sourceY =
        (image.height - cropSize) / 2;

      const canvas =
        document.createElement('canvas');

      canvas.width = 120;
      canvas.height = 120;

      const context =
        canvas.getContext('2d');

      if (!context) {
        this.profilePhotoError =
          'Image could not be processed.';

        return;
      }

      // Circular crop
      context.save();
      context.beginPath();
      context.arc(
        60,
        60,
        60,
        0,
        Math.PI * 2
      );
      context.closePath();
      context.clip();

      context.drawImage(
        image,
        sourceX,
        sourceY,
        cropSize,
        cropSize,
        0,
        0,
        120,
        120
      );

      context.restore();

      this.profilePhoto =
        canvas.toDataURL('image/png');
    };

    image.onerror = (): void => {
      this.profilePhotoError =
        'Image could not be processed.';
    };

    image.src = imageSource;
  };

  reader.onerror = (): void => {
    this.profilePhotoError =
      'Image could not be loaded.';
  };

  reader.readAsDataURL(file);
}
 exportPdf(): void {
  const html = this.buildResumeHtml();
  this.exportService.exportPdf(this.documentId, html).subscribe({
    next: (blob) => this.exportService.downloadFile(blob, `${this.document?.title || 'resume'}.pdf`),
    error: () => this.errorMessage = 'PDF export failed.'
  });
}

exportDocx(): void {
  const html = this.buildDocxHtml();
  this.exportService.exportDocx(this.documentId, html).subscribe({
    next: (blob) => this.exportService.downloadFile(blob, `${this.document?.title || 'resume'}.docx`),
    error: () => this.errorMessage = 'DOCX export failed.'
  });
}
private escapeHtml(value: string | null | undefined): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
private buildDocxHtml(): string {
  const name = this.escapeHtml(this.profileName);
  const email = this.escapeHtml(this.auth.getUser()?.email || '');
  const title = this.escapeHtml(this.document?.title || 'Resume');

  const safePhoto =
    /^data:image\/(jpeg|png|webp);base64,[a-z0-9+/=]+$/i.test(
      this.profilePhoto
    )
      ? this.profilePhoto
      : '';

  const photoHtml = safePhoto
    ? `
      <p>
        <img
          src="${safePhoto}"
          width="90"
          height="90"
          alt="Profile photo"
        />
      </p>
    `
    : '';

  const sectionsHtml = this.sections
    .map(section => {
      const items = (section.items || [])
        .map(
          item => `
            <li>${this.escapeHtml(item.content)}</li>
          `
        )
        .join('');

      return `
        <h2>${this.escapeHtml(section.heading)}</h2>
        <ul>${items}</ul>
      `;
    })
    .join('');

  return `
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
      </head>

      <body
        style="
          font-family: Arial, Helvetica, sans-serif;
          color: #202522;
        "
      >
        ${photoHtml}

        <h1>${name}</h1>

        <p>
          <strong>${title}</strong>
        </p>

        ${email ? `<p>${email}</p>` : ''}

        <hr />

        ${sectionsHtml}
      </body>
    </html>
  `;
}
private buildResumeHtml(): string {
  const accent = /^#[0-9a-f]{6}$/i.test(this.previewAccent)
    ? this.previewAccent
    : '#087a5b';

  const name = this.escapeHtml(this.profileName);
  const email = this.escapeHtml(this.auth.getUser()?.email || '');
  const title = this.escapeHtml(this.document?.title || 'Resume');
  const initial = this.escapeHtml(
    this.profileName.trim().charAt(0).toUpperCase() || 'R'
  );
  const safePhoto =
  /^data:image\/(jpeg|png|webp);base64,[a-z0-9+/=]+$/i.test(this.profilePhoto)
    ? this.profilePhoto
    : '';

const profileImageHtml = safePhoto
  ? `
    <img
      class="avatar avatar-photo"
      src="${safePhoto}"
      alt="Profile photo"
    />
  `
  : `<p class="avatar">${initial}</p>`;

  const renderSections = (
    sections: SectionRecord[],
    sidebar: boolean
  ): string => {
    return sections
      .map(section => {
        const items = (section.items || [])
          .map(item => `<li>${this.escapeHtml(item.content)}</li>`)
          .join('');

        return `
          <section class="${sidebar ? 'sidebar-section' : 'main-section'}">
            <h3>${this.escapeHtml(section.heading)}</h3>
            <ul>${items}</ul>
          </section>
        `;
      })
      .join('');
  };

  const sidebarSections = this.sections.filter(section =>
    this.isSidebarSection(section)
  );

  const mainSections = this.sections.filter(section =>
    !this.isSidebarSection(section)
  );

  const resumeContent =
    this.previewLayout === 'sidebar'
      ? `
        <table class="resume-layout" role="presentation">
          <tr>
            <td class="resume-sidebar">
              <header class="sidebar-profile">
              ${profileImageHtml}
                <h1>${name}</h1>
                ${email ? `<p class="email">${email}</p>` : ''}
              </header>

              ${renderSections(sidebarSections, true)}
            </td>

            <td class="resume-main">
              ${renderSections(mainSections, false)}
            </td>
          </tr>
        </table>
      `
      : `
        <main class="simple-resume">
          <header class="simple-header">
            <h1>${name}</h1>
            <p>${title}</p>
            ${email ? `<p class="simple-email">${email}</p>` : ''}
          </header>

          ${renderSections(mainSections, false)}
        </main>
      `;

  return `
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">

        <style>
          * {
            box-sizing: border-box;
          }

          html,
          body {
            margin: 0;
            padding: 0;
          }

          body {
            color: #3f4743;
            background: #ffffff;
            font-family: Arial, Helvetica, sans-serif;
            font-size: 11px;
            line-height: 1.5;
          }

          .resume-layout {
            width: 100%;
            min-height: 277mm;
            border-collapse: collapse;
            border: 1px solid #cfd6d2;
            table-layout: fixed;
          }

          .resume-layout td {
            vertical-align: top;
          }

          .resume-sidebar {
            width: 34%;
            padding: 38px 24px;
            color: #ffffff;
            background: #1a211e;
          }

          .resume-main {
            width: 66%;
            padding: 44px 38px;
            background: #ffffff;
          }

          .sidebar-profile {
            margin-bottom: 28px;
          }

          .avatar {
            width: 60px;
            height: 60px;
            margin: 0 0 20px;
            border: 2px solid ${accent};
            border-radius: 50%;
            font-size: 18px;
            font-weight: 700;
            line-height: 56px;
            text-align: center;
          }

          .sidebar-profile h1 {
            margin: 0;
            color: #ffffff;
            font-size: 21px;
          }

          .email {
            margin: 7px 0 0;
            color: #b9c2bd;
            font-size: 10px;
            word-wrap: break-word;
          }

          .sidebar-section {
            margin-top: 25px;
          }

          .sidebar-section h3 {
            margin: 0 0 10px;
            padding-bottom: 7px;
            color: #ffffff;
            border-bottom: 1px solid ${accent};
            font-size: 12px;
            text-transform: uppercase;
          }

          .sidebar-section ul {
            margin: 0;
            padding-left: 16px;
          }

          .sidebar-section li {
            margin-bottom: 6px;
            color: #d7ddd9;
            font-size: 10px;
            word-wrap: break-word;
          }

          .main-section {
            margin-bottom: 24px;
            page-break-inside: avoid;
          }

          .main-section h3 {
            margin: 0 0 10px;
            padding-bottom: 6px;
            color: #171b19;
            border-bottom: 2px solid ${accent};
            font-size: 13px;
            text-transform: uppercase;
          }

          .main-section ul {
            margin: 0;
            padding-left: 18px;
          }

          .main-section li {
            margin-bottom: 6px;
            color: #3f4743;
          }

          .simple-resume {
  min-height: 277mm;
  padding: 35px;
  background: #ffffff;
  border: 1px solid #cfd6d2;
}
          .simple-header {
            margin-bottom: 28px;
            padding-bottom: 14px;
            border-bottom: 2px solid ${accent};
          }

          .simple-header h1 {
            margin: 0;
            color: #171b19;
            font-size: 28px;
          }

          .simple-header p {
            margin: 5px 0 0;
            color: ${accent};
          }

          .simple-header .simple-email {
            color: #68716c;
          }
        </style>
      </head>

      <body>
        ${resumeContent}
      </body>
    </html>
  `;
}


  printPreview(): void {
    window.print();
  }

  private showSuccess(message: string): void {
    this.successMessage = message;
    window.setTimeout(() => this.successMessage = '', 2200);
  }
}
