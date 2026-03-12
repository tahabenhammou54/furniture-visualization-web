import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toast.service';
import { downloadImage } from '../../utils/image.utils';
import { IconComponent } from '../../shared/icon/icon.component';

@Component({
  selector: 'app-result-actions',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './result-actions.component.html',
})
export class ResultActionsComponent {
  @Input({ required: true }) imageUrl!: string;
  @Input() generationId = '';
  @Input() showRegenerate = false;
  @Output() regenerate = new EventEmitter<void>();

  isDownloading = signal(false);
  isSharing = signal(false);

  constructor(private toast: ToastService) {}

  async onDownload(): Promise<void> {
    if (this.isDownloading()) return;
    this.isDownloading.set(true);
    try {
      await downloadImage(this.imageUrl, `furnish-ai-${this.generationId || Date.now()}.jpg`);
      this.toast.success('Image saved!');
    } catch {
      this.toast.error('Download failed');
    } finally {
      this.isDownloading.set(false);
    }
  }

  async onShare(): Promise<void> {
    if (this.isSharing()) return;
    this.isSharing.set(true);
    try {
      if (navigator.share) {
        await navigator.share({ title: 'FurnishAI — Room Visualization', text: 'Check out my room visualization!', url: this.imageUrl });
      } else {
        await navigator.clipboard.writeText(this.imageUrl);
        this.toast.success('Link copied to clipboard!');
      }
    } catch {
      // User cancelled share
    } finally {
      this.isSharing.set(false);
    }
  }

  onRegenerate(): void {
    this.regenerate.emit();
  }
}
