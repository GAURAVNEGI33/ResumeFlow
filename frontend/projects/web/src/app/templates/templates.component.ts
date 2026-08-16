import { Component, ElementRef, ViewChild } from '@angular/core';

interface ResumeTemplate {
  slug: string;
  name: string;
  category: string;
  bestFor: string;
}

@Component({
  selector: 'app-templates',
  templateUrl: './templates.component.html',
  styleUrls: ['./templates.component.scss']
})
export class TemplatesComponent {
  @ViewChild('carouselTrack') carouselTrack?: ElementRef<HTMLElement>;

  templates: ResumeTemplate[] = [
    { slug: 'modern', name: 'Modern Edge', category: 'MODERN', bestFor: 'Software and product roles' },
    { slug: 'professional', name: 'Executive Clear', category: 'PROFESSIONAL', bestFor: 'Business and corporate roles' },
    { slug: 'creative', name: 'Creative Focus', category: 'CREATIVE', bestFor: 'Design and marketing roles' },
    { slug: 'minimal', name: 'Minimal ATS', category: 'MINIMAL', bestFor: 'Universal applications' }
  ];

  selectedTemplate = 'modern';

  get selectedTemplateName(): string {
    return this.templates.find(template => template.slug === this.selectedTemplate)?.name || 'Modern Edge';
  }

  selectTemplate(slug: string): void {
    this.selectedTemplate = slug;
  }

  scrollNext(): void {
    this.carouselTrack?.nativeElement.scrollBy({ left: 338, behavior: 'smooth' });
  }

  scrollPrev(): void {
    this.carouselTrack?.nativeElement.scrollBy({ left: -338, behavior: 'smooth' });
  }
}
