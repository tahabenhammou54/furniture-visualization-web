import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skeleton-loader',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './skeleton-loader.component.html',
})
export class SkeletonLoaderComponent {
  @Input() type: 'card' | 'list' | 'avatar' | 'text' | 'history-grid' = 'card';
  @Input() count = 1;

  get items(): number[] {
    return Array.from({ length: this.count }, (_, i) => i);
  }
}
