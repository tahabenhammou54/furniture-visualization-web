import { Component, signal, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { GenerationService } from '../services/generation.service';
import { GenerationItem } from '../models/generation.model';
import { ResultActionsComponent } from '../components/result-actions/result-actions.component';
import { TranslatePipe } from '../pipes/translate.pipe';
import { IconComponent } from '../shared/icon/icon.component';

@Component({
  selector: 'app-result',
  standalone: true,
  imports: [CommonModule, ResultActionsComponent, TranslatePipe, IconComponent],
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
