import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.scss']
})
export class HeroComponent {
  scrollShift = 0;

  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.scrollShift = Math.min(window.scrollY * 0.055, 34);
  }
}
