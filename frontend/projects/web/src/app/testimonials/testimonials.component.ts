import { Component, OnDestroy, OnInit } from '@angular/core';

interface Testimonial {
  quote: string;
  name: string;
  role: string;
  initials: string;
}

@Component({
  selector: 'app-testimonials',
  templateUrl: './testimonials.component.html',
  styleUrls: ['./testimonials.component.scss']
})
export class TestimonialsComponent implements OnInit, OnDestroy {
  currentIndex = 0;
  private intervalId?: ReturnType<typeof setInterval>;

  testimonials: Testimonial[] = [
    {
      quote: 'ResumeFlow made it easy to turn ordinary responsibilities into clear, confident achievement statements.',
      name: 'JESSICA MARTINEZ',
      role: 'Marketing professional',
      initials: 'JM'
    },
    {
      quote: 'The live preview kept the process simple. I always knew exactly how the final resume would look.',
      name: 'ROBERT KIM',
      role: 'Sales professional',
      initials: 'RK'
    },
    {
      quote: 'The ATS guidance helped me remove clutter and focus on the skills that actually matched the role.',
      name: 'AISHA PATEL',
      role: 'Data professional',
      initials: 'AP'
    },
    {
      quote: 'A clean workflow, strong templates and no design confusion. I could focus completely on my content.',
      name: 'DAVID CHEN',
      role: 'Software engineer',
      initials: 'DC'
    }
  ];

  ngOnInit(): void {
    this.startAutoPlay();
  }

  ngOnDestroy(): void {
    this.stopAutoPlay();
  }

  next(): void {
    this.currentIndex = (this.currentIndex + 1) % this.testimonials.length;
  }

  prev(): void {
    this.currentIndex = (this.currentIndex - 1 + this.testimonials.length) % this.testimonials.length;
  }

  goTo(index: number): void {
    this.currentIndex = index;
  }

  pauseAutoPlay(): void {
    this.stopAutoPlay();
  }

  resumeAutoPlay(): void {
    this.startAutoPlay();
  }

  private startAutoPlay(): void {
    this.stopAutoPlay();
    this.intervalId = setInterval(() => this.next(), 5500);
  }

  private stopAutoPlay(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
  }
}
