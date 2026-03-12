import { Component, input, signal, effect, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { sparklesOutline } from 'ionicons/icons';

@Component({
  selector: 'app-ai-loader',
  standalone: true,
  imports: [CommonModule, IonIcon],
  templateUrl: './ai-loader.component.html',
  styleUrls: ['./ai-loader.component.scss'],
})
export class AiLoaderComponent implements OnDestroy {
  isLoading = input<boolean>(false);
  inline    = input<boolean>(false);

  private readonly pool = [
    'Analyzing your space...',
    'Computing spatial dimensions...',
    'Staging virtual elements...',
    'Simulating natural lighting...',
    'Rendering surface textures...',
    'Composing the scene...',
    'Calibrating color palette...',
    'Applying design style...',
    'Fine-tuning details...',
    'Generating photorealism...',
    'Processing materials...',
    'Adjusting shadows & depth...',
    'Harmonizing proportions...',
    'Almost ready...',
  ];

  currentMessage = signal(this.pool[0]);
  private msgIndex = 0;
  private interval: ReturnType<typeof setInterval> | null = null;

  constructor() {
    addIcons({ sparklesOutline });
    effect(() => {
      if (this.isLoading()) {
        this.start();
      } else {
        this.stop();
      }
    });
  }

  ngOnDestroy(): void {
    this.stop();
  }

  private start(): void {
    this.msgIndex = Math.floor(Math.random() * this.pool.length);
    this.currentMessage.set(this.pool[this.msgIndex]);
    this.interval = setInterval(() => {
      this.msgIndex = (this.msgIndex + 1) % this.pool.length;
      this.currentMessage.set(this.pool[this.msgIndex]);
    }, 2200);
  }

  private stop(): void {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }
}
