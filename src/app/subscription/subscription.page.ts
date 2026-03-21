import {
  AfterViewInit,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  signal,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  checkmarkCircleOutline,
  checkmarkOutline,
  closeOutline,
  flashOutline,
  infiniteOutline,
  starOutline,
  calendarOutline,
  lockClosedOutline,
  personOutline,
  alertCircleOutline,
} from 'ionicons/icons';
import { AuthService } from '../services/auth.service';
import { TranslatePipe } from '../pipes/translate.pipe';
import { environment } from '../../environments/environment';

export type SubscriptionPlan = 'free' | 'weekly' | 'monthly' | 'yearly' | 'lifetime';

export interface PlanConfig {
  id: SubscriptionPlan;
  nameKey: string;
  price: string;
  priceSubKey: string;
  priceSub2Key?: string;
  ctaKey: string;
  badge?: string;
  savings?: string;
  popular?: boolean;
  icon: string;
  color: string;
  gradient: string;
}

@Component({
  selector: 'app-subscription',
  standalone: true,
  imports: [CommonModule, IonContent, IonIcon, TranslatePipe],
  templateUrl: './subscription.page.html',
  styleUrls: ['./subscription.page.scss'],
})
export class SubscriptionPage implements AfterViewInit, OnDestroy {
  @ViewChild('paypalContainer') paypalContainerRef!: ElementRef<HTMLDivElement>;

  readonly plans: PlanConfig[] = [
    {
      id: 'free',
      nameKey: 'sub.free.name',
      price: '$0',
      priceSubKey: 'sub.free.billing',
      ctaKey: 'sub.free.cta',
      icon: 'flash-outline',
      color: '#6B7280',
      gradient: 'linear-gradient(135deg, #6B7280, #374151)',
    },
    {
      id: 'weekly',
      nameKey: 'sub.weekly.name',
      price: '$4.99',
      priceSubKey: 'sub.weekly.billing',
      ctaKey: 'sub.subscribe_now',
      icon: 'flash-outline',
      color: '#10B981',
      gradient: 'linear-gradient(135deg, #10B981, #059669)',
    },
    {
      id: 'monthly',
      nameKey: 'sub.monthly.name',
      price: '$0.47',
      priceSubKey: 'sub.monthly.billing',
      ctaKey: 'sub.subscribe_now',
      icon: 'calendar-outline',
      color: '#3B82F6',
      gradient: 'linear-gradient(135deg, #3B82F6, #1D4ED8)',
    },
    {
      id: 'yearly',
      nameKey: 'sub.yearly.name',
      price: '$3.50',
      priceSubKey: 'sub.yearly.billing',
      priceSub2Key: 'sub.yearly.billing2',
      ctaKey: 'sub.subscribe_now',
      badge: 'sub.most_popular',
      savings: 'sub.yearly.savings',
      popular: true,
      icon: 'star-outline',
      color: '#F97316',
      gradient: 'linear-gradient(135deg, #F97316, #C2410C)',
    },
    {
      id: 'lifetime',
      nameKey: 'sub.lifetime.name',
      price: '$139.99',
      priceSubKey: 'sub.lifetime.billing',
      ctaKey: 'sub.buy_now',
      icon: 'infinite-outline',
      color: '#8B5CF6',
      gradient: 'linear-gradient(135deg, #8B5CF6, #6D28D9)',
    },
  ];

  readonly featureKeys = [
    'sub.feature.unlimited_gen',
    'sub.feature.unlimited_app',
    'sub.feature.style_transfer',
    'sub.feature.all_features',
    'sub.feature.faster',
    'sub.feature.no_watermark',
    'sub.feature.priority',
  ];

  selectedPlan = signal<SubscriptionPlan>('yearly');
  loading = signal(false);
  error = signal<string | null>(null);

  private paypalButtons: any = null;
  private paypalScriptLoaded = false;

  constructor(
    public auth: AuthService,
    private http: HttpClient,
    private router: Router,
    private ngZone: NgZone,
  ) {
    addIcons({
      checkmarkCircleOutline,
      checkmarkOutline,
      closeOutline,
      flashOutline,
      infiniteOutline,
      starOutline,
      calendarOutline,
      lockClosedOutline,
      personOutline,
      alertCircleOutline,
    });
  }

