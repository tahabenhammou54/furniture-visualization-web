import { Component, EventEmitter, Input, Output, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PresetRoom } from '../../models/generation.model';

// Static preset rooms — replace thumbnailUrl with real assets or CDN links
export const PRESET_ROOMS: PresetRoom[] = [
  // --- LIVING ROOMS (Modern) ---
  { id: 'living-modern-1', name: 'Modern Living', category: 'living', thumbnailUrl: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80' },
  { id: 'living-modern-2', name: 'Modern Living', category: 'living', thumbnailUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80' },
  { id: 'living-modern-3', name: 'Modern Living', category: 'living', thumbnailUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80' },
  { id: 'living-modern-4', name: 'Modern Living', category: 'living', thumbnailUrl: 'https://images.unsplash.com/photo-1567016432779-094069958ea5?auto=format&fit=crop&w=800&q=80' },
  { id: 'living-modern-5', name: 'Modern Living', category: 'living', thumbnailUrl: 'https://images.unsplash.com/photo-1598928506311-c55dd1b31042?auto=format&fit=crop&w=800&q=80' },

  // --- LIVING ROOMS (Cozy) ---
  { id: 'living-cozy-1', name: 'Cozy Living', category: 'living', thumbnailUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80' },
  { id: 'living-cozy-2', name: 'Cozy Living', category: 'living', thumbnailUrl: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=800&q=80' },
  { id: 'living-cozy-3', name: 'Cozy Living', category: 'living', thumbnailUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80' },
  { id: 'living-cozy-4', name: 'Cozy Living', category: 'living', thumbnailUrl: 'https://images.unsplash.com/photo-1505693415957-283a9f6d5f14af?auto=format&fit=crop&w=800&q=80' },
  { id: 'living-cozy-5', name: 'Cozy Living', category: 'living', thumbnailUrl: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80' },

  // --- BEDROOMS (Minimal) ---
  { id: 'bedroom-minimal-1', name: 'Minimal Bedroom', category: 'bedroom', thumbnailUrl: 'https://images.unsplash.com/photo-1505693415957-283a9f9b581c?auto=format&fit=crop&w=800&q=80' },
  { id: 'bedroom-minimal-2', name: 'Minimal Bedroom', category: 'bedroom', thumbnailUrl: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80' },
  { id: 'bedroom-minimal-3', name: 'Minimal Bedroom', category: 'bedroom', thumbnailUrl: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=800&q=80' },
  { id: 'bedroom-minimal-4', name: 'Minimal Bedroom', category: 'bedroom', thumbnailUrl: 'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?auto=format&fit=crop&w=800&q=80' },
  { id: 'bedroom-minimal-5', name: 'Minimal Bedroom', category: 'bedroom', thumbnailUrl: 'https://images.unsplash.com/photo-1616594831707-320d0396106e?auto=format&fit=crop&w=800&q=80' },

  // --- KITCHENS (Bright) ---
  { id: 'kitchen-bright-1', name: 'Bright Kitchen', category: 'kitchen', thumbnailUrl: 'https://images.unsplash.com/photo-1556911223-e250e3383f58?auto=format&fit=crop&w=800&q=80' },
  { id: 'kitchen-bright-2', name: 'Bright Kitchen', category: 'kitchen', thumbnailUrl: 'https://images.unsplash.com/photo-1600489000022-c2086d79f9d4?auto=format&fit=crop&w=800&q=80' },
  { id: 'kitchen-bright-3', name: 'Bright Kitchen', category: 'kitchen', thumbnailUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=800&q=80' },
  { id: 'kitchen-bright-4', name: 'Bright Kitchen', category: 'kitchen', thumbnailUrl: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80' },
  { id: 'kitchen-bright-5', name: 'Bright Kitchen', category: 'kitchen', thumbnailUrl: 'https://images.unsplash.com/photo-1519643381401-22c77e60520e?auto=format&fit=crop&w=800&q=80' },

  // --- OFFICES (Home) ---
  { id: 'office-home-1', name: 'Home Office', category: 'office', thumbnailUrl: 'https://images.unsplash.com/photo-1593062096033-9a26b09da705?auto=format&fit=crop&w=800&q=80' },
  { id: 'office-home-2', name: 'Home Office', category: 'office', thumbnailUrl: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80' },
  { id: 'office-home-3', name: 'Home Office', category: 'office', thumbnailUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80' },
  { id: 'office-home-4', name: 'Home Office', category: 'office', thumbnailUrl: 'https://images.unsplash.com/photo-1491975474562-1f4e30bc9468?auto=format&fit=crop&w=800&q=80' },
  { id: 'office-home-5', name: 'Home Office', category: 'office', thumbnailUrl: 'https://images.unsplash.com/photo-1504384764586-bb4cdc17497a?auto=format&fit=crop&w=800&q=80' },

  // --- BATHROOMS (Luxury) ---
  { id: 'bathroom-luxury-1', name: 'Luxury Bathroom', category: 'bathroom', thumbnailUrl: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=800&q=80' },
  { id: 'bathroom-luxury-2', name: 'Luxury Bathroom', category: 'bathroom', thumbnailUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80' },
  { id: 'bathroom-luxury-3', name: 'Luxury Bathroom', category: 'bathroom', thumbnailUrl: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=800&q=80' },
  { id: 'bathroom-luxury-4', name: 'Luxury Bathroom', category: 'bathroom', thumbnailUrl: 'https://images.unsplash.com/photo-1620626011761-9963d7521576?auto=format&fit=crop&w=800&q=80' },
  { id: 'bathroom-luxury-5', name: 'Luxury Bathroom', category: 'bathroom', thumbnailUrl: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=800&q=80' },

  // --- DINING (Modern) ---
  { id: 'dining-modern-1', name: 'Modern Dining', category: 'dining', thumbnailUrl: 'https://images.unsplash.com/photo-1617806118233-18e1674745ef?auto=format&fit=crop&w=800&q=80' },
  { id: 'dining-modern-2', name: 'Modern Dining', category: 'dining', thumbnailUrl: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=800&q=80' },
  { id: 'dining-modern-3', name: 'Modern Dining', category: 'dining', thumbnailUrl: 'https://images.unsplash.com/photo-1517705008128-361805f42e86?auto=format&fit=crop&w=800&q=80' },
  { id: 'dining-modern-4', name: 'Modern Dining', category: 'dining', thumbnailUrl: 'https://images.unsplash.com/photo-1544145945-f904253d0c71?auto=format&fit=crop&w=800&q=80' },
  { id: 'dining-modern-5', name: 'Modern Dining', category: 'dining', thumbnailUrl: 'https://images.unsplash.com/photo-1604578762246-41134e37f9cc?auto=format&fit=crop&w=800&q=80' },

  // --- GAMING (Setup) ---
  { id: 'gaming-setup-1', name: 'Gaming Setup', category: 'gaming', thumbnailUrl: 'https://images.unsplash.com/photo-1603481546238-487240415921?auto=format&fit=crop&w=800&q=80' },
  { id: 'gaming-setup-2', name: 'Gaming Setup', category: 'gaming', thumbnailUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80' },
  { id: 'gaming-setup-3', name: 'Gaming Setup', category: 'gaming', thumbnailUrl: 'https://images.unsplash.com/photo-1598550476439-6847785fce66?auto=format&fit=crop&w=800&q=80' },
  { id: 'gaming-setup-4', name: 'Gaming Setup', category: 'gaming', thumbnailUrl: 'https://images.unsplash.com/photo-1616588589676-62b3bd4ff6d2?auto=format&fit=crop&w=800&q=80' },
  { id: 'gaming-setup-5', name: 'Gaming Setup', category: 'gaming', thumbnailUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80' },

  // --- EMPTY ROOMS ---
  { id: 'empty-modern-1', name: 'Empty Modern Room', category: 'empty', thumbnailUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80' },
  { id: 'empty-modern-2', name: 'Empty Modern Room', category: 'empty', thumbnailUrl: 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=800&q=80' },
  { id: 'empty-modern-3', name: 'Empty Modern Room', category: 'empty', thumbnailUrl: 'https://images.unsplash.com/photo-1600607687920-4e2a09be1587?auto=format&fit=crop&w=800&q=80' },
  { id: 'empty-modern-4', name: 'Empty Modern Room', category: 'empty', thumbnailUrl: 'https://images.unsplash.com/photo-1598928666358-5237f1f0423e?auto=format&fit=crop&w=800&q=80' },
  { id: 'empty-modern-5', name: 'Empty Modern Room', category: 'empty', thumbnailUrl: 'https://images.unsplash.com/photo-1616486701797-0f33f61038ec?auto=format&fit=crop&w=800&q=80' }
];
@Component({
  selector: 'app-room-gallery',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './room-gallery.component.html',
})
export class RoomGalleryComponent implements OnInit {
  @Input() selectedRoomId: string | null = null;
  @Output() roomSelected = new EventEmitter<PresetRoom>();

  rooms = signal<PresetRoom[]>([]);
  activeFilter = signal<string>('all');

  readonly filters = [
    { id: 'all', label: 'All' },
    { id: 'living', label: 'Living' },
    { id: 'bedroom', label: 'Bedroom' },
    { id: 'kitchen', label: 'Kitchen' },
    { id: 'office', label: 'Office' },
    { id: 'bathroom', label: 'Bathroom' },
    { id: 'dining', label: 'Dining' },
    { id: 'gaming', label: 'Gaming' },
    { id: 'empty', label: 'Empty' },
  ];

  ngOnInit(): void {
    this.rooms.set(PRESET_ROOMS);
  }

  get filteredRooms(): PresetRoom[] {
    const filter = this.activeFilter();
    if (filter === 'all') return this.rooms();
    return this.rooms().filter((r) => r.category === filter);
  }

  selectRoom(room: PresetRoom): void {
    this.roomSelected.emit(room);
  }

  setFilter(filterId: string): void {
    this.activeFilter.set(filterId);
  }
}
