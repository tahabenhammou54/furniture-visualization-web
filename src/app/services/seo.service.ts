import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';

export interface SeoConfig {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  noindex?: boolean;
}

const BASE_URL = 'https://homesketchai.com';
const DEFAULT_OG_IMAGE = `${BASE_URL}/assets/og/og-image.jpg`;

const ROUTE_META: Record<string, SeoConfig> = {
  '/': {
    title: 'HomeSketch AI — AI Interior Design & Room Redesign',
    description: 'Transform any room photo into a stunning redesign in seconds. AI-powered interior design, furniture visualization, style transfer, wall & flooring changes. Free to start.',
    canonical: `${BASE_URL}/`,
    ogImage: DEFAULT_OG_IMAGE,
    ogType: 'website',
  },
  '/auth/login': {
    title: 'Sign In — HomeSketch AI',
    description: 'Sign in to your HomeSketch AI account to access AI-powered interior design tools.',
    canonical: `${BASE_URL}/auth/login`,
    noindex: false,
  },
  '/auth/register': {
    title: 'Create Account — HomeSketch AI',
    description: 'Join HomeSketch AI and start transforming your rooms with AI. Free to sign up, no credit card required.',
    canonical: `${BASE_URL}/auth/register`,
    noindex: false,
  },
  '/tabs/home': {
    title: 'Design Studio — HomeSketch AI',
    description: 'Choose your AI design tool — room redesign, furniture visualization, style transfer, wall & flooring, exterior design, and more.',
    noindex: true,
  },
  '/tabs/build-room': {
    title: 'AI Room Redesign — HomeSketch AI',
    description: 'Upload a room photo and get an AI-powered redesign in seconds. Choose from 20+ interior styles.',
    noindex: true,
  },
  '/tabs/exterior-design': {
    title: 'AI Exterior Design — HomeSketch AI',
    description: 'Redesign your home facade with AI. Visualize new exteriors instantly.',
    noindex: true,
  },
  '/tabs/replace': {
    title: 'Furniture Replacement — HomeSketch AI',
    description: 'Replace or add furniture in any room photo using AI.',
    noindex: true,
  },
  '/tabs/cleanup': {
    title: 'Object Removal — HomeSketch AI',
    description: 'Remove any object from your room photos instantly with AI.',
    noindex: true,
  },
  '/tabs/walls': {
    title: 'Wall Redesign — HomeSketch AI',
    description: 'Change wall colors, textures, and materials with AI in one click.',
    noindex: true,
  },
  '/tabs/flooring': {
    title: 'Flooring Redesign — HomeSketch AI',
    description: 'Visualize new flooring options in your room with AI.',
    noindex: true,
  },
  '/tabs/history': {
    title: 'My Designs — HomeSketch AI',
    description: 'View your AI interior design history and past projects.',
    noindex: true,
  },
  '/tabs/settings': {
    title: 'Settings — HomeSketch AI',
    description: 'Manage your HomeSketch AI account settings and preferences.',
    noindex: true,
  },
  '/tabs/privacy': {
    title: 'Privacy Policy — HomeSketch AI',
    description: 'Read the HomeSketch AI privacy policy to learn how we handle your data.',
    canonical: `${BASE_URL}/tabs/privacy`,
  },
  '/tabs/terms': {
    title: 'Terms of Service — HomeSketch AI',
    description: 'Read the HomeSketch AI terms of service and usage agreement.',
    canonical: `${BASE_URL}/tabs/terms`,
  },
  '/tabs/subscription': {
    title: 'Upgrade Plan — HomeSketch AI',
    description: 'Unlock unlimited AI designs with HomeSketch AI premium plans.',
    noindex: true,
  },
};

@Injectable({ providedIn: 'root' })
export class SeoService {
  private meta  = inject(Meta);
  private titleSvc = inject(Title);
  private doc   = inject(DOCUMENT);

  update(route: string): void {
    const cfg = ROUTE_META[route] ?? ROUTE_META['/'];
    this.setTitle(cfg.title);
    this.setDescription(cfg.description);
    this.setOg(cfg);
    this.setCanonical(cfg.canonical);
    this.setRobots(cfg.noindex);
  }

  /** Inject full landing-page JSON-LD schemas (called once from LandingPage) */
  injectLandingSchema(): void {
    this.injectJsonLd('ld-howto', HOWTO_SCHEMA);
    this.injectJsonLd('ld-faq',   FAQ_SCHEMA);
  }

