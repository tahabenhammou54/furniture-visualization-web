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
import { IconComponent } from '../../shared/icon/icon.component';

@Component({
  selector: 'app-image-upload-card',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './image-upload-card.component.html',
})
export class ImageUploadCardComponent {
  @Input() label = 'Upload Image';
  @Input() hint = 'JPG, PNG up to 10MB';
  @Input() required = false;
  @Output() imageSelected = new EventEmitter<File>();
  @Output() imageRemoved = new EventEmitter<void>();

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  preview = signal<string | null>(null);

  constructor() {}

  triggerFileInput(): void {
    if (!this.preview()) {
      this.fileInput.nativeElement.click();
    }
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => this.preview.set(e.target?.result as string);
    reader.readAsDataURL(file);

    this.imageSelected.emit(file);
    // Reset input so same file can be re-selected
    input.value = '';
  }

  removeImage(event: Event): void {
    event.stopPropagation();
    this.preview.set(null);
    this.imageRemoved.emit();
  }
}
