import {
  Component,
  AfterViewInit,
  signal,
  PLATFORM_ID,
  Inject,
  ChangeDetectionStrategy,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { AiLoaderComponent } from '../components/ai-loader/ai-loader.component';
import { SeoService } from '../services/seo.service';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterLink, AiLoaderComponent],
  templateUrl: './landing.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`
    :host { display: block; }

    /* ── Gradient text ─────────────────────────────── */
    .gradient-text {
      background: linear-gradient(135deg, #E8983A 0%, #F59E0B 45%, #FBBF24 70%, #E8983A 100%);
      background-size: 200% auto;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      animation: gradientShift 4s linear infinite;
    }

    /* ── CTA button glow ───────────────────────────── */
    .btn-glow {
      box-shadow: 0 0 22px rgba(232,152,58,0.35), 0 4px 18px rgba(232,152,58,0.2);
    }
    .btn-glow:hover {
      box-shadow: 0 0 40px rgba(232,152,58,0.6), 0 8px 32px rgba(232,152,58,0.3);
    }
    .btn-shimmer {
      position: absolute; inset: 0;
      background: linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.18) 50%, transparent 60%);
      background-size: 200% 100%;
      background-position: -200% center;
    }
    .btn-glow:hover .btn-shimmer {
      animation: shimmerBtn 0.55s ease-in-out;
    }

    /* ── Hero grid — light mode ───────────────────── */
    .hero-grid {
      background-image:
        linear-gradient(rgba(27,50,32,0.05) 1px, transparent 1px),
        linear-gradient(90deg, rgba(27,50,32,0.05) 1px, transparent 1px);
      background-size: 64px 64px;
      opacity: 0.6;
    }
    /* Dark mode override */
    :host-context(.dark) .hero-grid {
      background-image:
        linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
      opacity: 1;
    }

    /* ── Orb animations ────────────────────────────── */
    .orb-1 { animation: orbPulse 7s ease-in-out infinite; }
    .orb-2 { animation: orbPulse 9s ease-in-out infinite 2s; }
    .orb-3 { animation: orbPulse 6s ease-in-out infinite 4s; }

    /* ── Hero floating cards ───────────────────────── */
    .card-left  { animation: floatLeft   8s ease-in-out infinite;     transform: rotate(-5deg) translateY(18px); }
    .card-center{ animation: floatCenter 7s ease-in-out infinite -2s; }
    .card-right { animation: floatRight  9s ease-in-out infinite -4s; transform: rotate(5deg)  translateY(28px); }

    /* ── Hero staggered reveal ─────────────────────── */
    .hero-item {
      opacity: 0;
      transform: translateY(28px);
      transition: opacity 0.7s cubic-bezier(0.16,1,0.3,1),
                  transform 0.7s cubic-bezier(0.16,1,0.3,1);
    }
    .hero-item.visible { opacity: 1; transform: none; }
    .hero-item.d0 { transition-delay: 0.05s; }
    .hero-item.d1 { transition-delay: 0.15s; }
    .hero-item.d2 { transition-delay: 0.25s; }
    .hero-item.d3 { transition-delay: 0.35s; }
    .hero-item.d4 { transition-delay: 0.45s; }
    .hero-item.d5 { transition-delay: 0.55s; }

    /* ── Scroll reveal ─────────────────────────────── */
    [data-reveal] {
      opacity: 0;
      transform: translateY(24px);
      transition: opacity 0.65s cubic-bezier(0.16,1,0.3,1),
                  transform 0.65s cubic-bezier(0.16,1,0.3,1);
    }
    [data-reveal].revealed { opacity: 1; transform: none; }
    [data-reveal][data-delay="1"] { transition-delay: 0.08s; }
    [data-reveal][data-delay="2"] { transition-delay: 0.16s; }
    [data-reveal][data-delay="3"] { transition-delay: 0.24s; }
    [data-reveal][data-delay="4"] { transition-delay: 0.32s; }
    [data-reveal][data-delay="5"] { transition-delay: 0.40s; }

    /* ── Marquee ───────────────────────────────────── */
    .marquee-track { animation: marquee 40s linear infinite; }
    .marquee-track:hover { animation-play-state: paused; }

    /* ── No scrollbar ──────────────────────────────── */
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

    /* ── Bento grid ────────────────────────────────── */
    .bento-grid {
      display: grid;
      grid-template-columns: repeat(12, 1fr);
      gap: 14px;
    }
    .bento-a { grid-column: span 7; min-height: 440px; }
    .bento-b { grid-column: span 5; min-height: 440px; }
    .bento-c { grid-column: span 5; }
    .bento-d { grid-column: span 3; }
    .bento-e { grid-column: span 4; min-height: 300px; }

    @media (max-width: 1024px) {
      .bento-a { grid-column: span 7; }
      .bento-b { grid-column: span 5; }
      .bento-c { grid-column: span 6; }
      .bento-d { grid-column: span 3; }
      .bento-e { grid-column: span 3; }
    }
    @media (max-width: 768px) {
      .bento-grid { grid-template-columns: 1fr; gap: 12px; }
      .bento-a, .bento-b, .bento-c, .bento-d, .bento-e { grid-column: span 1; }
      .bento-a { min-height: 320px; }
      .bento-b { min-height: 260px; }
      .bento-e { min-height: 240px; }
    }

    /* ── Before/After slider ───────────────────────── */
    #ba-wrap { touch-action: none; }

    /* ── Scrolled nav ──────────────────────────────── */
    #site-nav.scrolled .nav-pill {
      box-shadow: 0 4px 20px rgba(27,50,32,0.12);
    }
    :host-context(.dark) #site-nav.scrolled .nav-pill {
      box-shadow: 0 4px 32px rgba(0,0,0,0.5);
    }

    /* ════ KEYFRAMES ════════════════════════════════════ */
    @keyframes gradientShift {
      0%,100% { background-position: 0% center; }
      50%      { background-position: 200% center; }
    }
    @keyframes shimmerBtn {
      0%   { background-position: -200% center; }
      100% { background-position:  200% center; }
    }
    @keyframes orbPulse {
      0%,100% { opacity: 0.6; transform: scale(1); }
      50%      { opacity: 1;   transform: scale(1.1); }
    }
    @keyframes floatLeft {
      0%,100% { transform: rotate(-5deg) translateY(18px); }
      50%      { transform: rotate(-5deg) translateY(4px); }
    }
    @keyframes floatCenter {
      0%,100% { transform: translateY(0); }
      50%      { transform: translateY(-18px); }
    }
    @keyframes floatRight {
      0%,100% { transform: rotate(5deg) translateY(28px); }
      50%      { transform: rotate(5deg) translateY(12px); }
    }
    @keyframes marquee {
      0%   { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }
  `],
})
export class LandingPage implements AfterViewInit {

  /* ── Theme ──────────────────────────────────────── */
  isDark = signal(false);

  toggleTheme() {
    const next = !this.isDark();
    this.isDark.set(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('app_theme', next ? 'dark' : 'light');
  }

  private initTheme() {
    const saved = localStorage.getItem('app_theme');
    const dark = saved ? saved === 'dark' : false;
    this.isDark.set(dark);
    document.documentElement.classList.toggle('dark', dark);
  }

  /* ── Before/After slider ────────────────────────── */
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

  /* ── Marquee ────────────────────────────────────── */
  private readonly baseStyles = [
    'Modern', 'Minimalist', 'Japandi', 'Luxury', 'Boho', 'Scandinavian',
    'Industrial', 'Coastal', 'Mediterranean', 'Farmhouse', 'Contemporary',
    'Art Deco', 'Rustic', 'Mid-Century', 'Wabi-Sabi', 'Neo-Classic',
    'Tropical', 'Eclectic', 'French Country', 'Hollywood Regency',
  ];
  marqueeItems = [...this.baseStyles, ...this.baseStyles];

  /* ── Style carousel cards ───────────────────────── */
  allCards = [
    { name: 'Modern Living',   img: 'assets/rooms/living-modern.webp',  tag: 'Modern',       cat: 'Living Room' },
    { name: 'Cozy Boho',       img: 'assets/rooms/living-cozy.jpg',     tag: 'Boho',         cat: 'Living Room' },
    { name: 'Open Concept',    img: 'assets/rooms/empty-room1.jpg',     tag: 'Luxury',       cat: 'Living Room' },
    { name: 'Minimal Bedroom', img: 'assets/rooms/bedroom-minimal.png', tag: 'Minimalist',   cat: 'Bedroom'     },
    { name: 'Cozy Bedroom',    img: 'assets/rooms/living-cozy.jpg',     tag: 'Boho',         cat: 'Bedroom'     },
    { name: 'Modern Bedroom',  img: 'assets/rooms/living-modern.webp',  tag: 'Modern',       cat: 'Bedroom'     },
    { name: 'Bright Kitchen',  img: 'assets/rooms/kitchen-bright.jpg',  tag: 'Scandinavian', cat: 'Kitchen'     },
    { name: 'Villa Facade',    img: 'assets/features/exterior.webp',    tag: 'Contemporary', cat: 'Exterior'    },
    { name: 'Lush Garden',     img: 'assets/features/garden.webp',      tag: 'Natural',      cat: 'Garden'      },
  ];

  /* ── How it works ───────────────────────────────── */
  steps = [
    {
      n: '01', color: '#E8983A',
      title: 'Upload your room',
      desc: 'Any photo works — living room, bedroom, kitchen, exterior or garden.',
      img: 'assets/rooms/empty-room1.jpg',
    },
    {
      n: '02', color: '#8B5CF6',
      title: 'Choose your style',
      desc: 'Pick from 20+ styles, add furniture, set a palette, or describe your vision.',
      img: 'assets/features/interior.webp',
    },
    {
      n: '03', color: '#10B981',
      title: 'Get your redesign',
      desc: 'Download, share, or generate unlimited variations in one tap.',
      img: 'assets/rooms/living-modern.webp',
    },
  ];

  /* ── Tools ──────────────────────────────────────── */
  tools = [
    { title: 'Exterior Design',  desc: 'Redesign any facade',        img: 'assets/features/exterior.webp' },
    { title: 'Object Removal',   desc: 'Erase anything instantly',   img: 'assets/features/cleanup.webp'  },
    { title: 'Walls & Flooring', desc: 'New surfaces in one click',  img: 'assets/features/wall.webp'     },
    { title: 'Garden Design',    desc: 'AI landscape your outdoors', img: 'assets/features/garden.webp'   },
  ];

  /* ── Footer social SVG paths ────────────────────── */
  socialPaths = [
    'M4 4h16v16H4V4zm8 3a5 5 0 100 10A5 5 0 0012 7zm6.5-.5a1 1 0 110 2 1 1 0 010-2z',
    'M22 4s-.7 2.1-2 3.4c1.6 14.3-9.4 22.4-18 17.6 2.2 0 4.4-.5 6-1.9-3.7-.1-5.9-2.5-6.3-4.3.9.1 1.9 0 2.5-.3C2.5 17 0 14.5 0 11.5c.8.4 1.7.7 2.6.7-2.5-1.7-3.1-5.4-.4-7.8C4.6 6.7 8.2 8.5 12 8.6c-.4-1.7.2-4.4 2.6-5 1.8-.4 3.6.4 4.7 1.6 1.1-.2 2.1-.6 3-.6l-2.3 1.4',
    'M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z M2 9h4v12H2z M4 6a2 2 0 100-4 2 2 0 000 4z',
  ];

  /* ── App entry loading ──────────────────────────── */
  isLoading = signal(false);

  goToApp() {
    this.isLoading.set(true);
    setTimeout(() => {
      this.router.navigateByUrl('/tabs/home');
      this.isLoading.set(false);
    }, 1800);
  }

  /* ── Lifecycle ──────────────────────────────────── */
  constructor(
    @Inject(PLATFORM_ID) private pid: object,
    private router: Router,
    private seo: SeoService,
  ) {}

  ngAfterViewInit() {
    if (!isPlatformBrowser(this.pid)) return;
    this.seo.injectLandingSchema();
    this.initTheme();
    this.initHeroReveal();
    this.initScrollReveal();
    this.initNav();
    this.initDragScroll();
  }

  private initHeroReveal() {
    setTimeout(() => {
      document.querySelectorAll('.hero-item').forEach(el => el.classList.add('visible'));
    }, 60);
  }

  private initScrollReveal() {
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
    const upd = () => nav.classList.toggle('scrolled', window.scrollY > 40);
    upd();
    window.addEventListener('scroll', upd, { passive: true });
  }

  private initDragScroll() {
    const el = document.querySelector('.styles-scroll') as HTMLElement;
    if (!el) return;
    let isDown = false, startX = 0, scrollLeft = 0;
    el.addEventListener('mousedown', e => {
      isDown = true; el.style.cursor = 'grabbing';
      startX = e.pageX - el.offsetLeft; scrollLeft = el.scrollLeft;
    });
    el.addEventListener('mouseleave', () => { isDown = false; el.style.cursor = 'grab'; });
    el.addEventListener('mouseup',    () => { isDown = false; el.style.cursor = 'grab'; });
    el.addEventListener('mousemove',  e => {
      if (!isDown) return;
      e.preventDefault();
      el.scrollLeft = scrollLeft - (e.pageX - el.offsetLeft - startX) * 1.8;
    });
  }
}
