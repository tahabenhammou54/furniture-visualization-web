import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  starOutline,
  closeOutline,
  checkmarkOutline,
  flashOutline,
  infiniteOutline,
  arrowForwardOutline,
} from 'ionicons/icons';
import { PromoPopupService } from '../../services/promo-popup.service';

@Component({
  selector: 'app-promo-popup',
  standalone: true,
  imports: [CommonModule, IonIcon],
  templateUrl: './promo-popup.component.html',
})
export class PromoPopupComponent {
  readonly benefits = [
    { icon: 'infinite-outline', text: 'Unlimited AI generations — no daily cap' },
    { icon: 'flash-outline',    text: 'Priority processing — 2× faster results' },
    { icon: 'star-outline',     text: 'No watermarks on any download' },
    { icon: 'star-outline',     text: 'Access every feature & style' },
  ];

  constructor(
    public promo: PromoPopupService,
    private router: Router,
  ) {
    addIcons({ starOutline, closeOutline, checkmarkOutline, flashOutline, infiniteOutline, arrowForwardOutline });
  }

  goToPricing(): void {
    this.promo.dismiss();
    this.router.navigate(['/tabs/subscription']);
  }

  dismiss(): void {
    this.promo.dismiss();
  }
}
