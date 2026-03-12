import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  IonContent,
  IonRefresher,
  IonRefresherContent,
  IonIcon,
  IonSpinner,
  ViewWillEnter,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { timeOutline, trashOutline, addCircleOutline } from 'ionicons/icons';
import { GenerationService } from '../services/generation.service';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';
import { GenerationItem } from '../models/generation.model';
import { GenerationCardComponent } from '../components/generation-card/generation-card.component';
import { SkeletonLoaderComponent } from '../components/skeleton-loader/skeleton-loader.component';
import { TranslatePipe } from '../pipes/translate.pipe';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonRefresher,
    IonRefresherContent,
    IonIcon,
    IonSpinner,
    GenerationCardComponent,
    SkeletonLoaderComponent,
    TranslatePipe,
  ],
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
})
export class HistoryPage implements ViewWillEnter {
  items = signal<GenerationItem[]>([]);
  isLoading = signal<boolean>(false);
  isLoadingMore = signal<boolean>(false);
  hasMore = signal<boolean>(false);
  error = signal<string | null>(null);

  private page = 0;
  private readonly LIMIT = 100;

  constructor(
    private generationService: GenerationService,
    public auth: AuthService,
    private toast: ToastService,
    private router: Router
  ) {
    addIcons({ timeOutline, trashOutline, addCircleOutline });
  }

  ionViewWillEnter(): void {
    if (!this.auth.token) return;
    this.loadHistory();
  }

  loadHistory(): void {
    this.isLoading.set(true);
    this.error.set(null);
    this.page = 1;

    this.generationService.getHistory(0, this.LIMIT).subscribe({
      next: ({ items, hasMore }) => {
        this.items.set(items);
        this.hasMore.set(hasMore);
        this.isLoading.set(false);
      },
      error: () => {
        this.error.set('Failed to load history');
        this.isLoading.set(false);
      },
    });
  }

  loadMore(): void {
    if (this.isLoadingMore() || !this.hasMore()) return;
    this.isLoadingMore.set(true);
    const nextPage = this.page + 1;

    this.generationService.getHistory(nextPage, this.LIMIT).subscribe({
      next: ({ items, hasMore }) => {
        this.items.update((current) => [...current, ...items]);
        this.hasMore.set(hasMore);
        this.page = nextPage;
        this.isLoadingMore.set(false);
      },
      error: () => {
        this.isLoadingMore.set(false);
      },
    });
  }

  handleRefresh(event: CustomEvent): void {
    this.page = 1;
    this.generationService.getHistory(1, this.LIMIT).subscribe({
      next: ({ items, hasMore }) => {
        this.items.set(items);
        this.hasMore.set(hasMore);
        (event.target as HTMLIonRefresherElement).complete();
      },
      error: () => {
        (event.target as HTMLIonRefresherElement).complete();
      },
    });
  }

  openResult(item: GenerationItem): void {
    this.router.navigate(['/tabs/gen', item._id]);
  }

  goToLogin(): void {
    this.router.navigate(['/auth/login'], { queryParams: { returnUrl: '/tabs/history' } });
  }

  goToRegister(): void {
    this.router.navigate(['/auth/register'], { queryParams: { returnUrl: '/tabs/history' } });
  }
}
