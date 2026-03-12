import { Component, EventEmitter, Input, Output, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PresetRoom } from '../../models/generation.model';

export const PRESET_EXTERIORS: PresetRoom[] = [
  // --- BUILDINGS (Modern) ---
  { id: 'building-modern-1', name: 'Modern House', category: 'buildings', thumbnailUrl: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=800&q=80' },
  { id: 'building-modern-2', name: 'Modern House', category: 'buildings', thumbnailUrl: 'https://images.unsplash.com/photo-1523217582562-09d0def993a6?auto=format&fit=crop&w=800&q=80' },
  { id: 'building-modern-3', name: 'Modern Villa', category: 'buildings', thumbnailUrl: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80' },
  { id: 'building-modern-4', name: 'Modern Villa', category: 'buildings', thumbnailUrl: 'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?auto=format&fit=crop&w=800&q=80' },
  { id: 'building-modern-5', name: 'Contemporary', category: 'buildings', thumbnailUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80' },

  // --- BUILDINGS (Classic) ---
  { id: 'building-classic-1', name: 'Classic Home', category: 'buildings', thumbnailUrl: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=800&q=80' },
  { id: 'building-classic-2', name: 'Classic Home', category: 'buildings', thumbnailUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80' },
  { id: 'building-classic-3', name: 'Townhouse', category: 'buildings', thumbnailUrl: 'https://images.unsplash.com/photo-1577495508326-19a1b3cf65b9?auto=format&fit=crop&w=800&q=80' },
  { id: 'building-classic-4', name: 'Colonial', category: 'buildings', thumbnailUrl: 'https://images.unsplash.com/photo-1601760562234-9814eea6db90?auto=format&fit=crop&w=800&q=80' },

  // --- BUILDINGS (Apartment) ---
  { id: 'building-apt-1', name: 'Apartment', category: 'buildings', thumbnailUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80' },
  { id: 'building-apt-2', name: 'Apartment', category: 'buildings', thumbnailUrl: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=800&q=80' },
  { id: 'building-apt-3', name: 'Commercial', category: 'buildings', thumbnailUrl: 'https://images.unsplash.com/photo-1464082354059-27db6ce50048?auto=format&fit=crop&w=800&q=80' },

  // --- GARDENS ---
  { id: 'garden-lush-1', name: 'Lush Garden', category: 'gardens', thumbnailUrl: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=800&q=80' },
  { id: 'garden-lush-2', name: 'Lush Garden', category: 'gardens', thumbnailUrl: 'https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&w=800&q=80' },
  { id: 'garden-modern-1', name: 'Modern Garden', category: 'gardens', thumbnailUrl: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=800&q=80' },
  { id: 'garden-modern-2', name: 'Modern Garden', category: 'gardens', thumbnailUrl: 'https://images.unsplash.com/photo-1599598425947-5202edd56bdb?auto=format&fit=crop&w=800&q=80' },
  { id: 'garden-zen-1', name: 'Zen Garden', category: 'gardens', thumbnailUrl: 'https://images.unsplash.com/photo-1531498860502-7c67cf02f657?auto=format&fit=crop&w=800&q=80' },
  { id: 'garden-zen-2', name: 'Zen Garden', category: 'gardens', thumbnailUrl: 'https://images.unsplash.com/photo-1541614101331-1a5a3a194e92?auto=format&fit=crop&w=800&q=80' },
  { id: 'garden-pool-1', name: 'Pool & Garden', category: 'gardens', thumbnailUrl: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=800&q=80' },
  { id: 'garden-pool-2', name: 'Pool & Garden', category: 'gardens', thumbnailUrl: 'https://images.unsplash.com/photo-1564013434775-f71db0030976?auto=format&fit=crop&w=800&q=80' },
  { id: 'garden-entrance-1', name: 'Entrance', category: 'gardens', thumbnailUrl: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=800&q=80' },
  { id: 'garden-entrance-2', name: 'Entrance', category: 'gardens', thumbnailUrl: 'https://images.unsplash.com/photo-1592595896551-12b371d546d5?auto=format&fit=crop&w=800&q=80' },
];

@Component({
  selector: 'app-exterior-gallery',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './exterior-gallery.component.html',
})
export class ExteriorGalleryComponent implements OnInit {
  @Input() selectedPhotoId: string | null = null;
  @Output() photoSelected = new EventEmitter<PresetRoom>();

  items = signal<PresetRoom[]>([]);
  activeFilter = signal<string>('all');

  readonly filters = [
    { id: 'all',      label: 'All'       },
    { id: 'buildings', label: 'Buildings' },
    { id: 'gardens',  label: 'Gardens'   },
  ];

  ngOnInit(): void {
    this.items.set(PRESET_EXTERIORS);
  }

  get filteredItems(): PresetRoom[] {
    const filter = this.activeFilter();
    if (filter === 'all') return this.items();
    return this.items().filter(i => i.category === filter);
  }

  selectItem(item: PresetRoom): void {
    this.photoSelected.emit(item);
  }

  setFilter(filterId: string): void {
    this.activeFilter.set(filterId);
  }
}
