import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonContent, IonSpinner } from '@ionic/angular/standalone';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-google-success',
  standalone: true,
  imports: [IonContent, IonSpinner],
  template: `
    <ion-content [fullscreen]="true" class="ion-no-padding">
      <div class="min-h-screen flex flex-col items-center justify-center bg-cream dark:bg-[#0F1A12] gap-4">
        @if (canClose()) {
          <p class="text-sm text-[#8A8A8A] dark:text-cream/50">Login successful — you can close this tab.</p>
        } @else {
          <ion-spinner name="crescent" class="text-primary w-8 h-8"></ion-spinner>
        }
      </div>
    </ion-content>
  `,
})
export class GoogleSuccessPage implements OnInit {
  canClose = signal(false);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthService,
  ) {}

  async ngOnInit(): Promise<void> {
    const token = this.route.snapshot.queryParamMap.get('token');
    if (token) {
      // Signal the parent tab via localStorage ('storage' event fires in other tabs)
      localStorage.setItem('google_auth_token', token);

      // Try closing — works if this tab was opened via window.open()
      window.close();

      // If still here after a short delay, either show close message or navigate
      await new Promise((r) => setTimeout(r, 300));

      if (localStorage.getItem('google_auth_token') === null) {
        // Parent tab already consumed the token — show "close this tab"
        this.canClose.set(true);
      } else {
        // No parent listening (direct navigation) — handle normally
        localStorage.removeItem('google_auth_token');
        await this.auth.handleGoogleToken(token);
        this.router.navigateByUrl('/tabs/home', { replaceUrl: true });
      }
    } else {
      this.router.navigateByUrl('/auth/login', { replaceUrl: true });
    }
  }
}
