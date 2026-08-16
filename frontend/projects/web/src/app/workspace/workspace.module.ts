import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { SharedModule } from '../shared/shared.module';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { NewResumeDialogComponent } from '../dashboard/components/new-resume-dialog/new-resume-dialog.component';
import { WorkspaceRoutingModule } from './workspace-routing.module';
import { WorkspaceShellComponent } from './workspace-shell.component';
import { WorkspaceHeaderComponent } from './components/workspace-header/workspace-header.component';
import { DocumentsComponent } from './pages/documents/documents.component';
import { TemplateGalleryComponent } from './pages/template-gallery/template-gallery.component';
import { ApplicationsComponent } from './pages/applications/applications.component';
import { SharesComponent } from './pages/shares/shares.component';
import { ExportsComponent } from './pages/exports/exports.component';
import { EditorComponent } from './pages/editor/editor.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { ChangePasswordComponent } from './pages/change-password/change-password.component';

@NgModule({
  declarations: [
    WorkspaceShellComponent,
    WorkspaceHeaderComponent,
    DashboardComponent,
    NewResumeDialogComponent,
    DocumentsComponent,
    TemplateGalleryComponent,
    ApplicationsComponent,
    SharesComponent,
    ExportsComponent,
    EditorComponent,
    ProfileComponent,
    ChangePasswordComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DragDropModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatProgressBarModule,
    MatSelectModule,
    MatSnackBarModule,
    SharedModule,
    WorkspaceRoutingModule,
    MatExpansionModule,
    MatSlideToggleModule
  ]
})
export class WorkspaceModule {}
