import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { APP_INITIALIZER, isDevMode } from '@angular/core';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { authInterceptor } from './app/interceptors/auth.interceptor';
import { paywallInterceptor } from './app/interceptors/paywall.interceptor';
import { AuthService } from './app/services/auth.service';
import { ThemeService } from './app/services/theme.service';
import { I18nService } from './app/services/i18n.service';
import { provideServiceWorker } from '@angular/service-worker';

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideHttpClient(withInterceptors([authInterceptor, paywallInterceptor])),
    {
      provide: APP_INITIALIZER,
      useFactory: (auth: AuthService, theme: ThemeService, i18n: I18nService) => async () => {
        theme.initialize();
        await i18n.initialize();
        await auth.initialize();
      },
      deps: [AuthService, ThemeService, I18nService],
      multi: true,
    }, provideServiceWorker('ngsw-worker.js', {
            enabled: !isDevMode(),
            registrationStrategy: 'registerWhenStable:30000'
          }),
  ],
});
