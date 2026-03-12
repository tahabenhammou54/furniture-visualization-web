import { Component, computed, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { GenerationService } from '../services/generation.service';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';
import { GenerateResponse, PresetRoom, BuildRoomApiRequest } from '../models/generation.model';
import { RoomStyle, COLOR_PALETTES, ColorPalette } from '../models/build-room.model';
import { PhotoPickerComponent } from '../components/photo-picker/photo-picker.component';
import { ExteriorGalleryComponent } from '../components/exterior-gallery/exterior-gallery.component';
import { StyleSelectorComponent } from '../components/style-selector/style-selector.component';
import { ResultActionsComponent } from '../components/result-actions/result-actions.component';
import { AiLoaderComponent } from '../components/ai-loader/ai-loader.component';
import { resizeImage, urlToFile } from '../utils/image.utils';
import { TranslatePipe } from '../pipes/translate.pipe';
import { IconComponent } from '../shared/icon/icon.component';

type PhotoInputMode = 'upload' | 'gallery';

export type BuildingType = 'villa' | 'house' | 'apartment' | 'commercial' | 'townhouse' | 'modern_complex' | 'garden';

export interface BuildingTypeOption {
  id: BuildingType;
  label: string;
  icon: string;
}

export const BUILDING_TYPE_OPTIONS: BuildingTypeOption[] = [
  { id: 'villa',          label: 'Villa',           icon: '🏡' },
  { id: 'house',          label: 'House',            icon: '🏠' },
  { id: 'apartment',      label: 'Apartment',        icon: '🏢' },
  { id: 'commercial',     label: 'Commercial',       icon: '🏬' },
  { id: 'townhouse',      label: 'Townhouse',        icon: '🏘️' },
  { id: 'modern_complex', label: 'Modern Complex',   icon: '🏙️' },
  { id: 'garden', label: 'Garden', icon: '🌳'},
];

export interface WizardStep { id: string; labelKey: string; required: boolean; }

@Component({
  selector: 'app-exterior-design',
  standalone: true,
  imports: [
    CommonModule, FormsModule, IconComponent,     PhotoPickerComponent, ExteriorGalleryComponent, StyleSelectorComponent,
    ResultActionsComponent, AiLoaderComponent, TranslatePipe,
  ],
  templateUrl: './exterior-design.page.html',
  styleUrls: ['./exterior-design.page.scss'],
})
export class ExteriorDesignPage {

  readonly buildingTypeOptions = BUILDING_TYPE_OPTIONS;

  readonly steps: WizardStep[] = [
    { id: 'photo',     labelKey: 'exterior.photo',          required: false },
    { id: 'building',  labelKey: 'exterior.building_type',  required: true  },
    { id: 'style',     labelKey: 'exterior.style',          required: true  },
    { id: 'palette',   labelKey: 'palette.title',           required: false },
    { id: 'result',    labelKey: 'exterior.your_design',    required: false },
  ];

  // ── Wizard state ─────────────────────────────────────────
  currentStep   = signal<number>(0);
  stepDirection = signal<'forward' | 'back'>('forward');

  // ── Form state ───────────────────────────────────────────
  selectedBuildingType   = signal<BuildingType | null>(null);
  photoInputMode         = signal<PhotoInputMode>('gallery');
  photoFile              = signal<File | null>(null);
  selectedPhotoId        = signal<string | null>(null);
  isFetchingPhoto        = signal<boolean>(false);
  selectedStyle          = signal<RoomStyle | null>(null);
  readonly colorPalettes = COLOR_PALETTES;
  selectedColorPalette   = signal<string | null>(null);

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
    if (s === 1) return this.selectedBuildingType() !== null;
    if (s === 2) return this.selectedStyle() !== null;
    return true;
  });

  canGenerate = computed(() =>
    this.selectedBuildingType() !== null &&
    this.selectedStyle() !== null &&
    !this.isGenerating()
  );

  photoPreviewUrl = computed(() => {
    const f = this.photoFile();
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

  // ── Form handlers ────────────────────────────────────────
  selectBuildingType(type: BuildingType): void { this.selectedBuildingType.set(type); }

  setPhotoMode(mode: PhotoInputMode): void {
    this.photoInputMode.set(mode);
    this.photoFile.set(null);
    this.selectedPhotoId.set(null);
  }

  onPhotoSelected(file: File): void { this.photoFile.set(file); this.selectedPhotoId.set(null); }
  onPhotoRemoved(): void { this.photoFile.set(null); }

  async onPresetPhotoSelected(item: PresetRoom): Promise<void> {
    this.selectedPhotoId.set(item.id);
    this.photoFile.set(null);
    this.isFetchingPhoto.set(true);
    try {
      const file = await urlToFile(item.thumbnailUrl, `${item.id}.jpg`);
      this.photoFile.set(file);
    } catch {
      await this.toast.warning('Could not load preset photo.');
    } finally {
      this.isFetchingPhoto.set(false);
    }
  }

  onStyleSelected(style: RoomStyle): void { this.selectedStyle.set(style); }

  // ── Generate ─────────────────────────────────────────────
  async onGenerate(): Promise<void> {
    if (!this.canGenerate()) return;
    const style = this.selectedStyle()!;
    const buildingType = this.selectedBuildingType()!;
    const buildingLabel = this.buildingTypeOptions.find(o => o.id === buildingType)?.label ?? buildingType;

    this.isGenerating.set(true);
    this.generationResult.set(null);

    try {
      const colorNote = this._buildColorPalettePrompt();
      const exteriorPromptContext = `Exterior architecture redesign of a ${buildingLabel}. Focus on façade, materials, landscaping, and curb appeal.${colorNote ? ' ' + colorNote : ''}`.trim();

      const req: BuildRoomApiRequest = {
        roomImage: this.photoFile() ? await this._compressPhoto(this.photoFile()!) : undefined,
        furnitureItems: [],
        roomType: 'outdoor',
        styleId: style.id,
        styleName: style.name,
        stylePrompt: style.prompt,
        autoComplete: true,
        prompt: exteriorPromptContext,
        userId: this.auth.currentUser?._id || 'anonymous',
      };

      this.generation.buildRoom(req).subscribe({
        next: (res) => {
          this.generationResult.set(res);
          this.sliderPos.set(50);
          this.isGenerating.set(false);
          this.toast.success('Exterior design ready!');
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

  private _buildColorPalettePrompt(): string | undefined {
    const id = this.selectedColorPalette();
    if (!id || id === 'keep') return undefined;
    if (id === 'surprise') return 'Use a creative and surprising color palette that complements the style beautifully.';
    const palette = this.colorPalettes.find(p => p.id === id);
    return palette ? `Use a color palette inspired by ${palette.name}: ${palette.prompt}.` : undefined;
  }

  private async _compressPhoto(file: File): Promise<File> {
    const blob = await resizeImage(file, 1920, 1920, 0.85);
    return new File([blob], file.name, { type: blob.type });
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
