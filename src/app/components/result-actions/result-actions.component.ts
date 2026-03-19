import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon, IonSpinner } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  downloadOutline,
  shareOutline,
  refreshOutline,
} from 'ionicons/icons';
import { ToastService } from '../../services/toast.service';
import { downloadImage } from '../../utils/image.utils';

@Component({
  selector: 'app-result-actions',
  standalone: true,
  imports: [CommonModule, IonIcon, IonSpinner],
  templateUrl: './result-actions.component.html',
})
export class ResultActionsComponent {
  @Input({ required: true }) imageUrl!: string;
  @Input() generationId = '';
  @Input() showRegenerate = false;
  @Output() regenerate = new EventEmitter<void>();

  isDownloading = signal(false);
  isSharing = signal(false);

  constructor(private toast: ToastService) {
    addIcons({ downloadOutline, shareOutline, refreshOutline });
  }

  async onDownload(): Promise<void> {
    if (this.isDownloading()) return;
    this.isDownloading.set(true);
    try {
      await downloadImage(this.imageUrl, `furnish-ai-${this.generationId || Date.now()}.jpg`);
      await this.toast.success('Image saved!');
    } catch {
      await this.toast.error('Download failed');
    } finally {
      this.isDownloading.set(false);
    }
  }

  async onShare(): Promise<void> {
    if (this.isSharing()) return;
    this.isSharing.set(true);
    try {
      if (navigator.share) {
        // Call navigator.share immediately inside the user-gesture context —
        // no async fetch beforehand so the gesture token never expires.
        await navigator.share({
          title: 'HomeSketch AI — Room Visualization',
          text: 'Check out my AI room design!',
          url: this.imageUrl,
        });
      } else {
        await navigator.clipboard.writeText(this.imageUrl);
        await this.toast.success('Link copied to clipboard!');
      }
    } catch (err: any) {
      // AbortError = user dismissed the share sheet — no toast needed
      if (err?.name !== 'AbortError') {
        await this.toast.error('Share failed');
      }
    } finally {
      this.isSharing.set(false);
    }
  }

  onRegenerate(): void {
    this.regenerate.emit();
  }
}
