import {
  Component,
  computed,
  ElementRef,
  NgZone,
  signal,
  ViewChild,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  sparklesOutline,
  arrowBackOutline,
  flashOutline,
  brushOutline,
  trashOutline,
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

export interface StyleTransferStep { id: string; labelKey: string; required: boolean; }

@Component({
  selector: 'app-style-transfer',
  standalone: true,
  imports: [
    CommonModule, FormsModule, IonContent, IonIcon,
    PhotoPickerComponent, RoomGalleryComponent, ResultActionsComponent, AiLoaderComponent, TranslatePipe,
  ],
  templateUrl: './style-transfer.page.html',
  styleUrls: ['./style-transfer.page.scss'],
})
export class StyleTransferPage implements AfterViewInit, OnDestroy {
  @ViewChild(IonContent, { static: false }) private content!: IonContent;
  @ViewChild('brushCanvas') brushCanvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('roomImgRef') roomImgRef!: ElementRef<HTMLImageElement>;

  readonly steps: StyleTransferStep[] = [
    { id: 'room',    labelKey: 'home.room_space',  required: true  },
    { id: 'mark',    labelKey: 'style.mark',        required: true  },
    { id: 'options', labelKey: 'style.options',     required: true  },
    { id: 'result',  labelKey: 'home.your_viz',     required: false },
  ];

  // ── Wizard state ──────────────────────────────────────────
  currentStep   = signal<number>(0);
  stepDirection = signal<'forward' | 'back'>('forward');

  // ── Form state ────────────────────────────────────────────
  roomInputMode  = signal<RoomInputMode>('gallery');
  roomFile       = signal<File | null>(null);
  selectedRoomId = signal<string | null>(null);
  isFetchingRoom = signal<boolean>(false);

  // ── Canvas / Brush state ──────────────────────────────────
  brushSize   = signal<number>(24);
  hasMask     = signal<boolean>(false);
  isEraser    = signal<boolean>(false);
  canvasReady = signal<boolean>(false);

  private brushCtx!: CanvasRenderingContext2D;
  private maskOffscreen!: HTMLCanvasElement;
  private maskCtx!: CanvasRenderingContext2D;
  private isDrawing = false;
  private lastX = 0;
  private lastY = 0;
  // Cached so buildMaskFile() works even after step 1 leaves the DOM
  private _canvasCssW = 0;
  private _canvasCssH = 0;
  private _imgNatW    = 0;
  private _imgNatH    = 0;

  // ── Options state ─────────────────────────────────────────
  styleDescription = signal<string>('');
  objectFile       = signal<File | null>(null);

  // ── Result ────────────────────────────────────────────────
  isGenerating     = signal<boolean>(false);
  generationResult = signal<GenerateResponse | null>(null);
  sliderPos        = signal<number>(50);

  // ── Computed ─────────────────────────────────────────────
  isResultStep     = computed(() => this.currentStep() === this.steps.length - 1);
  isMarkStep       = computed(() => this.currentStep() === 1);
  isOptionsStep    = computed(() => this.currentStep() === 2);
  isLastWizardStep = computed(() => this.currentStep() === this.steps.length - 2);

  progressPercent = computed(() =>
    (this.currentStep() / (this.steps.length - 1)) * 100
  );

  canGoNext = computed(() => {
    if (this.currentStep() === 0) return this.roomFile() !== null;
    if (this.currentStep() === 1) return this.hasMask();
    return true;
  });

  canGenerate = computed(() => {
    if (!this.hasMask() || !this.roomFile() || this.isGenerating()) return false;
    return this.styleDescription().trim().length > 0 || this.objectFile() !== null;
  });

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
    private router: Router,
    private zone: NgZone,
  ) {
    addIcons({
      sparklesOutline, arrowBackOutline, flashOutline, brushOutline, trashOutline,
      chevronForwardOutline, chevronBackOutline, checkmarkOutline,
    });
  }

  ngAfterViewInit(): void {}

  ngOnDestroy(): void {
    this.removeCanvasListeners();
  }

  // ── Navigation ────────────────────────────────────────────
  goNext(): void {
    if (this.currentStep() < this.steps.length - 1 && this.canGoNext()) {
      this.stepDirection.set('forward');
      this.currentStep.update(s => s + 1);
      this.content?.scrollToTop(300);
      if (this.currentStep() === 1) {
        setTimeout(() => this.initCanvas(), 80);
      }
    }
  }

  goBack(): void {
    if (this.currentStep() > 0) {
      this.stepDirection.set('back');
      this.currentStep.update(s => s - 1);
      this.content?.scrollToTop(300);
    }
  }

  goToStep(i: number): void {
    this.stepDirection.set('back');
    this.currentStep.set(i);
    if (i === 1) setTimeout(() => this.initCanvas(), 80);
  }

  goToStudio(): void { this.router.navigate(['/tabs/home']); }
  goToHistory(): void { this.router.navigate(['/tabs/history']); }

  onNewDesign(): void {
    this.generationResult.set(null);
    this.hasMask.set(false);
    this.styleDescription.set('');
    this.objectFile.set(null);
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

  // ── Room input ────────────────────────────────────────────
  setRoomMode(mode: RoomInputMode): void {
    this.roomInputMode.set(mode);
    this.roomFile.set(null);
    this.selectedRoomId.set(null);
    this.hasMask.set(false);
  }

  onRoomSelected(file: File): void {
    this.roomFile.set(file);
    this.selectedRoomId.set(null);
    this.generationResult.set(null);
    this.hasMask.set(false);
  }
  onRoomRemoved(): void {
    this.roomFile.set(null);
    this.hasMask.set(false);
  }

  async onPresetRoomSelected(room: PresetRoom): Promise<void> {
    this.selectedRoomId.set(room.id);
    this.roomFile.set(null);
    this.hasMask.set(false);
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

  // ── Options ───────────────────────────────────────────────
  onObjectSelected(file: File): void { this.objectFile.set(file); }
  onObjectRemoved(): void { this.objectFile.set(null); }

  // ── Canvas init ───────────────────────────────────────────
  onImageLoad(): void {
    this.initCanvas();
  }

  private initCanvas(): void {
    const canvasEl = this.brushCanvasRef?.nativeElement;
    const imgEl    = this.roomImgRef?.nativeElement;
    if (!canvasEl || !imgEl) return;

    const dpr = window.devicePixelRatio || 1;
    const cssW = imgEl.clientWidth;
    const cssH = imgEl.clientHeight;

    // Cache dimensions so buildMaskFile() works after this step leaves the DOM
    this._canvasCssW = cssW;
    this._canvasCssH = cssH;
    this._imgNatW    = imgEl.naturalWidth;
    this._imgNatH    = imgEl.naturalHeight;

    canvasEl.width  = cssW * dpr;
    canvasEl.height = cssH * dpr;
    canvasEl.style.width  = cssW + 'px';
    canvasEl.style.height = cssH + 'px';

    this.brushCtx = canvasEl.getContext('2d')!;
    this.brushCtx.scale(dpr, dpr);
    this.brushCtx.lineCap  = 'round';
    this.brushCtx.lineJoin = 'round';

    this.maskOffscreen = document.createElement('canvas');
    this.maskOffscreen.width  = cssW * dpr;
    this.maskOffscreen.height = cssH * dpr;
    this.maskCtx = this.maskOffscreen.getContext('2d')!;
    this.maskCtx.scale(dpr, dpr);
    this.maskCtx.lineCap  = 'round';
    this.maskCtx.lineJoin = 'round';

    this.removeCanvasListeners();
    this.addCanvasListeners(canvasEl);
    this.canvasReady.set(true);
  }

  private addCanvasListeners(canvas: HTMLCanvasElement): void {
    canvas.addEventListener('mousedown',  this.onMouseDown,  false);
    canvas.addEventListener('mousemove',  this.onMouseMove,  false);
    canvas.addEventListener('mouseup',    this.onMouseUp,    false);
    canvas.addEventListener('mouseleave', this.onMouseUp,    false);
    canvas.addEventListener('touchstart', this.onTouchStart, { passive: false });
    canvas.addEventListener('touchmove',  this.onTouchMove,  { passive: false });
    canvas.addEventListener('touchend',   this.onMouseUp,    false);
  }

  private removeCanvasListeners(): void {
    const canvasEl = this.brushCanvasRef?.nativeElement;
    if (!canvasEl) return;
    canvasEl.removeEventListener('mousedown',  this.onMouseDown);
    canvasEl.removeEventListener('mousemove',  this.onMouseMove);
    canvasEl.removeEventListener('mouseup',    this.onMouseUp);
    canvasEl.removeEventListener('mouseleave', this.onMouseUp);
    canvasEl.removeEventListener('touchstart', this.onTouchStart);
    canvasEl.removeEventListener('touchmove',  this.onTouchMove);
    canvasEl.removeEventListener('touchend',   this.onMouseUp);
  }

  private onMouseDown = (e: MouseEvent): void => {
    this.isDrawing = true;
    const { x, y } = this.getCanvasPos(e);
    this.lastX = x; this.lastY = y;
    this.paintAt(x, y, x, y);
  };

  private onMouseMove = (e: MouseEvent): void => {
    if (!this.isDrawing) return;
    const { x, y } = this.getCanvasPos(e);
    this.paintAt(this.lastX, this.lastY, x, y);
    this.lastX = x; this.lastY = y;
  };

  private onMouseUp = (): void => { this.isDrawing = false; };

  private onTouchStart = (e: TouchEvent): void => {
    e.preventDefault();
    this.isDrawing = true;
    const { x, y } = this.getTouchCanvasPos(e);
    this.lastX = x; this.lastY = y;
    this.paintAt(x, y, x, y);
  };

  private onTouchMove = (e: TouchEvent): void => {
    e.preventDefault();
    if (!this.isDrawing) return;
    const { x, y } = this.getTouchCanvasPos(e);
    this.paintAt(this.lastX, this.lastY, x, y);
    this.lastX = x; this.lastY = y;
  };

  private getCanvasPos(e: MouseEvent): { x: number; y: number } {
    const rect = this.brushCanvasRef.nativeElement.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  private getTouchCanvasPos(e: TouchEvent): { x: number; y: number } {
    const rect  = this.brushCanvasRef.nativeElement.getBoundingClientRect();
    const touch = e.touches[0];
    return { x: touch.clientX - rect.left, y: touch.clientY - rect.top };
  }

  private paintAt(x1: number, y1: number, x2: number, y2: number): void {
    if (!this.brushCtx || !this.maskCtx) return;
    const size = this.brushSize();

    if (this.isEraser()) {
      this.maskCtx.globalCompositeOperation = 'destination-out';
    } else {
      this.maskCtx.globalCompositeOperation = 'source-over';
      this.maskCtx.strokeStyle = '#9B72CF';
    }
    this.maskCtx.lineWidth = size;
    this.maskCtx.beginPath();
    this.maskCtx.moveTo(x1, y1);
    this.maskCtx.lineTo(x2, y2);
    this.maskCtx.stroke();

    const canvas = this.brushCanvasRef.nativeElement;
    this.brushCtx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    this.brushCtx.globalAlpha = 0.55;
    this.brushCtx.drawImage(this.maskOffscreen, 0, 0, canvas.clientWidth, canvas.clientHeight);
    this.brushCtx.globalAlpha = 1;

    this.zone.run(() => {
      if (!this.isEraser()) this.hasMask.set(true);
      else this.checkHasMask();
    });
  }

  private checkHasMask(): void {
    const canvas = this.brushCanvasRef?.nativeElement;
    if (!canvas) return;
    const data = this.brushCtx.getImageData(0, 0, canvas.width, canvas.height).data;
    for (let i = 3; i < data.length; i += 4) {
      if (data[i] > 0) { this.hasMask.set(true); return; }
    }
    this.hasMask.set(false);
  }

  clearMask(): void {
    const canvas = this.brushCanvasRef?.nativeElement;
    if (!canvas || !this.brushCtx) return;
    this.brushCtx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    if (this.maskCtx) {
      this.maskCtx.globalCompositeOperation = 'source-over';
      this.maskCtx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    }
    this.hasMask.set(false);
  }

  toggleEraser(): void { this.isEraser.update(v => !v); }

  // ── Mask export ───────────────────────────────────────────
  private async buildMaskFile(): Promise<File> {
    const dpr  = window.devicePixelRatio || 1;
    const cssW = this._canvasCssW;
    const cssH = this._canvasCssH;
    const natW = this._imgNatW;
    const natH = this._imgNatH;

    const scale     = Math.min(cssW / natW, cssH / natH);
    const renderedW = natW * scale;
    const renderedH = natH * scale;
    const offsetX = (cssW - renderedW) / 2;
    const offsetY = (cssH - renderedH) / 2;
    const physOffX = offsetX * dpr;
    const physOffY = offsetY * dpr;
    const physW    = renderedW * dpr;
    const physH    = renderedH * dpr;

    const brushData = this.maskCtx.getImageData(0, 0, this.maskOffscreen.width, this.maskOffscreen.height);
    const bw    = document.createElement('canvas');
    bw.width    = this.maskOffscreen.width;
    bw.height   = this.maskOffscreen.height;
    const bwCtx = bw.getContext('2d')!;
    const bwData = bwCtx.getImageData(0, 0, bw.width, bw.height);
    for (let i = 0; i < brushData.data.length; i += 4) {
      if (brushData.data[i + 3] > 0) {
        bwData.data[i] = bwData.data[i + 1] = bwData.data[i + 2] = 255;
      }
      bwData.data[i + 3] = 255;
    }
    bwCtx.putImageData(bwData, 0, 0);

    const maskCanvas  = document.createElement('canvas');
    maskCanvas.width  = natW;
    maskCanvas.height = natH;
    const maskCtx = maskCanvas.getContext('2d')!;
    maskCtx.fillStyle = 'black';
    maskCtx.fillRect(0, 0, natW, natH);
    maskCtx.drawImage(bw, physOffX, physOffY, physW, physH, 0, 0, natW, natH);

    return new Promise<File>((resolve) => {
      maskCanvas.toBlob((blob) => {
        resolve(new File([blob!], 'mask.png', { type: 'image/png' }));
      }, 'image/png');
    });
  }

  // ── Generate ──────────────────────────────────────────────
  async onGenerate(): Promise<void> {
    const room = this.roomFile();
    if (!room || !this.hasMask() || this.isGenerating() || !this.canGenerate()) return;

    this.isGenerating.set(true);
    this.generationResult.set(null);

    try {
      const [compressed, maskFile] = await Promise.all([
        resizeImage(room, 1920, 1920, 0.85).then(blob => new File([blob], room.name, { type: blob.type })),
        this.buildMaskFile(),
      ]);

      this.generation.styleTransfer({
        roomImage:        compressed,
        maskImage:        maskFile,
        styleDescription: this.styleDescription().trim() || undefined,
        objectImage:      this.objectFile() ?? undefined,
        userId:           this.auth.currentUser?._id || 'anonymous',
      }).subscribe({
        next: (res) => {
          this.generationResult.set(res);
          this.sliderPos.set(50);
          this.isGenerating.set(false);
          this.toast.success('Replace complete!');
        },
        error: (err) => {
          console.log("🚀 ~ StyleTransferPage ~ onGenerate ~ err:", err)
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

  onRegenerate(): void {
    this.generationResult.set(null);
    this.onGenerate();
  }

  startSliderDrag(e: MouseEvent | TouchEvent, el: HTMLElement): void {
    e.preventDefault();
    this.updateSlider(e, el);
    const onMove = (ev: MouseEvent | TouchEvent) => { ev.preventDefault(); this.updateSlider(ev, el); };
    const onUp = () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchend', onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('touchmove', onMove, { passive: false });
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchend', onUp);
  }

  private updateSlider(e: MouseEvent | TouchEvent, el: HTMLElement): void {
    const rect = el.getBoundingClientRect();
    const clientX = 'touches' in e ? (e as TouchEvent).touches[0].clientX : (e as MouseEvent).clientX;
    const pos = ((clientX - rect.left) / rect.width) * 100;
    this.sliderPos.set(Math.min(100, Math.max(0, pos)));
  }
}
