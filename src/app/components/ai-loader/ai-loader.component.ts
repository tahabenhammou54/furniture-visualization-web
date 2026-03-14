import { Component, input } from '@angular/core';
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
export class AiLoaderComponent {
  isLoading = input<boolean>(false);
  inline    = input<boolean>(false);

  // 4×4 grid — diagonal wave, colour cycles amber → green → sage
  readonly pixels: Pixel[] = Array.from({ length: 16 }, (_, i) => {
    const diag = Math.floor(i / 4) + (i % 4); // 0 → 6
    return {
      colorClass: (['amber', 'green', 'sage'] as const)[diag % 3],
      delay: diag * 80,
    };
  });
}
