import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { TranslatePipe } from '../pipes/translate.pipe';
import { IconComponent } from '../shared/icon/icon.component';
import { environment } from '../../environments/environment';

export type SubscriptionPlan = 'free' | 'weekly' | 'yearly' | 'lifetime';

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
  imports: [CommonModule, TranslatePipe, IconComponent],
  templateUrl: './subscription.page.html',
  styleUrls: ['./subscription.page.scss'],
})
export class SubscriptionPage {
  readonly plans: PlanConfig[] = [
    { id: 'free', nameKey: 'sub.free.name', price: '0 MAD', priceSubKey: 'sub.free.billing', ctaKey: 'sub.free.cta', icon: 'flash-outline', color: '#6B7280', gradient: 'linear-gradient(135deg, #6B7280, #374151)' },
    { id: 'weekly', nameKey: 'sub.weekly.name', price: '71.99 MAD', priceSubKey: 'sub.weekly.billing', ctaKey: 'sub.subscribe_now', icon: 'calendar-outline', color: '#3B82F6', gradient: 'linear-gradient(135deg, #3B82F6, #1D4ED8)' },
    { id: 'yearly', nameKey: 'sub.yearly.name', price: '354.99 MAD', priceSubKey: 'sub.yearly.billing', ctaKey: 'sub.subscribe_now', badge: 'sub.most_popular', savings: 'sub.yearly.savings', popular: true, icon: 'star-outline', color: '#F97316', gradient: 'linear-gradient(135deg, #F97316, #C2410C)' },
    { id: 'lifetime', nameKey: 'sub.lifetime.name', price: '589.99 MAD', priceSubKey: 'sub.lifetime.billing', ctaKey: 'sub.buy_now', icon: 'infinite-outline', color: '#8B5CF6', gradient: 'linear-gradient(135deg, #8B5CF6, #6D28D9)' },
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

  constructor(
    public auth: AuthService,
    private http: HttpClient,
    private router: Router,
  ) {}

  get isSubscribed(): boolean {
    const sub = (this.auth.currentUser as any)?.subscription;
    return sub && sub !== 'free';
  }

  select(plan: SubscriptionPlan): void {
    this.selectedPlan.set(plan);
  }

  async subscribe(): Promise<void> {
    const plan = this.selectedPlan();
    if (plan === 'free') {
      this.close();
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    try {
      await this.http.post(`${environment.apiUrl}/subscription/purchase`, { plan }).toPromise();
      await this.auth.refreshUser();
      this.router.navigate(['/tabs/home'], { replaceUrl: true });
    } catch (err: any) {
      this.error.set(err?.error?.message || 'Purchase failed. Please try again.');
    } finally {
      this.loading.set(false);
    }
  }

  close(): void {
    const nav = this.router.lastSuccessfulNavigation as any;
    const from = nav?.extras?.state?.from;
    if (from) {
      this.router.navigateByUrl(from);
    } else {
      this.router.navigate(['/tabs/home']);
    }
  }
}
