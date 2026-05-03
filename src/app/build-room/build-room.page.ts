import { Component, computed, signal, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  sparklesOutline,
  flashOutline,
  arrowBackOutline,
  chevronForwardOutline,
  chevronBackOutline,
  checkmarkOutline,
  homeOutline,
  addCircleOutline,
  informationCircleOutline,
  imageOutline,
  checkmarkCircleOutline,
  closeCircle,
} from 'ionicons/icons';
import { GenerationService } from '../services/generation.service';
import { AuthService } from '../services/auth.service';
import { AuthModalService } from '../services/auth-modal.service';
import { ToastService } from '../services/toast.service';
import { GenerateResponse, PresetRoom, BuildRoomApiRequest } from '../models/generation.model';
import { RoomStyle, RoomType, ROOM_TYPE_OPTIONS, ROOM_STYLES, SelectedFurnitureItem, COLOR_PALETTES } from '../models/build-room.model';
import { PhotoPickerComponent } from '../components/photo-picker/photo-picker.component';
import { RoomGalleryComponent } from '../components/room-gallery/room-gallery.component';
import { StyleSelectorComponent } from '../components/style-selector/style-selector.component';
import { FurnitureMultiUploadComponent } from '../components/furniture-multi-upload/furniture-multi-upload.component';
import { ResultActionsComponent } from '../components/result-actions/result-actions.component';
import { AiLoaderComponent } from '../components/ai-loader/ai-loader.component';
import { resizeImage, urlToFile } from '../utils/image.utils';
import { TranslatePipe } from '../pipes/translate.pipe';

type RoomInputMode = 'upload' | 'gallery' | 'sketch';

export interface WizardStep { id: string; labelKey: string; required: boolean; }

interface FurnitureLibraryItem {
  id: string;
  file: File;
  url: string;
}

interface SketchItem {
  id: string;
  libraryId: string;
  url: string;
  x: number;      // % of container width  (visible frame left)
  y: number;      // % of container height (visible frame top)
  w: number;      // % of container width  (visible frame width)
  h: number;      // % of container height (visible frame height)
  origW: number;  // full (pre-crop) image width in %
  origH: number;  // full (pre-crop) image height in %
  cropL: number;  // 0-1 fraction cropped from left
  cropR: number;
  cropT: number;
  cropB: number;
  rotation: number; // degrees (2D)
  rotY: number;     // degrees (3D Y-axis)
}

@Component({
  selector: 'app-build-room',
  standalone: true,
  imports: [
    CommonModule, FormsModule, IonContent, IonIcon,
    PhotoPickerComponent, RoomGalleryComponent, StyleSelectorComponent,
    FurnitureMultiUploadComponent, ResultActionsComponent,
    AiLoaderComponent, TranslatePipe,
  ],
  templateUrl: './build-room.page.html',
  styleUrls: ['./build-room.page.scss'],
})
export class BuildRoomPage {
  @ViewChild(IonContent, { static: false }) private content!: IonContent;
  @ViewChild('sketchContainer') private sketchContainerRef!: ElementRef<HTMLDivElement>;
  @ViewChild('sketchFurnitureInput') private sketchFurnitureInputRef!: ElementRef<HTMLInputElement>;
  @ViewChild('sketchBgInput') private sketchBgInputRef!: ElementRef<HTMLInputElement>;

  readonly roomTypeOptions = ROOM_TYPE_OPTIONS;

