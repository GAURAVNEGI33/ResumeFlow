import { AfterViewInit, Component, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements AfterViewInit, OnDestroy {
  private revealObserver?: IntersectionObserver;

  ngAfterViewInit(): void {
    const revealItems = Array.from(document.querySelectorAll<HTMLElement>('.reveal'));

    if (!('IntersectionObserver' in window)) {
      revealItems.forEach(item => item.classList.add('revealed'));
      return;
    }

    this.revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          this.revealObserver?.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px'
    });

    revealItems.forEach(item => this.revealObserver?.observe(item));
  }

  ngOnDestroy(): void {
    this.revealObserver?.disconnect();
  }
}
