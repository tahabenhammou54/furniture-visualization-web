import {
  Component,
  EventEmitter,
  Input,
  Output,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  addCircleOutline,
  closeCircle,
  sparklesOutline,
  imagesOutline,
} from 'ionicons/icons';
import { SelectedFurnitureItem, PresetFurniture, PRESET_FURNITURE } from '../../models/build-room.model';
import { PhotoPickerComponent } from '../photo-picker/photo-picker.component';

type FurnitureMode = 'upload' | 'gallery';

@Component({
  selector: 'app-furniture-multi-upload',
  standalone: true,
  imports: [CommonModule, IonIcon, PhotoPickerComponent],
  templateUrl: './furniture-multi-upload.component.html',
  styleUrls: ['./furniture-multi-upload.component.scss'],
})
export class FurnitureMultiUploadComponent {
  @Input() autoComplete = true;
  @Output() itemsChanged = new EventEmitter<SelectedFurnitureItem[]>();
  @Output() autoCompleteChanged = new EventEmitter<boolean>();

  mode = signal<FurnitureMode>('upload');
  items = signal<SelectedFurnitureItem[]>([]);
  galleryFilter = signal<string>('all');

  readonly presetFurniture = PRESET_FURNITURE;
  readonly MAX_ITEMS = 5;

  readonly galleryFilters = [
    { id: 'all', label: 'All' },
    { id: 'seating', label: 'Seating' },
    { id: 'tables', label: 'Tables' },
    { id: 'storage', label: 'Storage' },
    { id: 'beds', label: 'Beds' },
    { id: 'lighting', label: 'Lighting' },
    { id: 'decor', label: 'Decor' },
  ];

  constructor() {
    addIcons({ addCircleOutline, closeCircle, sparklesOutline, imagesOutline });
  }

  setMode(m: FurnitureMode): void {
    this.mode.set(m);
  }

  get filteredPresets(): PresetFurniture[] {
    const f = this.galleryFilter();
    return f === 'all' ? this.presetFurniture : this.presetFurniture.filter((p) => p.category === f);
  }

  isSelected(id: string): boolean {
    return this.items().some((i) => i.id === id);
  }

  async onPickerFileSelected(file: File): Promise<void> {
    if (this.items().length >= this.MAX_ITEMS) return;
    const item = await this.fileToItem(file, false);
    this.items.update((current) => {
      if (current.length >= this.MAX_ITEMS) return current;
      return [...current, item];
    });
    this.itemsChanged.emit(this.items());
  }

  async togglePreset(preset: PresetFurniture): Promise<void> {
    const current = this.items();
    const existing = current.findIndex((i) => i.id === preset.id);

    if (existing >= 0) {
      this.items.set(current.filter((_, idx) => idx !== existing));
    } else if (current.length < this.MAX_ITEMS) {
      try {
        const res = await fetch(preset.thumbnailUrl);
        const blob = await res.blob();
        const file = new File([blob], `${preset.id}.webp`, { type: blob.type });
        const item: SelectedFurnitureItem = {
          id: preset.id,
          name: preset.name,
          file,
          previewUrl: preset.thumbnailUrl,
          isPreset: true,
        };
        this.items.set([...current, item]);
      } catch {
        // If preset image fails to load, skip silently
      }
    }
    this.itemsChanged.emit(this.items());
  }

  removeItem(id: string): void {
    this.items.set(this.items().filter((i) => i.id !== id));
    this.itemsChanged.emit(this.items());
  }

  toggleAutoComplete(): void {
    this.autoCompleteChanged.emit(!this.autoComplete);
  }

  private fileToItem(file: File, isPreset: boolean): Promise<SelectedFurnitureItem> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) =>
        resolve({
          id: `upload-${Date.now()}-${Math.random()}`,
          name: file.name.replace(/\.[^.]+$/, ''),
          file,
          previewUrl: e.target?.result as string,
          isPreset,
        });
      reader.readAsDataURL(file);
    });
  }
}
