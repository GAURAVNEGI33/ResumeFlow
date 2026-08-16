import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'ResumeFlow';
  showPublicLayout = true;

  constructor(private router: Router) {}

  ngOnInit() {
    this.updateLayout(this.router.url);

    this.router.events.pipe(
      filter((event: any) => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.updateLayout(event.urlAfterRedirects);
    });
  }

  private updateLayout(url: string): void {
    this.showPublicLayout = url === '/' || url.startsWith('/#');
  }
}
