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

const BASE_URL = 'https://www.homesketchai.com';
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
    noindex: true,
  },
  '/auth/register': {
    title: 'Create Account — HomeSketch AI',
    description: 'Join HomeSketch AI and start transforming your rooms with AI. Free to sign up, no credit card required.',
    canonical: `${BASE_URL}/auth/register`,
    noindex: true,
  },
  '/tabs/home': {
    title: 'AI Design Studio — Interior & Exterior Design Tools | HomeSketch AI',
    description: 'Access all AI design tools in one studio — room redesign, furniture visualization, style transfer, wall & flooring changes, exterior design, object removal, and garden design.',
    canonical: `${BASE_URL}/tabs/home`,
  },
  '/tabs/build-room': {
    title: 'AI Room Redesign — Transform Any Room Photo in Seconds | HomeSketch AI',
    description: 'Upload a room photo and get an AI-powered interior redesign in seconds. Choose from 20+ styles including Modern, Minimalist, Japandi, Boho, Scandinavian, and more. Free to try.',
    canonical: `${BASE_URL}/tabs/build-room`,
    ogImage: `${BASE_URL}/assets/features/interior.webp`,
  },
  '/tabs/exterior-design': {
    title: 'AI Exterior & Garden Design — Redesign Your Home Facade | HomeSketch AI',
    description: 'Redesign your home exterior, facade, driveway, and garden with AI. Visualize new exterior styles, landscaping, and curb appeal instantly. Upload a photo and transform it.',
    canonical: `${BASE_URL}/tabs/exterior-design`,
    ogImage: `${BASE_URL}/assets/features/exterior.webp`,
  },
  '/tabs/replace': {
    title: 'AI Furniture Replacement — Add or Swap Furniture in Any Room | HomeSketch AI',
    description: 'Replace or add furniture in any room photo using AI. Upload a room and a furniture image to see how it looks placed naturally with realistic lighting and shadows.',
    canonical: `${BASE_URL}/tabs/replace`,
    ogImage: `${BASE_URL}/assets/features/replace.webp`,
  },
  '/tabs/cleanup': {
    title: 'AI Object Removal — Remove Anything From Room Photos | HomeSketch AI',
    description: 'Remove unwanted objects, furniture, or clutter from room photos instantly with AI. Paint over what you want gone and get a clean, seamless result in seconds.',
    canonical: `${BASE_URL}/tabs/cleanup`,
    ogImage: `${BASE_URL}/assets/features/cleanup.webp`,
  },
  '/tabs/style-transfer': {
    title: 'AI Style Transfer — Replace Any Object in Your Room | HomeSketch AI',
    description: 'Select any object in your room photo and replace it with a new style, material, or piece using AI. Swap sofas, tables, rugs, or any element with a brush and a prompt.',
    canonical: `${BASE_URL}/tabs/style-transfer`,
  },
  '/tabs/walls': {
    title: 'AI Wall Redesign — Change Wall Colors & Textures Instantly | HomeSketch AI',
    description: 'Change wall paint colors, wallpaper, textures, and materials in any room photo with AI. Visualize new wall treatments before committing. One-click transformation.',
    canonical: `${BASE_URL}/tabs/walls`,
    ogImage: `${BASE_URL}/assets/features/wall.webp`,
  },
  '/tabs/flooring': {
    title: 'AI Flooring Visualizer — Preview New Floors in Your Room | HomeSketch AI',
    description: 'Visualize hardwood, tile, marble, carpet, and other flooring options in your actual room using AI. Upload a photo and see photorealistic new floors in seconds.',
    canonical: `${BASE_URL}/tabs/flooring`,
    ogImage: `${BASE_URL}/assets/features/floor.webp`,
  },
  '/tabs/subscription': {
    title: 'Pricing & Plans — Unlock Unlimited AI Designs | HomeSketch AI',
    description: 'Choose a HomeSketch AI plan that fits your needs. Free tier included. Upgrade for unlimited AI room redesigns, priority generation, and full feature access.',
    canonical: `${BASE_URL}/tabs/subscription`,
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
  '/tabs/profile': {
    title: 'Profile — HomeSketch AI',
    description: 'Manage your HomeSketch AI profile.',
    noindex: true,
  },
  '/tabs/privacy': {
    title: 'Privacy Policy — HomeSketch AI',
    description: 'Read the HomeSketch AI privacy policy to learn how we handle your data and protect your privacy.',
    canonical: `${BASE_URL}/tabs/privacy`,
  },
  '/tabs/terms': {
    title: 'Terms of Service — HomeSketch AI',
    description: 'Read the HomeSketch AI terms of service and usage agreement.',
    canonical: `${BASE_URL}/tabs/terms`,
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
    // For noindex pages without explicit canonical: remove the tag (don't default to /)
    // For indexable pages without explicit canonical: self-reference the route
    const canonical = cfg.canonical ?? (cfg.noindex ? undefined : `${BASE_URL}${route}`);
    this.setCanonical(canonical);
    this.setRobots(cfg.noindex);
  }

  /** Inject landing-page JSON-LD schema (called once from LandingPage) */
  injectLandingSchema(): void {
    this.injectJsonLd('ld-faq', FAQ_SCHEMA);
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
    const link = this.doc.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!url) {
      link?.remove();
      return;
    }
    const el = link ?? (() => {
      const created = this.doc.createElement('link');
      created.setAttribute('rel', 'canonical');
      this.doc.head.appendChild(created);
      return created;
    })();
    el.setAttribute('href', url);
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

// ── FAQ Schema (kept for AI citation benefit, not for Google rich results on commercial sites) ──
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
