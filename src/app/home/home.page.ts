import { Component, ViewChild, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  layersOutline,
  flashOutline,
  homeOutline,
  businessOutline,
  leafOutline,
  swapHorizontalOutline,
  colorPaletteOutline,
  constructOutline,
  gridOutline,
  sparklesOutline,
  arrowForwardOutline,
  timeOutline,
  lockClosedOutline,
} from 'ionicons/icons';
import { AuthService } from '../services/auth.service';
import { TranslatePipe } from '../pipes/translate.pipe';

export interface StudioFeature {
  id: string;
  nameKey: string;
  descKey: string;
  highlights: string[];
  tagKey: string;
  icon: string;
  gradientFrom: string;
  gradientTo: string;
  image: string;
  route: string | null;
  available: boolean;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, IonContent, IonIcon, TranslatePipe],
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage {
  @ViewChild(IonContent, { static: false }) private content!: IonContent;

  activeFeatureId = signal<string>('interior');

  readonly features: StudioFeature[] = [
    {
      id: 'interior',
      nameKey: 'studio.interior.name',
      descKey: 'studio.interior.desc',
      highlights: ['studio.interior.h1', 'studio.interior.h2', 'studio.interior.h3'],
      tagKey: 'studio.tag.design',
      icon: 'home-outline',
      gradientFrom: '#2D9B6E',
      gradientTo: '#1A5C40',
      image: 'assets/features/interior.webp',
      route: '/tabs/build-room',
      available: true,
    },
    {
      id: 'exterior',
      nameKey: 'studio.exterior.name',
      descKey: 'studio.exterior.desc',
      highlights: ['studio.exterior.h1', 'studio.exterior.h2', 'studio.exterior.h3'],
      tagKey: 'studio.tag.design',
      icon: 'business-outline',
      gradientFrom: '#3B82F6',
      gradientTo: '#1D4ED8',
      image: 'assets/features/exterior.webp',
      route: '/tabs/exterior-design',
      available: true,
    },
    {
      id: 'garden',
      nameKey: 'studio.garden.name',
      descKey: 'studio.garden.desc',
      highlights: ['studio.garden.h1', 'studio.garden.h2', 'studio.garden.h3'],
      tagKey: 'studio.tag.design',
      icon: 'leaf-outline',
      gradientFrom: '#16A34A',
      gradientTo: '#14532D',
      image: 'assets/features/garden.webp',
      route: '/tabs/exterior-design',
      available: true,
    },
    {
      id: 'replace',
      nameKey: 'studio.replace.name',
      descKey: 'studio.replace.desc',
      highlights: ['studio.replace.h1', 'studio.replace.h2', 'studio.replace.h3'],
      tagKey: 'studio.tag.item',
      icon: 'swap-horizontal-outline',
      gradientFrom: '#E8983A',
      gradientTo: '#B8680A',
      image: 'assets/features/preview.gif',
      route: '/tabs/replace',
      available: true,
    },
    {
      id: 'cleanup',
      nameKey: 'studio.cleanup.name',
      descKey: 'studio.cleanup.desc',
      highlights: ['studio.cleanup.h1', 'studio.cleanup.h2', 'studio.cleanup.h3'],
      tagKey: 'studio.tag.ai_edit',
      icon: 'sparkles-outline',
      gradientFrom: '#E85D8A',
      gradientTo: '#9F1239',
      image: 'assets/features/cleanup.webp',
      route: '/tabs/cleanup',
      available: true,
    },
    {
      id: 'style',
      nameKey: 'studio.style.name',
      descKey: 'studio.style.desc',
      highlights: ['studio.style.h1', 'studio.style.h2', 'studio.style.h3'],
      tagKey: 'studio.tag.style',
      icon: 'color-palette-outline',
      gradientFrom: '#9B72CF',
      gradientTo: '#5B21B6',
      image: 'assets/features/replace.webp',
      route: '/tabs/style-transfer',
      available: true,
    },

    {
      id: 'walls',
      nameKey: 'studio.walls.name',
      descKey: 'studio.walls.desc',
      highlights: ['studio.walls.h1', 'studio.walls.h2', 'studio.walls.h3'],
      tagKey: 'studio.tag.surface',
      icon: 'construct-outline',
      gradientFrom: '#64748B',
      gradientTo: '#334155',
      image: 'assets/features/wall.webp',
      route: '/tabs/walls',
      available: true,
    },
    {
      id: 'flooring',
      nameKey: 'studio.flooring.name',
      descKey: 'studio.flooring.desc',
      highlights: ['studio.flooring.h1', 'studio.flooring.h2', 'studio.flooring.h3'],
      tagKey: 'studio.tag.surface',
      icon: 'grid-outline',
      gradientFrom: '#B45309',
      gradientTo: '#78350F',
      image: 'assets/features/floor.webp',
      route: '/tabs/flooring',
      available: true,
    },
  ];

  get userInitials(): string {
    const name = this.auth.currentUser?.name || '';
    return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
  }

  get userAvatar(): string | undefined {
    return this.auth.currentUser?.avatar;
  }

  constructor(public auth: AuthService, private router: Router) {
    addIcons({
      layersOutline, flashOutline, homeOutline, businessOutline, leafOutline,
      swapHorizontalOutline, colorPaletteOutline, constructOutline, gridOutline,
      sparklesOutline, arrowForwardOutline, timeOutline, lockClosedOutline,
    });
  }

  async scrollToFeature(id: string): Promise<void> {
    this.activeFeatureId.set(id);
    await new Promise(r => setTimeout(r, 50));
    const el = document.getElementById(`feature-${id}`);
    if (!el || !this.content) return;
    const scrollEl = await this.content.getScrollElement();
    const top = el.getBoundingClientRect().top + scrollEl.scrollTop - 148;
    this.content.scrollToPoint(0, Math.max(0, top), 420);
  }

  get hasCredits(): boolean {
    const user = this.auth.currentUser as any;
    if (user?.subscription && user.subscription !== 'free') {
      if (user.subscription === 'lifetime') return true;
      if (user.subscriptionExpiresAt && new Date() < new Date(user.subscriptionExpiresAt)) return true;
    }
    return (user?.credits ?? 0) > 0;
  }

  navigate(feature: StudioFeature): void {
    if (!feature.available || !feature.route) return;
    this.router.navigate([feature.route]);
  }

  goToProfile(): void {
    this.router.navigate(['/tabs/profile']);
  }

  gradient(feature: StudioFeature): string {
    return `linear-gradient(135deg, ${feature.gradientFrom}, ${feature.gradientTo})`;
  }
}
