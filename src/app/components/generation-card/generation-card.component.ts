import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { addIcons } from 'ionicons';
import { timeOutline, sparklesOutline } from 'ionicons/icons';
import { GenerationItem } from '../../models/generation.model';

@Component({
  selector: 'app-generation-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './generation-card.component.html',
})
export class GenerationCardComponent {
  @Input({ required: true }) item!: GenerationItem;
  @Output() cardClick = new EventEmitter<GenerationItem>();

  constructor() {
    addIcons({ timeOutline, sparklesOutline });
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
}
