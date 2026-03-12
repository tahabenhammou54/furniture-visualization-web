import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  addOutline,
  closeCircle,
  closeOutline,
  cameraOutline,
  imagesOutline,
  timeOutline,
} from 'ionicons/icons';
import { Capacitor } from '@capacitor/core';

const STORAGE_KEY = 'photo_picker_recent';
const MAX_RECENT = 8;

@Component({
  selector: 'app-photo-picker',
  standalone: true,
  imports: [CommonModule, IonIcon],
  templateUrl: './photo-picker.component.html',
  styleUrls: ['./photo-picker.component.scss'],
})
export class PhotoPickerComponent {
  @Input() label = 'Add a photo';
  @Input() required = false;
  /** When true, the trigger always shows (no preview replaces it) */
  @Input() multiple = false;

  @Output() imageSelected = new EventEmitter<File>();
  @Output() imageRemoved = new EventEmitter<void>();

  @ViewChild('cameraInput') cameraInput!: ElementRef<HTMLInputElement>;
  @ViewChild('galleryInput') galleryInput!: ElementRef<HTMLInputElement>;

  isOpen = signal(false);
  preview = signal<string | null>(null);
  recentPhotos = signal<string[]>([]);

  readonly isWeb = Capacitor.getPlatform() === 'web';

  constructor() {
    addIcons({ addOutline, closeCircle, closeOutline, cameraOutline, imagesOutline, timeOutline });
    this.loadRecent();
  }

  // ── Public API ─────────────────────────────────────────────────────────────

  openModal(): void {
    if (this.multiple || !this.preview()) {
      this.isOpen.set(true);
    }
  }

  closeModal(): void {
    this.isOpen.set(false);
  }

  openCamera(): void {
    this.cameraInput.nativeElement.click();
  }

  openGallery(): void {
    this.galleryInput.nativeElement.click();
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = input.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => this.processFile(file));
    input.value = '';
    this.closeModal();
  }

  selectRecent(dataUrl: string): void {
    if (!this.multiple) {
      this.preview.set(dataUrl);
    }
    fetch(dataUrl)
      .then((r) => r.blob())
      .then((blob) => {
        const file = new File([blob], 'photo.jpg', { type: blob.type || 'image/jpeg' });
        this.imageSelected.emit(file);
      });
    this.closeModal();
  }

  removeImage(event: Event): void {
    event.stopPropagation();
    this.preview.set(null);
    this.imageRemoved.emit();
  }

  // ── Private ────────────────────────────────────────────────────────────────

  private processFile(file: File): void {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (!this.multiple) {
        this.preview.set(dataUrl);
      }
      this.saveThumbnail(dataUrl);
    };
    reader.readAsDataURL(file);
    this.imageSelected.emit(file);
  }

  private saveThumbnail(dataUrl: string): void {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const MAX = 200;
      const scale = Math.min(MAX / img.width, MAX / img.height, 1);
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const thumb = canvas.toDataURL('image/jpeg', 0.6);
      this.addToRecent(thumb);
    };
    img.src = dataUrl;
  }

  private loadRecent(): void {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        this.recentPhotos.set(JSON.parse(stored));
      }
    } catch { /* ignore */ }
  }

  private addToRecent(dataUrl: string): void {
    const current = this.recentPhotos();
    const updated = [dataUrl, ...current.filter((p) => p !== dataUrl)].slice(0, MAX_RECENT);
    this.recentPhotos.set(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch { /* ignore */ }
  }
}
