import { Component } from '@angular/core';

interface FaqItem {
  question: string;
  answer: string;
}

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent {
  openIndex: number | null = 0;

  faqItems: FaqItem[] = [
    {
      question: 'Is ResumeFlow free to use?',
      answer: 'The planned core workflow lets you create, edit and preview your resume without design software. Pricing decisions can be added later when the complete product flow is ready.'
    },
    {
      question: 'Are the templates ATS-friendly?',
      answer: 'The templates use clean headings, consistent spacing and readable content structure. Final ATS compatibility still depends on the job description and the information included in the resume.'
    },
    {
      question: 'Can I see changes while editing?',
      answer: 'Yes. The live preview is designed to update alongside the form so you can review content hierarchy and page balance before exporting.'
    },
    {
      question: 'Will my resume data stay private?',
      answer: 'Privacy is part of the product direction. Sensitive information should only be stored or processed when required, with clear user control over saved data.'
    },
    {
      question: 'Can I download the final resume as a PDF?',
      answer: 'PDF export is included in the planned workflow so the finished resume can be downloaded in a clean, application-ready format.'
    }
  ];

  toggle(index: number): void {
    this.openIndex = this.openIndex === index ? null : index;
  }
}
