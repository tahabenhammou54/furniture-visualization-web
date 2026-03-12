import { Component, inject, signal } from '@angular/core';
import { Router, RouterOutlet, RouterLink, RouterLinkActive, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { TranslatePipe } from '../pipes/translate.pipe';
import { AuthService } from '../services/auth.service';
import { IconComponent } from '../shared/icon/icon.component';
import { ToastContainerComponent } from '../shared/toast-container/toast-container.component';

const TAB_ROUTES = ['/tabs/home', '/tabs/history', '/tabs/profile', '/tabs/settings'];

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  imports: [RouterOutlet, RouterLink, RouterLinkActive, TranslatePipe, IconComponent, ToastContainerComponent],
})
export class TabsPage {
  public auth = inject(AuthService);
  hideTabBar = signal(false);

  constructor() {
    const router = inject(Router);
    router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe((e) => {
        const url = (e as NavigationEnd).urlAfterRedirects;
        this.hideTabBar.set(!TAB_ROUTES.some((r) => url === r || url.startsWith(r + '?')));
      });
  }
}
