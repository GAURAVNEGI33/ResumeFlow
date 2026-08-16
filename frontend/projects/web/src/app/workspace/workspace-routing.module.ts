import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { WorkspaceShellComponent } from './workspace-shell.component';
import { DocumentsComponent } from './pages/documents/documents.component';
import { TemplateGalleryComponent } from './pages/template-gallery/template-gallery.component';
import { ApplicationsComponent } from './pages/applications/applications.component';
import { SharesComponent } from './pages/shares/shares.component';
import { ExportsComponent } from './pages/exports/exports.component';
import { EditorComponent } from './pages/editor/editor.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { ChangePasswordComponent } from './pages/change-password/change-password.component';

const routes: Routes = [
  {
    path: '',
    component: WorkspaceShellComponent,
    canActivateChild: [AuthGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'documents', component: DocumentsComponent },
      { path: 'templates', component: TemplateGalleryComponent },
      { path: 'applications', component: ApplicationsComponent },
      { path: 'shares', component: SharesComponent },
      { path: 'exports', component: ExportsComponent },
      { path: 'editor/:id', component: EditorComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'change-password', component: ChangePasswordComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkspaceRoutingModule {}