  readonly steps: WizardStep[] = [
    { id: 'space',     labelKey: 'build.room_space',      required: true },
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
  roomInputMode     = signal<RoomInputMode>('upload');
  roomFile          = signal<File | null>(null);
  selectedRoomId    = signal<string | null>(null);
  isFetchingRoom    = signal<boolean>(false);
  furnitureItems    = signal<SelectedFurnitureItem[]>([]);
  autoComplete      = signal<boolean>(true);
  selectedStyle     = signal<RoomStyle | null>(null);

  // ── Sketch state ──────────────────────────────────────────
  furnitureLibrary   = signal<FurnitureLibraryItem[]>([]);
  sketchItems        = signal<SketchItem[]>([]);
  sketchBgFile       = signal<File | null>(null);
  sketchZoom         = signal<number>(1);
  showSketchTooltip  = signal<boolean>(false);
  isCapturing        = signal<boolean>(false);
  activeSketchItemId = signal<string | null>(null);
  isDraggingItem     = signal<boolean>(false);

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

  sketchBgUrl = computed(() => {
    const f = this.sketchBgFile();
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
    private router: Router,
    private authModal: AuthModalService,
  ) {
    addIcons({ sparklesOutline, flashOutline, arrowBackOutline, chevronForwardOutline, chevronBackOutline, checkmarkOutline, homeOutline, addCircleOutline, informationCircleOutline, imageOutline, checkmarkCircleOutline, closeCircle });
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
    this.selectedColorPalette.set(null);
    this.stepDirection.set('back');
    this.currentStep.set(0);
    this.content?.scrollToTop(300);
  }

  // ── Form handlers ────────────────────────────────────────
  selectRoomType(type: RoomType): void { this.selectedRoomType.set(type); }

  setRoomMode(mode: RoomInputMode): void {
    this.roomInputMode.set(mode);
    this.roomFile.set(null);
    this.selectedRoomId.set(null);
    if (mode !== 'sketch') {
      this.furnitureLibrary.update(items => {
        items.forEach(i => URL.revokeObjectURL(i.url));
        return [];
      });
      this.sketchItems.set([]);
      this.sketchBgFile.set(null);
      this.activeSketchItemId.set(null);
    }
  }

  onRoomSelected(file: File): void { this.roomFile.set(file); this.selectedRoomId.set(null); }
  onRoomRemoved(): void { this.roomFile.set(null); }

  // ── Sketch helpers ───────────────────────────────────────
  triggerSketchFurnitureInput(): void { this.sketchFurnitureInputRef?.nativeElement.click(); }
  triggerSketchBgInput(): void        { this.sketchBgInputRef?.nativeElement.click(); }
  toggleSketchTooltip(): void         { this.showSketchTooltip.update(v => !v); }

  onSketchBgFile(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    this.sketchBgFile.set(file);
    input.value = '';
  }

  onSketchFurnitureFiles(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = Array.from(input.files || []);
    input.value = '';
    for (const file of files) {
      const url = URL.createObjectURL(file);
      const id = Date.now().toString(36) + Math.random().toString(36).slice(2);
      this.furnitureLibrary.update(items => [...items, { id, file, url }]);
    }
  }

  async addToCanvas(libItem: FurnitureLibraryItem): Promise<void> {
    const img = new Image();
    img.src = libItem.url;
    await new Promise<void>(r => { img.onload = () => r(); img.onerror = () => r(); });
    const container = this.sketchContainerRef?.nativeElement;
    const cW = container?.clientWidth  || 400;
    const cH = container?.clientHeight || 300;
    const origW = 25;
    const hPx = (origW / 100 * cW) * (img.naturalHeight / img.naturalWidth || 1);
    const origH = Math.min((hPx / cH) * 100, 80);
    const id = Date.now().toString(36) + Math.random().toString(36).slice(2);
    this.sketchItems.update(items => [...items, {
      id,
      libraryId: libItem.id,
      url: libItem.url,
      x: Math.max(0, 50 - origW / 2),
      y: Math.max(0, 50 - origH / 2),
      w: origW, h: origH, origW, origH,
      cropL: 0, cropR: 0, cropT: 0, cropB: 0,
      rotation: 0, rotY: 0,
    }]);
  }

  removeFurnitureFromLibrary(libId: string): void {
    const item = this.furnitureLibrary().find(i => i.id === libId);
    if (item) URL.revokeObjectURL(item.url);
    this.furnitureLibrary.update(items => items.filter(i => i.id !== libId));
  }

  removeSketchFurniture(id: string): void {
    this.sketchItems.update(items => items.filter(i => i.id !== id));
    if (this.activeSketchItemId() === id) this.activeSketchItemId.set(null);
  }

  zoomIn():  void { this.sketchZoom.update(z => Math.min(2.5, parseFloat((z + 0.25).toFixed(2)))); }
  zoomOut(): void { this.sketchZoom.update(z => Math.max(0.4, parseFloat((z - 0.25).toFixed(2)))); }

  // ── Item transform ────────────────────────────────────────
  itemTransform(item: SketchItem): string {
    const dragging = this.isDraggingItem() && this.activeSketchItemId() === item.id;
    const scale = dragging ? ' scale(1.04)' : '';
    return `perspective(800px) rotateY(${item.rotY}deg) rotate(${item.rotation}deg)${scale}`;
  }

  // ── Image crop CSS helpers ────────────────────────────────
  imgLeft(item: SketchItem): string {
    const d = 1 - item.cropL - item.cropR;
    return d > 0 ? `${-(item.cropL / d) * 100}%` : '0%';
  }
  imgTop(item: SketchItem): string {
    const d = 1 - item.cropT - item.cropB;
    return d > 0 ? `${-(item.cropT / d) * 100}%` : '0%';
  }
  imgWidth(item: SketchItem): string {
    const d = 1 - item.cropL - item.cropR;
    return d > 0 ? `${100 / d}%` : '100%';
  }
  imgHeight(item: SketchItem): string {
    const d = 1 - item.cropT - item.cropB;
    return d > 0 ? `${100 / d}%` : '100%';
  }

  // ── Drag ──────────────────────────────────────────────────
  startFurnitureDrag(e: MouseEvent | TouchEvent, itemId: string): void {
    e.preventDefault();
    e.stopPropagation();
    const container = this.sketchContainerRef?.nativeElement;
    if (!container) return;
    const item = this.sketchItems().find(i => i.id === itemId);
    if (!item) return;

    this.activeSketchItemId.set(itemId);
    this.isDraggingItem.set(true);

    const rect   = container.getBoundingClientRect();
    const startX = item.x;
    const startY = item.y;
    const itemW  = item.w;
    const itemH  = item.h;
    const cx0 = 'touches' in e ? (e as TouchEvent).touches[0].clientX : (e as MouseEvent).clientX;
    const cy0 = 'touches' in e ? (e as TouchEvent).touches[0].clientY : (e as MouseEvent).clientY;

    const onMove = (ev: MouseEvent | TouchEvent) => {
      const cx = 'touches' in ev ? (ev as TouchEvent).touches[0].clientX : (ev as MouseEvent).clientX;
      const cy = 'touches' in ev ? (ev as TouchEvent).touches[0].clientY : (ev as MouseEvent).clientY;
      const newX = Math.max(0, Math.min(100 - itemW, startX + (cx - cx0) / rect.width  * 100));
      const newY = Math.max(0, Math.min(100 - itemH, startY + (cy - cy0) / rect.height * 100));
      this.sketchItems.update(its => its.map(i => i.id === itemId ? { ...i, x: newX, y: newY } : i));
    };
    const onUp = () => {
      this.isDraggingItem.set(false);
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('touchmove', onMove as EventListener);
      document.removeEventListener('mouseup',   onUp);
      document.removeEventListener('touchend',  onUp);
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('touchmove',  onMove as EventListener, { passive: false });
    document.addEventListener('mouseup',   onUp);
    document.addEventListener('touchend',  onUp);
  }

  // ── 2D Rotation ───────────────────────────────────────────
  startFurnitureRotate(e: MouseEvent | TouchEvent, itemId: string): void {
    e.preventDefault();
    e.stopPropagation();
    const container = this.sketchContainerRef?.nativeElement;
    if (!container) return;
    const item = this.sketchItems().find(i => i.id === itemId);
    if (!item) return;
    const rect    = container.getBoundingClientRect();
    const centerX = rect.left + ((item.x + item.w / 2) / 100) * rect.width;
    const centerY = rect.top  + ((item.y + item.h / 2) / 100) * rect.height;
    const cx0 = 'touches' in e ? (e as TouchEvent).touches[0].clientX : (e as MouseEvent).clientX;
    const cy0 = 'touches' in e ? (e as TouchEvent).touches[0].clientY : (e as MouseEvent).clientY;
    const startRot   = item.rotation;
    const startAngle = Math.atan2(cy0 - centerY, cx0 - centerX) * 180 / Math.PI;

    const onMove = (ev: MouseEvent | TouchEvent) => {
      const cx = 'touches' in ev ? (ev as TouchEvent).touches[0].clientX : (ev as MouseEvent).clientX;
      const cy = 'touches' in ev ? (ev as TouchEvent).touches[0].clientY : (ev as MouseEvent).clientY;
      const angle = Math.atan2(cy - centerY, cx - centerX) * 180 / Math.PI;
      this.sketchItems.update(its => its.map(i => i.id === itemId ? { ...i, rotation: startRot + angle - startAngle } : i));
    };
    const onUp = () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('touchmove', onMove as EventListener);
      document.removeEventListener('mouseup',  onUp);
      document.removeEventListener('touchend', onUp);
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('touchmove',  onMove as EventListener, { passive: false });
    document.addEventListener('mouseup',  onUp);
    document.addEventListener('touchend', onUp);
  }

  // ── 3D Y-Rotation ─────────────────────────────────────────
  startRotateY(e: MouseEvent | TouchEvent, itemId: string): void {
    e.preventDefault();
    e.stopPropagation();
    const item = this.sketchItems().find(i => i.id === itemId);
    if (!item) return;
    this.activeSketchItemId.set(itemId);
    const startRotY = item.rotY;
    const cx0 = 'touches' in e ? (e as TouchEvent).touches[0].clientX : (e as MouseEvent).clientX;

    const onMove = (ev: MouseEvent | TouchEvent) => {
      const cx = 'touches' in ev ? (ev as TouchEvent).touches[0].clientX : (ev as MouseEvent).clientX;
      const newRotY = Math.max(-80, Math.min(80, startRotY + (cx - cx0) * 0.6));
      this.sketchItems.update(its => its.map(i => i.id === itemId ? { ...i, rotY: newRotY } : i));
    };
    const onUp = () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('touchmove', onMove as EventListener);
      document.removeEventListener('mouseup',  onUp);
      document.removeEventListener('touchend', onUp);
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('touchmove',  onMove as EventListener, { passive: false });
    document.addEventListener('mouseup',  onUp);
    document.addEventListener('touchend', onUp);
  }

  // ── Resize (bottom-right corner) ─────────────────────────
  startFurnitureResize(e: MouseEvent | TouchEvent, itemId: string): void {
    e.preventDefault();
    e.stopPropagation();
    const container = this.sketchContainerRef?.nativeElement;
    if (!container) return;
    const item = this.sketchItems().find(i => i.id === itemId);
    if (!item) return;
    const rect   = container.getBoundingClientRect();
    const startW = item.origW;
    const startH = item.origH;
    const cx0 = 'touches' in e ? (e as TouchEvent).touches[0].clientX : (e as MouseEvent).clientX;

    const onMove = (ev: MouseEvent | TouchEvent) => {
      const cx  = 'touches' in ev ? (ev as TouchEvent).touches[0].clientX : (ev as MouseEvent).clientX;
      const newW = Math.max(5, Math.min(90, startW + (cx - cx0) / rect.width * 100));
      const newH = Math.max(3, startH * (newW / startW));
      this.sketchItems.update(its => its.map(i =>
        i.id === itemId ? { ...i, w: newW, h: newH, origW: newW, origH: newH } : i
      ));
    };
    const onUp = () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('touchmove', onMove as EventListener);
      document.removeEventListener('mouseup',   onUp);
      document.removeEventListener('touchend',  onUp);
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('touchmove',  onMove as EventListener, { passive: false });
    document.addEventListener('mouseup',   onUp);
    document.addEventListener('touchend',  onUp);
  }

  // ── Crop handles ──────────────────────────────────────────
  startCropHandle(e: MouseEvent | TouchEvent, itemId: string, side: 'top' | 'bottom' | 'left' | 'right'): void {
    e.preventDefault();
    e.stopPropagation();
    const container = this.sketchContainerRef?.nativeElement;
    if (!container) return;
    const item = this.sketchItems().find(i => i.id === itemId);
    if (!item) return;
    this.activeSketchItemId.set(itemId);

    const rect = container.getBoundingClientRect();
    const cx0 = 'touches' in e ? (e as TouchEvent).touches[0].clientX : (e as MouseEvent).clientX;
    const cy0 = 'touches' in e ? (e as TouchEvent).touches[0].clientY : (e as MouseEvent).clientY;
    const snap = { ...item };
    const MIN = 0.08;

    const onMove = (ev: MouseEvent | TouchEvent) => {
      const cx = 'touches' in ev ? (ev as TouchEvent).touches[0].clientX : (ev as MouseEvent).clientX;
      const cy = 'touches' in ev ? (ev as TouchEvent).touches[0].clientY : (ev as MouseEvent).clientY;
      const dx = (cx - cx0) / rect.width  * 100;
      const dy = (cy - cy0) / rect.height * 100;

      this.sketchItems.update(its => its.map(i => {
        if (i.id !== itemId) return i;
        const { x, y, w, h, cropL, cropR, cropT, cropB, origW, origH } = snap;

if (side === 'left') {
  const delta = dx / origW;
  const newCropL = Math.max(0, Math.min(1 - cropR - MIN, cropL + delta));
  const dC = newCropL - cropL;
  return {
    ...i,
    cropL: newCropL,
    x: x + dC * origW,
    w: w - dC * origW,
  };
}

if (side === 'right') {
  const delta = dx / origW;
  const newCropR = Math.max(0, Math.min(1 - cropL - MIN, cropR - delta));
  const dC = newCropR - cropR;
  return {
    ...i,
    cropR: newCropR,
    w: w - dC * origW,
  };
}
        if (side === 'top') {
          const newCropT = Math.max(0, Math.min(1 - cropB - MIN, cropT + dy / origH));
          const dC = newCropT - cropT;
          return { ...i, y: y + dC * origH, h: h - dC * origH, cropT: newCropT };
        }
        // bottom
        const newCropB = Math.max(0, Math.min(1 - cropT - MIN, cropB - dy / origH));
        const dC = cropB - newCropB;
        return { ...i, h: h + dC * origH, cropB: newCropB };
      }));
    };
    const onUp = () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('touchmove', onMove as EventListener);
      document.removeEventListener('mouseup',  onUp);
      document.removeEventListener('touchend', onUp);
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('touchmove',  onMove as EventListener, { passive: false });
    document.addEventListener('mouseup',  onUp);
    document.addEventListener('touchend', onUp);
  }

  // ── Capture ───────────────────────────────────────────────
  async captureSketch(): Promise<void> {
    const container = this.sketchContainerRef?.nativeElement;
    if (!container) return;
    this.isCapturing.set(true);
    try {
      const cW = container.clientWidth;
      const cH = container.clientHeight;
      const SCALE = 2;
      const canvas = document.createElement('canvas');
      canvas.width  = cW * SCALE;
      canvas.height = cH * SCALE;
      const ctx = canvas.getContext('2d')!;
      ctx.scale(SCALE, SCALE);

      const bgFile = this.sketchBgFile();
      if (bgFile) {
        const bgUrl = URL.createObjectURL(bgFile);
        await new Promise<void>(res => {
          const img = new Image();
          img.onload = () => { ctx.drawImage(img, 0, 0, cW, cH); URL.revokeObjectURL(bgUrl); res(); };
          img.onerror = () => { URL.revokeObjectURL(bgUrl); res(); };
          img.src = bgUrl;
        });
      } else {
        ctx.fillStyle = '#E8E0D4';
        ctx.fillRect(0, 0, cW, cH);
      }

      for (const item of this.sketchItems()) {
        const frameX = (item.x / 100) * cW;
        const frameY = (item.y / 100) * cH;
        const frameW = (item.w / 100) * cW;
        const frameH = (item.h / 100) * cH;
        const cropWFrac = Math.max(0.01, 1 - item.cropL - item.cropR);
        const cropHFrac = Math.max(0.01, 1 - item.cropT - item.cropB);
        const imgFullW  = frameW / cropWFrac;
        const imgFullH  = frameH / cropHFrac;
        const imgOffX   = -(item.cropL / cropWFrac) * frameW;
        const imgOffY   = -(item.cropT / cropHFrac) * frameH;

        await new Promise<void>(res => {
          const img = new Image();
          img.onload = () => {
            ctx.save();
            ctx.translate(frameX + frameW / 2, frameY + frameH / 2);
            ctx.rotate(item.rotation * Math.PI / 180);
            ctx.scale(Math.cos(item.rotY * Math.PI / 180), 1);
            ctx.beginPath();
            ctx.rect(-frameW / 2, -frameH / 2, frameW, frameH);
            ctx.clip();
            ctx.drawImage(img, imgOffX - frameW / 2, imgOffY - frameH / 2, imgFullW, imgFullH);
            ctx.restore();
            res();
          };
          img.onerror = () => res();
          img.src = item.url;
        });
      }

      await new Promise<void>(res => {
        canvas.toBlob(blob => {
          if (blob) this.roomFile.set(new File([blob], 'sketch.jpg', { type: 'image/jpeg' }));
          res();
        }, 'image/jpeg', 0.92);
      });

      // Set required-field defaults so generation can proceed without manual wizard steps
      if (!this.selectedRoomType()) this.selectedRoomType.set('living');
      if (!this.selectedStyle()) this.selectedStyle.set(ROOM_STYLES[0]);

      // Skip remaining steps — jump straight to result and generate
      this.onGenerateAndAdvance();
    } finally {
      this.isCapturing.set(false);
    }
  }

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
    if (!this.auth.token) { this.authModal.open(() => this.onGenerateAndAdvance()); return; }
    this.stepDirection.set('forward');
    this.currentStep.set(this.steps.length - 1);
    this.content?.scrollToTop(300);
    this.onGenerate();
  }

  async onGenerate(): Promise<void> {
    if (!this.canGenerate()) return;
    const style = this.selectedStyle()!;
    const roomType = this.selectedRoomType()!;
    const items = this.furnitureItems();
    const isSketch = this.roomInputMode() === 'sketch';

    this.isGenerating.set(true);
    this.generationResult.set(null);

    try {
      const furnitureFiles = await Promise.all(
        items.map(async (item) => {
          const c = await resizeImage(item.file, 1920, 1920, 0.85);
          return new File([c], item.file.name, { type: c.type });
        })
      );

      const palettePrompt = this._buildColorPalettePrompt();
      const sketchPrompt = isSketch
        ? 'IMPORTANT: This image is a room layout sketch created by the user — it contains furniture items manually placed on top of a room background. Detect all furniture pieces visible in the scene and integrate them naturally into the redesigned interior at their approximate positions. Respect the spatial arrangement and placement the user has composed. Do not remove or reposition the furniture items significantly.'
        : undefined;
      const combinedPrompt = [sketchPrompt, palettePrompt].filter(Boolean).join(' ') || undefined;

      const req: BuildRoomApiRequest = {
        roomImage: this.roomFile() ?? undefined,
        furnitureItems: furnitureFiles,
        roomType,
        styleId: style.id,
        styleName: style.name,
        stylePrompt: style.prompt,
        autoComplete: this.autoComplete(),
        prompt: combinedPrompt,
        userId: this.auth.currentUser?._id || 'anonymous',
        fromSketch: isSketch || undefined,
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
