import { Component, input, signal, effect, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Pixel {
  colorClass: 'amber' | 'green' | 'sage';
  delay: number;
}

@Component({
  selector: 'app-ai-loader',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ai-loader.component.html',
  styleUrls: ['./ai-loader.component.scss'],
})
export class AiLoaderComponent implements OnDestroy {
  isLoading = input<boolean>(false);
  inline    = input<boolean>(false);
  imageUrl  = input<string>('');

  percentage  = signal(0);
  statusIndex = signal(0);

  readonly statusMessages = [
    'Reading the room…',
    'Mapping light & shadow…',
    'Analyzing spatial depth…',
    'Interpreting design intent…',
    'Synthesizing style elements…',
    'Balancing compositions…',
    'Calibrating material feel…',
    'Rendering your vision…',
  ];

  readonly detectMarkers = [
    { top: '20%', left: '28%', delay: 0.3 },
    { top: '58%', left: '70%', delay: 1.1 },
    { top: '35%', left: '78%', delay: 2.0 },
    { top: '72%', left: '22%', delay: 0.7 },
    { top: '14%', left: '52%', delay: 1.6 },
    { top: '80%', left: '48%', delay: 2.5 },
    { top: '45%', left: '10%', delay: 3.1 },
    { top: '30%', left: '60%', delay: 1.9 },
  ];

  // Fallback 4×4 pixel grid (used when no imageUrl)
  readonly pixels: Pixel[] = Array.from({ length: 16 }, (_, i) => {
    const diag = Math.floor(i / 4) + (i % 4);
    return {
      colorClass: (['amber', 'green', 'sage'] as const)[diag % 3],
      delay: diag * 80,
    };
  });

  private intervalId?: ReturnType<typeof setInterval>;
  private startTime = 0;
  private readonly MAX_DURATION = 60_000;

  constructor() {
    effect(() => {
      if (this.isLoading()) {
        this.start();
      } else {
        this.stop();
      }
    });
  }

  private start(): void {
    this.startTime = Date.now();
    this.percentage.set(0);
    this.statusIndex.set(0);
    clearInterval(this.intervalId);

    this.intervalId = setInterval(() => {
      const elapsed = Math.min(Date.now() - this.startTime, this.MAX_DURATION);
      const t = elapsed / this.MAX_DURATION;
      // Sqrt curve: fast start, decelerates — at avg 30 s → ~71%, max 60 s → 95%
      const pct = Math.min(Math.floor(Math.sqrt(t) * 100), 95);
      this.percentage.set(pct);

      const msgIdx = Math.floor(elapsed / 7_500) % this.statusMessages.length;
      this.statusIndex.set(msgIdx);
    }, 200);
  }

  private stop(): void {
    clearInterval(this.intervalId);
  }

  ngOnDestroy(): void {
    this.stop();
  }
}
