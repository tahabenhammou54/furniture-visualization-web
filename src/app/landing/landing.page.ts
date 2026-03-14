import {
  Component,
  AfterViewInit,
  signal,
  computed,
  PLATFORM_ID,
  Inject,
  ChangeDetectionStrategy,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './landing.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`
    :host { display: block; }

    /* ── Nav ─────────────────── */
    #site-nav {
      transition: background 0.35s ease, box-shadow 0.35s ease,
                  backdrop-filter 0.35s ease;
    }
    #site-nav.nav-solid {
      background: rgba(255,255,255,0.94);
      backdrop-filter: blur(14px);
      -webkit-backdrop-filter: blur(14px);
      box-shadow: 0 1px 0 rgba(0,0,0,0.07);
    }

    /* ── Scroll reveal ───────── */
    [data-reveal] {
      opacity: 0;
      transform: translateY(22px);
      transition: opacity 0.6s cubic-bezier(0.16,1,0.3,1),
                  transform 0.6s cubic-bezier(0.16,1,0.3,1);
    }
    [data-reveal].revealed { opacity:1; transform:translateY(0); }
    [data-reveal][data-delay="1"] { transition-delay: 0.08s; }
    [data-reveal][data-delay="2"] { transition-delay: 0.16s; }
    [data-reveal][data-delay="3"] { transition-delay: 0.24s; }
    [data-reveal][data-delay="4"] { transition-delay: 0.32s; }
    [data-reveal][data-delay="5"] { transition-delay: 0.40s; }
    [data-reveal][data-delay="6"] { transition-delay: 0.48s; }

    /* ── Hero floating image ─── */
    .hero-img-wrap {
      animation: floatY 7s ease-in-out infinite;
    }
    @keyframes floatY {
      0%,100% { transform: translateY(0) rotate(-2deg); }
      50%      { transform: translateY(-14px) rotate(-2deg); }
    }

    /* ── Dot pattern bg ──────── */
    .dot-grid {
      background-image: radial-gradient(circle, rgba(200,221,184,0.55) 1.2px, transparent 1.2px);
      background-size: 26px 26px;
    }

    /* ── Accordion ───────────── */
    .acc-body {
      display: grid;
      grid-template-rows: 0fr;
      transition: grid-template-rows 0.32s ease;
    }
    .acc-body.open { grid-template-rows: 1fr; }
    .acc-body > div { overflow: hidden; }

    /* ── Style card hover ─────── */
    .style-card:hover img { transform: scale(1.06); }
    .style-card:hover .style-overlay { opacity: 1; }
    .style-card img { transition: transform 0.6s ease; }
    .style-overlay { transition: opacity 0.3s ease; }

    /* ── Showcase B/A slider ─── */
    #ba-wrap { touch-action: none; }
  `],
})
export class LandingPage implements AfterViewInit {
  /* ── Accordion ─────────────────────────────── */
  expandedItem = signal<number | null>(0);
  toggleAcc(i: number) {
    this.expandedItem.set(this.expandedItem() === i ? null : i);
  }

  /* ── Style tabs ────────────────────────────── */
  activeTab = signal('Living Room');
  tabs = ['Living Room', 'Bedroom', 'Kitchen', 'Exterior', 'Garden'];

  allCards = [
    { name: 'Modern Living',   img: 'assets/rooms/living-modern.webp',    tag: 'Modern',       cat: 'Living Room' },
    { name: 'Cozy Boho',       img: 'assets/rooms/living-cozy.jpg',       tag: 'Boho',         cat: 'Living Room' },
    { name: 'Open Concept',    img: 'assets/rooms/empty-room1.jpg',       tag: 'Luxury',       cat: 'Living Room' },
    { name: 'Minimal Bedroom', img: 'assets/rooms/bedroom-minimal.png',   tag: 'Minimalist',   cat: 'Bedroom'     },
    { name: 'Cozy Bedroom',    img: 'assets/rooms/living-cozy.jpg',       tag: 'Boho',         cat: 'Bedroom'     },
    { name: 'Modern Bedroom',  img: 'assets/rooms/living-modern.webp',    tag: 'Modern',       cat: 'Bedroom'     },
    { name: 'Bright Kitchen',  img: 'assets/rooms/kitchen-bright.jpg',    tag: 'Scandinavian', cat: 'Kitchen'     },
    { name: 'Modern Kitchen',  img: 'assets/rooms/living-modern.webp',    tag: 'Modern',       cat: 'Kitchen'     },
    { name: 'Minimal Kitchen', img: 'assets/rooms/bedroom-minimal.png',   tag: 'Minimalist',   cat: 'Kitchen'     },
    { name: 'Villa Facade',    img: 'assets/features/exterior.webp',      tag: 'Contemporary', cat: 'Exterior'    },
    { name: 'Modern Exterior', img: 'assets/features/exterior.webp',      tag: 'Modern',       cat: 'Exterior'    },
    { name: 'Classic Home',    img: 'assets/rooms/empty-room1.jpg',       tag: 'Classic',      cat: 'Exterior'    },
    { name: 'Lush Garden',     img: 'assets/features/garden.webp',        tag: 'Natural',      cat: 'Garden'      },
    { name: 'Zen Terrace',     img: 'assets/rooms/bedroom-minimal.png',   tag: 'Japandi',      cat: 'Garden'      },
    { name: 'Modern Patio',    img: 'assets/features/garden.webp',        tag: 'Contemporary', cat: 'Garden'      },
  ];

  visibleCards = computed(() =>
    this.allCards.filter(c => c.cat === this.activeTab()).slice(0, 3)
  );

  /* ── Quality features (accordion) ─────────── */
  qualities = [
    { title: 'Instant AI Redesign',    desc: 'Upload any room photo and get a photorealistic AI redesign in seconds — no design experience needed.' },
    { title: '20+ Design Styles',      desc: 'From Modern and Minimalist to Japandi, Boho, and Luxury — or describe your own in plain language.' },
    { title: 'Furniture Visualization',desc: 'Upload any furniture image and see exactly how it looks in your room before buying.' },
    { title: 'Precision Object Removal', desc: 'Paint over any object with the brush tool. AI erases it and fills the space naturally.' },
    { title: 'Walls & Flooring',       desc: 'Try new wall colors, textures, materials, and floor finishes — all from a single photo.' },
    { title: 'Exterior & Garden',      desc: 'Redesign building facades, add landscaping, and transform outdoor spaces with AI.' },
  ];

  /* ── Before / After slider ─────────────────── */
  sliderPos = signal(50);
  private dragging = false;

  onPointerDown(e: PointerEvent) {
    this.dragging = true;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    this.moveSlider(e.clientX);
    e.preventDefault();
  }
  onPointerMove(e: PointerEvent) {
    if (!this.dragging) return;
    this.moveSlider(e.clientX);
    e.preventDefault();
  }
  onPointerUp() { this.dragging = false; }

  private moveSlider(cx: number) {
    const el = document.getElementById('ba-wrap');
    if (!el) return;
    const { left, width } = el.getBoundingClientRect();
    this.sliderPos.set(Math.max(4, Math.min(96, ((cx - left) / width) * 100)));
  }

  /* ── Lifecycle ─────────────────────────────── */
  constructor(@Inject(PLATFORM_ID) private pid: object) {}

  ngAfterViewInit() {
    if (!isPlatformBrowser(this.pid)) return;
    this.initReveal();
    this.initNav();
  }

  private initReveal() {
    const io = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('revealed'); io.unobserve(e.target); }
      }),
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );
    document.querySelectorAll('[data-reveal]').forEach(el => io.observe(el));
  }

  private initNav() {
    const nav = document.getElementById('site-nav');
    if (!nav) return;
    const upd = () => nav.classList.toggle('nav-solid', window.scrollY > 40);
    upd();
    window.addEventListener('scroll', upd, { passive: true });
  }
}
