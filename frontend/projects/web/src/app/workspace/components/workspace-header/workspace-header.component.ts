import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth/auth.service';

interface WorkspaceLink {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-workspace-header',
  templateUrl: './workspace-header.component.html',
  styleUrls: ['./workspace-header.component.scss']
})
export class WorkspaceHeaderComponent {
  menuOpen = false;
  mobileOpen = false;

  readonly links: WorkspaceLink[] = [
    { label: 'Dashboard', icon: 'dashboard', route: '/dashboard' },
    { label: 'Documents', icon: 'description', route: '/documents' },
    { label: 'Templates', icon: 'palette', route: '/templates' },
    { label: 'Applications', icon: 'work_outline', route: '/applications' },
    { label: 'Shared links', icon: 'link', route: '/shares' },
    { label: 'Exports', icon: 'download', route: '/exports' }
  ];

  constructor(public auth: AuthService, private router: Router) {}

  get userName(): string {
    return this.auth.getUser()?.name || 'ResumeFlow user';
  }

  get initials(): string {
    const parts = this.userName.trim().split(/\s+/).filter(Boolean);
    if (!parts.length) return '?';
    return parts.slice(0, 2).map(part => part.charAt(0).toUpperCase()).join('');
  }

  toggleAccountMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  toggleMobileMenu(): void {
    this.mobileOpen = !this.mobileOpen;
  }

  closeMenus(): void {
    this.menuOpen = false;
    this.mobileOpen = false;
  }

  logout(): void {
    this.auth.logout().subscribe({
      next: () => this.finishLogout(),
      error: () => this.finishLogout()
    });
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closeMenus();
  }

  private finishLogout(): void {
    this.auth.clearToken();
    this.closeMenus();
    this.router.navigate(['/']);
  }
}
