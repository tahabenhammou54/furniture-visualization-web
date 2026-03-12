import { Component, signal, computed, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import {
  IonContent,
  IonIcon,
  IonSpinner,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBackOutline, calendarOutline } from 'ionicons/icons';
import { GenerationService } from '../services/generation.service';
import { GenerationItem } from '../models/generation.model';
import { TranslatePipe } from '../pipes/translate.pipe';
import { ResultActionsComponent } from '../components/result-actions/result-actions.component';

@Component({
  selector: 'app-generation-detail',
  standalone: true,
  imports: [CommonModule, IonContent, IonIcon, IonSpinner, TranslatePipe, ResultActionsComponent],
  templateUrl: './generation-detail.page.html',
  styleUrls: ['./generation-detail.page.scss'],
})
export class GenerationDetailPage implements OnInit {
  item = signal<GenerationItem | null>(null);
  isLoading = signal<boolean>(true);
  error = signal<string | null>(null);
  sliderPos = signal<number>(50);

  afterUrl = computed(() => {
    const i = this.item();
    return i?.outputImageUrl || i?.imageUrl || '';
  });

  beforeUrl = computed(() => this.item()?.roomImage ?? '');
  hasBefore = computed(() => !!this.item()?.roomImage);

  constructor(
    private route: ActivatedRoute,
    private generationService: GenerationService,
    private location: Location
  ) {
    addIcons({ arrowBackOutline, calendarOutline });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    this.generationService.getById(id).subscribe({
      next: (item) => {
        this.item.set(item);
        this.isLoading.set(false);
      },
      error: () => {
        this.error.set('Failed to load');
        this.isLoading.set(false);
      },
    });
  }

  goBack(): void {
    this.location.back();
  }

  startSliderDrag(e: MouseEvent | TouchEvent, el: HTMLElement): void {
    e.preventDefault();
    this.updateSlider(e, el);
    const onMove = (ev: MouseEvent | TouchEvent) => { ev.preventDefault(); this.updateSlider(ev, el); };
    const onUp = () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('touchmove', onMove as EventListener);
      document.removeEventListener('mouseup', onUp);
      document.removeEventListener('touchend', onUp);
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('touchmove', onMove as EventListener, { passive: false });
    document.addEventListener('mouseup', onUp);
    document.addEventListener('touchend', onUp);
  }

  private updateSlider(e: MouseEvent | TouchEvent, el: HTMLElement): void {
    const rect = el.getBoundingClientRect();
    const clientX = 'touches' in e ? (e as TouchEvent).touches[0].clientX : (e as MouseEvent).clientX;
    const pos = ((clientX - rect.left) / rect.width) * 100;
    this.sliderPos.set(Math.min(100, Math.max(0, pos)));
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString(undefined, {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  }
}
