import { Component, inject, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { SeoService } from './services/seo.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent implements OnInit {
  private router = inject(Router);
  private seo    = inject(SeoService);

  ngOnInit(): void {
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((e: NavigationEnd) => {
        const url = e.urlAfterRedirects;
        const path = url.split('?')[0].split('#')[0];

        // Redirect root path with query params (e.g. Google Ads ?q= placeholders) to clean URL
        if (path === '/' && url.includes('?')) {
          this.router.navigate(['/'], { replaceUrl: true });
          return;
        }

        this.seo.update(path);
      });
  }
}