  private setTitle(title: string): void {
    this.titleSvc.setTitle(title);
    this.meta.updateTag({ property: 'og:title',       content: title });
    this.meta.updateTag({ name:     'twitter:title',  content: title });
  }

  private setDescription(desc: string): void {
    this.meta.updateTag({ name:     'description',         content: desc });
    this.meta.updateTag({ property: 'og:description',      content: desc });
    this.meta.updateTag({ name:     'twitter:description', content: desc });
  }

  private setOg(cfg: SeoConfig): void {
    const image = cfg.ogImage ?? DEFAULT_OG_IMAGE;
    this.meta.updateTag({ property: 'og:image',      content: image });
    this.meta.updateTag({ name:     'twitter:image', content: image });
    this.meta.updateTag({ property: 'og:type',       content: cfg.ogType ?? 'website' });
    if (cfg.canonical) {
      this.meta.updateTag({ property: 'og:url', content: cfg.canonical });
    }
  }

  private setCanonical(url?: string): void {
    let link = this.doc.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = this.doc.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.doc.head.appendChild(link);
    }
    link.setAttribute('href', url ?? `${BASE_URL}/`);
  }

  private setRobots(noindex?: boolean): void {
    const content = noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1';
    this.meta.updateTag({ name: 'robots', content });
  }

  private injectJsonLd(id: string, schema: object): void {
    let el = this.doc.getElementById(id);
    if (!el) {
      el = this.doc.createElement('script');
      el.id = id;
      el.setAttribute('type', 'application/ld+json');
      this.doc.head.appendChild(el);
    }
    el.textContent = JSON.stringify(schema);
  }
}

// ── HowTo Schema ─────────────────────────────────────────────────────────────
const HOWTO_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  'name': 'How to Redesign Your Room with AI',
  'description': 'Use HomeSketch AI to transform any room photo into a professional redesign in 3 simple steps.',
  'totalTime': 'PT1M',
  'step': [
    {
      '@type': 'HowToStep',
      'position': 1,
      'name': 'Upload Your Room Photo',
      'text': 'Take any photo of your room — living room, bedroom, kitchen, exterior, or garden — and upload it to HomeSketch AI.',
      'image': 'https://homesketchai.com/assets/rooms/empty-room1.jpg',
    },
    {
      '@type': 'HowToStep',
      'position': 2,
      'name': 'Choose Your Style',
      'text': 'Select from 20+ design styles including Modern, Minimalist, Japandi, Boho, Luxury, Scandinavian, and more. Add furniture, set a palette, or describe your vision.',
      'image': 'https://homesketchai.com/assets/features/interior.webp',
    },
    {
      '@type': 'HowToStep',
      'position': 3,
      'name': 'Get Your AI Redesign',
      'text': 'Receive your stunning redesign in seconds. Download, share, or generate unlimited variations in one tap.',
      'image': 'https://homesketchai.com/assets/rooms/living-modern.webp',
    },
  ],
};

// ── FAQ Schema ────────────────────────────────────────────────────────────────
const FAQ_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  'mainEntity': [
    {
      '@type': 'Question',
      'name': 'Is HomeSketch AI free to use?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'Yes, HomeSketch AI is free to start. You can redesign rooms, try different styles, and explore features at no cost. Premium plans are available for unlimited generations.',
      },
    },
    {
      '@type': 'Question',
      'name': 'What types of rooms can HomeSketch AI redesign?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'HomeSketch AI can redesign any room including living rooms, bedrooms, kitchens, bathrooms, home offices, exterior facades, and gardens.',
      },
    },
    {
      '@type': 'Question',
      'name': 'How long does AI room redesign take?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'AI room redesigns typically take only 20–40 seconds. Simply upload your photo, choose a style, and your redesign is ready in under a minute.',
      },
    },
    {
      '@type': 'Question',
      'name': 'What design styles does HomeSketch AI support?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'HomeSketch AI supports 20+ styles including Modern, Minimalist, Japandi, Luxury, Boho, Scandinavian, Industrial, Coastal, Mediterranean, Farmhouse, Art Deco, Rustic, Mid-Century, and more.',
      },
    },
    {
      '@type': 'Question',
      'name': 'Can I use HomeSketch AI on my phone?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'Yes, HomeSketch AI works on any device including smartphones, tablets, and desktops. It is available as a progressive web app and can be added to your home screen.',
      },
    },
    {
      '@type': 'Question',
      'name': 'Does HomeSketch AI work for exterior home design?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'Yes, HomeSketch AI includes an Exterior Design tool that lets you redesign your home facade, garage, driveway, and garden with AI.',
      },
    },
  ],
};
