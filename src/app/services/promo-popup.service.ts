import { Injectable, NgZone, signal } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class PromoPopupService {
  isOpen = signal(false);

  constructor(private auth: AuthService, private zone: NgZone) {}

  /** Call after any successful generation. Only shows for non-Pro users. */
  notifyGeneration(): void {
    // Read subscription directly from the user object (avoids stale computed cache)
    const sub = (this.auth.currentUser as any)?.subscription;
    const isPro = sub && sub !== 'free';
    if (isPro) return;

    setTimeout(() => {
      // Run inside Angular zone to guarantee change detection fires
      this.zone.run(() => this.isOpen.set(true));
    }, 5000);
  }

  dismiss(): void {
    this.isOpen.set(false);
  }
}