  ngAfterViewInit(): void {
    this.loadPayPalScript().then(() => this.renderPayPalButtons());
  }

  ngOnDestroy(): void {
    this.destroyPayPalButtons();
  }

  get isLoggedIn(): boolean {
    return !!this.auth.token;
  }

  get isSubscribed(): boolean {
    const sub = (this.auth.currentUser as any)?.subscription;
    return sub && sub !== 'free';
  }

  navigateToLogin(): void {
    this.router.navigate(['/auth/login'], {
      queryParams: { returnUrl: '/tabs/subscription' },
    });
  }

  select(plan: SubscriptionPlan): void {
    this.selectedPlan.set(plan);
    this.error.set(null);
    if (this.paypalScriptLoaded) {
      this.renderPayPalButtons();
    }
  }

  close(): void {
    const nav = this.router.lastSuccessfulNavigation;
    const from = (nav?.extras?.state as any)?.from;
    if (from) {
      this.router.navigateByUrl(from);
    } else {
      this.router.navigate(['/tabs/home']);
    }
  }

  // Called for the free plan only
  continueWithFree(): void {
    this.close();
  }

  private async loadPayPalScript(): Promise<void> {
    if (this.paypalScriptLoaded) return;

    return new Promise((resolve, reject) => {
      const existing = document.getElementById('paypal-sdk');
      if (existing) {
        this.paypalScriptLoaded = true;
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.id = 'paypal-sdk';
      script.src = `https://www.paypal.com/sdk/js?client-id=${environment.paypalClientId}&currency=USD&components=buttons&enable-funding=card`;
      script.onload = () => {
        this.paypalScriptLoaded = true;
        resolve();
      };
      script.onerror = () => reject(new Error('Failed to load PayPal SDK'));
      document.head.appendChild(script);
    });
  }

  private destroyPayPalButtons(): void {
    if (this.paypalButtons) {
      try {
        this.paypalButtons.close();
      } catch (_) {}
      this.paypalButtons = null;
    }
  }

  private renderPayPalButtons(): void {
    const plan = this.selectedPlan();

    // For free plan, no PayPal buttons needed
    if (plan === 'free') {
      this.destroyPayPalButtons();
      return;
    }

    const paypal = (window as any)['paypal'];
    if (!paypal || !this.paypalContainerRef?.nativeElement) return;

    this.destroyPayPalButtons();

    // Clear container before re-render
    this.paypalContainerRef.nativeElement.innerHTML = '';

    this.paypalButtons = paypal.Buttons({
      style: {
        layout: 'vertical',
        color: 'gold',
        shape: 'rect',
        label: 'pay',
        height: 48,
      },
      createOrder: () => {
        return firstValueFrom(
          this.http.post<{ orderId: string }>(
            `${environment.apiUrl}/subscription/create-order`,
            { plan },
          ),
        ).then((res) => res!.orderId);
      },
      onApprove: (data: { orderID: string }) => {
        this.ngZone.run(async () => {
          this.loading.set(true);
          this.error.set(null);
          try {
            await firstValueFrom(
              this.http.post(
                `${environment.apiUrl}/subscription/capture-order`,
                { orderId: data.orderID, plan },
              ),
            );
            await this.auth.refreshUser();
            this.router.navigate(['/tabs/home'], { replaceUrl: true });
          } catch (err: any) {
            this.error.set(
              err?.error?.message || 'Payment failed. Please try again.',
            );
          } finally {
            this.loading.set(false);
          }
        });
      },
      onError: (err: any) => {
        this.ngZone.run(() => {
          console.error('PayPal error:', err);
          this.error.set('Payment failed. Please try again.');
        });
      },
      onCancel: () => {
        this.ngZone.run(() => {
          this.error.set(null);
        });
      },
    });

    if (this.paypalButtons.isEligible()) {
      this.paypalButtons.render(this.paypalContainerRef.nativeElement);
    }
  }
}
