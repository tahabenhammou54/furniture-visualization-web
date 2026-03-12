import { Component, computed, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { GenerationService } from '../services/generation.service';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';
import { GenerateResponse, PresetRoom, BuildRoomApiRequest } from '../models/generation.model';
import { RoomStyle, RoomType, ROOM_TYPE_OPTIONS, SelectedFurnitureItem, COLOR_PALETTES, ColorPalette } from '../models/build-room.model';
import { PhotoPickerComponent } from '../components/photo-picker/photo-picker.component';
import { RoomGalleryComponent } from '../components/room-gallery/room-gallery.component';
import { StyleSelectorComponent } from '../components/style-selector/style-selector.component';
import { FurnitureMultiUploadComponent } from '../components/furniture-multi-upload/furniture-multi-upload.component';
import { ResultActionsComponent } from '../components/result-actions/result-actions.component';
import { AiLoaderComponent } from '../components/ai-loader/ai-loader.component';
import { resizeImage, urlToFile } from '../utils/image.utils';
import { TranslatePipe } from '../pipes/translate.pipe';
import { IconComponent } from '../shared/icon/icon.component';

type RoomInputMode = 'upload' | 'gallery';

export interface WizardStep { id: string; labelKey: string; required: boolean; }

@Component({
  selector: 'app-build-room',
  standalone: true,
  imports: [
    CommonModule, FormsModule, IconComponent,     PhotoPickerComponent, RoomGalleryComponent, StyleSelectorComponent,
    FurnitureMultiUploadComponent, ResultActionsComponent,
    AiLoaderComponent, TranslatePipe,
  ],
  templateUrl: './build-room.page.html',
  styleUrls: ['./build-room.page.scss'],
})
export class BuildRoomPage {

  readonly roomTypeOptions = ROOM_TYPE_OPTIONS;

  readonly steps: WizardStep[] = [
    { id: 'space',     labelKey: 'build.room_space',      required: false },
    { id: 'type',      labelKey: 'build.room_type',       required: true  },
    { id: 'furniture', labelKey: 'build.furniture_items', required: false },
    { id: 'style',     labelKey: 'build.interior_style',  required: true  },
    { id: 'palette',   labelKey: 'palette.title',         required: false },
    { id: 'result',    labelKey: 'build.your_room',       required: false },
  ];

  // ── Wizard state ─────────────────────────────────────────
  currentStep   = signal<number>(0);
  stepDirection = signal<'forward' | 'back'>('forward');

  // ── Form state ───────────────────────────────────────────
  selectedRoomType  = signal<RoomType | null>(null);
  roomInputMode     = signal<RoomInputMode>('gallery');
  roomFile          = signal<File | null>(null);
  selectedRoomId    = signal<string | null>(null);
  isFetchingRoom    = signal<boolean>(false);
  furnitureItems    = signal<SelectedFurnitureItem[]>([]);
  autoComplete      = signal<boolean>(true);
  selectedStyle          = signal<RoomStyle | null>(null);
  readonly colorPalettes = COLOR_PALETTES;
  selectedColorPalette   = signal<string | null>(null); // palette id, 'keep', 'surprise', or null

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
    const s = this.currentStep();
    if (s === 1) return this.selectedRoomType() !== null;
    if (s === 3) return this.selectedStyle() !== null;
    return true;
  });

  canGenerate = computed(() =>
    this.selectedRoomType() !== null &&
    this.selectedStyle() !== null &&
    (this.furnitureItems().length > 0 || this.autoComplete()) &&
    !this.isGenerating()
  );

  roomPreviewUrl = computed(() => {
    const f = this.roomFile();
    return f ? URL.createObjectURL(f) : '';
  });

  get userInitials(): string {
    const name = this.auth.currentUser?.name || '';
    return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
  }

  get userAvatar(): string | undefined {
    return this.auth.currentUser?.imageUrl;
  }

  constructor(
    private generation: GenerationService,
    public auth: AuthService,
    private toast: ToastService,
    private router: Router
  ) {
  }

  // ── Navigation ───────────────────────────────────────────
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
    this.selectedColorPalette.set(null);
    this.stepDirection.set('back');
    this.currentStep.set(0);
    document.querySelector('.page-content')?.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ── Form handlers ────────────────────────────────────────
  selectRoomType(type: RoomType): void { this.selectedRoomType.set(type); }

  setRoomMode(mode: RoomInputMode): void {
    this.roomInputMode.set(mode);
    this.roomFile.set(null);
    this.selectedRoomId.set(null);
  }

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
      await this.toast.warning('Could not load preset room.');
    } finally {
      this.isFetchingRoom.set(false);
    }
  }

  onFurnitureItemsChanged(items: SelectedFurnitureItem[]): void { this.furnitureItems.set(items); }
  onAutoCompleteChanged(value: boolean): void { this.autoComplete.set(value); }
  onStyleSelected(style: RoomStyle): void { this.selectedStyle.set(style); }

  // ── Generate ─────────────────────────────────────────────
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

  async onGenerate(): Promise<void> {
    if (!this.canGenerate()) return;
    const style = this.selectedStyle()!;
    const roomType = this.selectedRoomType()!;
    const items = this.furnitureItems();

    this.isGenerating.set(true);
    this.generationResult.set(null);

    try {
      const furnitureFiles = await Promise.all(
        items.map(async (item) => {
          const c = await resizeImage(item.file, 1920, 1920, 0.85);
          return new File([c], item.file.name, { type: c.type });
        })
      );
      const req: BuildRoomApiRequest = {
        roomImage: this.roomFile() ?? undefined,
        furnitureItems: furnitureFiles,
        roomType,
        styleId: style.id,
        styleName: style.name,
        stylePrompt: style.prompt,
        autoComplete: this.autoComplete(),
        prompt: this._buildColorPalettePrompt(),
        userId: this.auth.currentUser?._id || 'anonymous',
      };
      this.generation.buildRoom(req).subscribe({
        next: (res) => {
          this.generationResult.set(res);
          this.sliderPos.set(50);
          this.isGenerating.set(false);
          this.toast.success('Interior design ready!');
        },
        error: (err) => {
          const msg = err?.error?.message || 'Generation failed. Please try again.';
          this.toast.error(Array.isArray(msg) ? msg[0] : msg);
          this.isGenerating.set(false);
        },
      });
    } catch {
      this.toast.error('Failed to process images. Please try again.');
      this.isGenerating.set(false);
    }
  }

  onRegenerate(): void { this.generationResult.set(null); this.onGenerate(); }

  private _buildColorPalettePrompt(): string | undefined {
    const id = this.selectedColorPalette();
    if (!id || id === 'keep') return undefined;
    if (id === 'surprise') return 'Use a creative and surprising color palette that complements the style beautifully.';
    const palette = this.colorPalettes.find(p => p.id === id);
    return palette ? `Use a color palette inspired by ${palette.name}: ${palette.prompt}.` : undefined;
  }

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
