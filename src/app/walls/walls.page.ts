import { Component, computed, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { GenerationService } from '../services/generation.service';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';
import { GenerateResponse } from '../models/generation.model';
import { WALL_STYLES, COLOR_PALETTES, ColorPalette, RoomStyle } from '../models/build-room.model';
import { PhotoPickerComponent } from '../components/photo-picker/photo-picker.component';
import { StyleSelectorComponent } from '../components/style-selector/style-selector.component';
import { ResultActionsComponent } from '../components/result-actions/result-actions.component';
import { AiLoaderComponent } from '../components/ai-loader/ai-loader.component';
import { resizeImage } from '../utils/image.utils';
import { TranslatePipe } from '../pipes/translate.pipe';
import { IconComponent } from '../shared/icon/icon.component';

export interface WizardStep { id: string; labelKey: string; required: boolean; }

@Component({
  selector: 'app-walls',
  standalone: true,
  imports: [
    CommonModule, FormsModule, IconComponent,     PhotoPickerComponent, StyleSelectorComponent,
    ResultActionsComponent, AiLoaderComponent, TranslatePipe,
  ],
  templateUrl: './walls.page.html',
  styleUrls: ['./walls.page.scss'],
})
export class WallsPage {

  readonly wallStyles = WALL_STYLES;
  readonly palettes = COLOR_PALETTES;

  readonly steps: WizardStep[] = [
    { id: 'room',    labelKey: 'home.room_space',    required: true  },
    { id: 'style',   labelKey: 'walls.title',        required: true  },
    { id: 'palette', labelKey: 'palette.title',      required: false },
    { id: 'result',  labelKey: 'home.your_viz',      required: false },
  ];

  currentStep   = signal<number>(0);
  stepDirection = signal<'forward' | 'back'>('forward');

  roomFile          = signal<File | null>(null);
  selectedStyle     = signal<RoomStyle | null>(null);
  customStyle       = signal<string>('');
  selectedPalette   = signal<ColorPalette | null>(null);

  isGenerating     = signal<boolean>(false);
  generationResult = signal<GenerateResponse | null>(null);
  sliderPos        = signal<number>(50);

  isResultStep     = computed(() => this.currentStep() === this.steps.length - 1);
  isLastWizardStep = computed(() => this.currentStep() === this.steps.length - 2);

  progressPercent = computed(() =>
    (this.currentStep() / (this.steps.length - 1)) * 100
  );

  canGoNext = computed(() => {
    if (this.currentStep() === 0) return this.roomFile() !== null;
    if (this.currentStep() === 1) return this.selectedStyle() !== null || this.customStyle().trim().length > 0;
    return true;
  });

  canGenerate = computed(() =>
    this.roomFile() !== null &&
    (this.selectedStyle() !== null || this.customStyle().trim().length > 0) &&
    !this.isGenerating()
  );

  roomPreviewUrl = computed(() => {
    const file = this.roomFile();
    return file ? URL.createObjectURL(file) : '';
  });

  constructor(
    private generation: GenerationService,
    public auth: AuthService,
    private toast: ToastService,
    private router: Router
  ) {
  }

  goNext(): void {
    if (this.currentStep() < this.steps.length - 1 && this.canGoNext()) {
      this.stepDirection.set('forward');
      this.currentStep.update(s => s + 1);
      document.querySelector('.page-content')?.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  goBack(): void {
    if (this.currentStep() > 0) {
      this.stepDirection.set('back');
      this.currentStep.update(s => s - 1);
      document.querySelector('.page-content')?.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  goToStudio(): void { this.router.navigate(['/tabs/home']); }
  goToHistory(): void { this.router.navigate(['/tabs/history']); }

  goToStep(i: number): void {
    this.stepDirection.set('back');
    this.currentStep.set(i);
  }

  onNewDesign(): void {
    this.generationResult.set(null);
    this.stepDirection.set('back');
    this.currentStep.set(0);
    document.querySelector('.page-content')?.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onGenerateAndAdvance(): void {
    if (!this.canGenerate()) return;
    if (!this.auth.token) {
      this.router.navigate(['/auth/login'], { queryParams: { returnUrl: this.router.url } });
      return;
    }
    this.stepDirection.set('forward');
    this.currentStep.set(this.steps.length - 1);
    document.querySelector('.page-content')?.scrollTo({ top: 0, behavior: 'smooth' });
    this.onGenerate();
  }

  onRoomSelected(file: File): void { this.roomFile.set(file); this.generationResult.set(null); }
  onRoomRemoved(): void { this.roomFile.set(null); }

  onStyleSelected(style: RoomStyle): void { this.selectedStyle.set(style); }

  togglePalette(palette: ColorPalette): void {
    this.selectedPalette.set(this.selectedPalette()?.id === palette.id ? null : palette);
  }

  async onGenerate(): Promise<void> {
    const room = this.roomFile();
    if (!room || this.isGenerating()) return;

    this.isGenerating.set(true);
    this.generationResult.set(null);

    try {
      const compressed = await resizeImage(room, 1920, 1920, 0.85);
      const compressedFile = new File([compressed], room.name, { type: compressed.type });
      const style = this.selectedStyle();

      this.generation.surfaceEdit({
        roomImage: compressedFile,
        type: 'walls',
        styleId: style?.id || 'custom',
        styleName: style?.name || 'Custom',
        stylePrompt: style?.prompt || '',
        customStyle: this.customStyle() || undefined,
        palettePrompt: this.selectedPalette()?.prompt || undefined,
        userId: this.auth.currentUser?._id || 'anonymous',
      }).subscribe({
        next: (res) => {
          this.generationResult.set(res);
          this.sliderPos.set(50);
          this.isGenerating.set(false);
          this.toast.success('Wall design ready!');
        },
        error: (err) => {
          const msg = err?.error?.message || 'Generation failed. Please try again.';
          this.toast.error(Array.isArray(msg) ? msg[0] : msg);
          this.isGenerating.set(false);
        },
      });
    } catch {
      this.toast.error('Failed to process image. Please try again.');
      this.isGenerating.set(false);
    }
  }

  onRegenerate(): void { this.generationResult.set(null); this.onGenerate(); }

  startSliderDrag(e: MouseEvent | TouchEvent, el: HTMLElement): void {
    e.preventDefault();
    this.updateSlider(e, el);
    const onMove = (ev: MouseEvent | TouchEvent) => { ev.preventDefault(); this.updateSlider(ev, el); };
    const onUp = () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('touchmove', onMove as EventListener);
      document.removeEventListener('mouseup', onUp);
      document.removeEventListener('touchend', onUp);
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('touchmove', onMove as EventListener, { passive: false });
    document.addEventListener('mouseup', onUp);
    document.addEventListener('touchend', onUp);
  }

  private updateSlider(e: MouseEvent | TouchEvent, el: HTMLElement): void {
    const rect = el.getBoundingClientRect();
    const clientX = 'touches' in e ? (e as TouchEvent).touches[0].clientX : (e as MouseEvent).clientX;
    const pos = ((clientX - rect.left) / rect.width) * 100;
    this.sliderPos.set(Math.min(100, Math.max(0, pos)));
  }
}
