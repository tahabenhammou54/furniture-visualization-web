import { Component, computed, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  sparklesOutline,
  arrowBackOutline,
  flashOutline,
  swapHorizontalOutline,
  chevronForwardOutline,
  chevronBackOutline,
  checkmarkOutline,
} from 'ionicons/icons';
import { GenerationService } from '../services/generation.service';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';
import { GenerateResponse, PresetRoom } from '../models/generation.model';
import { PhotoPickerComponent } from '../components/photo-picker/photo-picker.component';
import { RoomGalleryComponent } from '../components/room-gallery/room-gallery.component';
import { ResultActionsComponent } from '../components/result-actions/result-actions.component';
import { AiLoaderComponent } from '../components/ai-loader/ai-loader.component';
import { resizeImage, urlToFile } from '../utils/image.utils';
import { TranslatePipe } from '../pipes/translate.pipe';

type RoomInputMode = 'upload' | 'gallery';

export interface WizardStep { id: string; labelKey: string; required: boolean; }

@Component({
  selector: 'app-replace',
  standalone: true,
  imports: [
    CommonModule, FormsModule, IonContent, IonIcon,
    PhotoPickerComponent, RoomGalleryComponent,
    ResultActionsComponent, AiLoaderComponent, TranslatePipe,
  ],
  templateUrl: './replace.page.html',
  styleUrls: ['./replace.page.scss'],
})
export class ReplacePage {
  @ViewChild(IonContent, { static: false }) private content!: IonContent;

  readonly steps: WizardStep[] = [
    { id: 'furniture', labelKey: 'home.furniture_photo', required: true  },
    { id: 'room',      labelKey: 'home.room_space',      required: false },
    { id: 'describe',  labelKey: 'home.describe',        required: false },
    { id: 'result',    labelKey: 'home.your_viz',        required: false },
  ];

  // ── Wizard state ─────────────────────────────────────────
  currentStep   = signal<number>(0);
  stepDirection = signal<'forward' | 'back'>('forward');

  // ── Form state ───────────────────────────────────────────
  furnitureFile  = signal<File | null>(null);
  roomFile       = signal<File | null>(null);
  selectedRoomId = signal<string | null>(null);
  isFetchingRoom = signal<boolean>(false);
  prompt         = signal<string>('');
  roomInputMode  = signal<RoomInputMode>('gallery');

  // ── Result ───────────────────────────────────────────────
  isGenerating     = signal<boolean>(false);
  generationResult = signal<GenerateResponse | null>(null);
  sliderPos        = signal<number>(50);

  // ── Computed ─────────────────────────────────────────────
  isResultStep     = computed(() => this.currentStep() === this.steps.length - 1);
  isLastWizardStep = computed(() => this.currentStep() === this.steps.length - 2);

  progressPercent = computed(() =>
    (this.currentStep() / (this.steps.length - 1)) * 100
  );

  canGoNext = computed(() => {
    if (this.currentStep() === 0) return this.furnitureFile() !== null;
    return true;
  });

  canGenerate = computed(() => this.furnitureFile() !== null && !this.isGenerating());

  roomPreviewUrl = computed(() => {
    const file = this.roomFile();
    return file ? URL.createObjectURL(file) : '';
  });

  get userInitials(): string {
    const name = this.auth.currentUser?.name || '';
    return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
  }

  get userAvatar(): string | undefined {
    return this.auth.currentUser?.avatar;
  }

  constructor(
    private generation: GenerationService,
    public auth: AuthService,
    private toast: ToastService,
    private router: Router
  ) {
    addIcons({ sparklesOutline, arrowBackOutline, flashOutline, swapHorizontalOutline, chevronForwardOutline, chevronBackOutline, checkmarkOutline });
  }

  // ── Navigation ───────────────────────────────────────────
  goNext(): void {
    if (this.currentStep() < this.steps.length - 1 && this.canGoNext()) {
      this.stepDirection.set('forward');
      this.currentStep.update(s => s + 1);
      this.content?.scrollToTop(300);
    }
  }

  goBack(): void {
    if (this.currentStep() > 0) {
      this.stepDirection.set('back');
      this.currentStep.update(s => s - 1);
      this.content?.scrollToTop(300);
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
    this.content?.scrollToTop(300);
  }

  onGenerateAndAdvance(): void {
    if (!this.canGenerate()) return;
    if (!this.auth.token) {
      this.router.navigate(['/auth/login'], { queryParams: { returnUrl: this.router.url } });
      return;
    }
    this.stepDirection.set('forward');
    this.currentStep.set(this.steps.length - 1);
    this.content?.scrollToTop(300);
    this.onGenerate();
  }

  // ── Form handlers ────────────────────────────────────────
  onFurnitureSelected(file: File): void { this.furnitureFile.set(file); this.generationResult.set(null); }
  onFurnitureRemoved(): void { this.furnitureFile.set(null); this.generationResult.set(null); }

  onRoomSelected(file: File): void { this.roomFile.set(file); this.selectedRoomId.set(null); }
  onRoomRemoved(): void { this.roomFile.set(null); }

  async onPresetRoomSelected(room: PresetRoom): Promise<void> {
    this.selectedRoomId.set(room.id);
    this.roomFile.set(null);
    this.isFetchingRoom.set(true);
    try {
      const file = await urlToFile(room.thumbnailUrl, `${room.id}.jpg`);
      this.roomFile.set(file);
    } catch {
      await this.toast.warning('Could not load preset room image. Generation will proceed without a room.');
    } finally {
      this.isFetchingRoom.set(false);
    }
  }

  setRoomMode(mode: RoomInputMode): void {
    this.roomInputMode.set(mode);
    this.roomFile.set(null);
    this.selectedRoomId.set(null);
  }

  // ── Generate ─────────────────────────────────────────────
  async onGenerate(): Promise<void> {
    const furniture = this.furnitureFile();
    if (!furniture || this.isGenerating()) return;

    this.isGenerating.set(true);
    this.generationResult.set(null);

    try {
      const compressed = await resizeImage(furniture, 1920, 1920, 0.85);
      const compressedFile = new File([compressed], furniture.name, { type: compressed.type });

      this.generation.generate({
        furnitureImage: compressedFile,
        userId: this.auth.currentUser?._id || 'anonymous',
        roomImage: this.roomFile() ?? undefined,
        prompt: this.prompt() || undefined,
      }).subscribe({
        next: (res) => {
          this.generationResult.set(res);
          this.sliderPos.set(50);
          this.isGenerating.set(false);
          this.toast.success('Visualization ready!');
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
