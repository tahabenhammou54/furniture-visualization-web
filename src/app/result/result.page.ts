import { Component, signal, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import {
  IonContent,
  IonIcon,
  IonSpinner,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { sparklesOutline, calendarOutline, chatbubbleOutline, arrowBackOutline } from 'ionicons/icons';
import { GenerationService } from '../services/generation.service';
import { GenerationItem } from '../models/generation.model';
import { ResultActionsComponent } from '../components/result-actions/result-actions.component';
import { TranslatePipe } from '../pipes/translate.pipe';

@Component({
  selector: 'app-result',
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonIcon,
    IonSpinner,
    ResultActionsComponent,
    TranslatePipe,
  ],
  templateUrl: './result.page.html',
  styleUrls: ['./result.page.scss'],
})
export class ResultPage implements OnInit {
  item = signal<GenerationItem | null>(null);
  isLoading = signal<boolean>(true);
  error = signal<string | null>(null);

  constructor(
    private route: ActivatedRoute,
    private generationService: GenerationService,
    private location: Location
  ) {
    addIcons({ sparklesOutline, calendarOutline, chatbubbleOutline, arrowBackOutline });
  }

  goBack(): void {
    this.location.back();
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
        this.error.set('Failed to load result');
        this.isLoading.set(false);
      },
    });
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}
