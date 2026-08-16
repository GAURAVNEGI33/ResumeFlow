import { Component, HostListener, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnDestroy {
  isScrolled = false;
  isMobileMenuOpen = false;
  today = new Date();

  constructor(
    public auth: AuthService,
    private router: Router
  ) {}

  @HostListener('window:scroll')
  onScroll(): void {
    this.isScrolled = window.scrollY > 30;
  }

  @HostListener('window:keydown.escape')
  onEscape(): void {
    this.closeMobileMenu();
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    document.body.classList.toggle('menu-open', this.isMobileMenuOpen);
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
    document.body.classList.remove('menu-open');
  }

  ngOnDestroy(): void {
    document.body.classList.remove('menu-open');
  }

  logout(): void {
    this.auth.logout().subscribe({
      next: () => {
        this.auth.clearToken();
        this.closeMobileMenu();
        this.router.navigate(['/']);
      },
      error: () => {
        // Fallback clear if server fails
        this.auth.clearToken();
        this.closeMobileMenu();
        this.router.navigate(['/']);
      }
    });
  }
}
