import { Component, EnvironmentInjector, inject, signal } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  homeOutline, home,
  timeOutline, time,
  personOutline, person,
  settingsOutline, settings,
  cubeOutline, cube,
  layersOutline,
} from 'ionicons/icons';
import { filter } from 'rxjs/operators';
import { TranslatePipe } from '../pipes/translate.pipe';
import { AuthService } from '../services/auth.service';

const TAB_ROUTES = ['/tabs/home', '/tabs/history', '/tabs/profile', '/tabs/settings'];

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, TranslatePipe],
})
export class TabsPage {
  public environmentInjector = inject(EnvironmentInjector);
  public auth = inject(AuthService);

  hideTabBar = signal(false);

  constructor() {
    addIcons({
      homeOutline, home,
      timeOutline, time,
      personOutline, person,
      settingsOutline, settings,
      cubeOutline, cube,
      layersOutline,
    });

    const router = inject(Router);
    router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe((e) => {
        const url = (e as NavigationEnd).urlAfterRedirects;
        this.hideTabBar.set(!TAB_ROUTES.some((r) => url === r));
      });
  }
}
