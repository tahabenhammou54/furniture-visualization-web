import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonContent, IonSpinner } from '@ionic/angular/standalone';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-google-success',
  standalone: true,
  imports: [IonContent, IonSpinner],
  template: `
    <ion-content [fullscreen]="true" class="ion-no-padding">
      <div class="min-h-screen flex items-center justify-center bg-cream dark:bg-[#0F1A12]">
        <ion-spinner name="crescent" class="text-primary w-8 h-8"></ion-spinner>
      </div>
    </ion-content>
  `,
})
export class GoogleSuccessPage implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthService,
  ) {}

  async ngOnInit(): Promise<void> {
    const token = this.route.snapshot.queryParamMap.get('token');
    if (token) {
      await this.auth.handleGoogleToken(token);
      this.router.navigateByUrl('/tabs/home', { replaceUrl: true });
    } else {
      this.router.navigateByUrl('/auth/login', { replaceUrl: true });
    }
  }
}
