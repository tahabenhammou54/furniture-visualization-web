import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
import { PromoPopupService } from './promo-popup.service';
import {
  GenerateRequest,
  GenerateResponse,
  GenerationItem,
  BuildRoomApiRequest,
  CleanupRequest,
  StyleTransferRequest,
} from '../models/generation.model';
import { SurfaceEditRequest } from '../models/build-room.model';

@Injectable({ providedIn: 'root' })
export class GenerationService {
  private readonly apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private auth: AuthService,
    private promo: PromoPopupService,
  ) {}

  private refreshCredits<T>() {
    return tap<T>(() => {
      this.auth.refreshUser();
      this.promo.notifyGeneration();
    });
  }

  generate(req: GenerateRequest): Observable<GenerateResponse> {
    console.log("🚀 ~ GenerationService ~ generate ~ req:", req)
    const fd = new FormData();
    fd.append('userId', req.userId);
    fd.append('furniture', req.furnitureImage);
    if (req.roomImage) fd.append('room', req.roomImage);
    if (req.prompt) fd.append('prompt', req.prompt);
    // Do NOT set Content-Type manually — browser sets multipart boundary automatically
    return this.http.post<GenerateResponse>(`${this.apiUrl}/visualize/generate`, fd).pipe(this.refreshCredits());
  }

  buildRoom(req: BuildRoomApiRequest): Observable<GenerateResponse> {
    const fd = new FormData();
    fd.append('userId', req.userId);
    fd.append('roomType', req.roomType);
    fd.append('styleId', req.styleId);
    fd.append('styleName', req.styleName);
    fd.append('stylePrompt', req.stylePrompt);
    fd.append('autoComplete', String(req.autoComplete));
    if (req.roomImage) fd.append('room', req.roomImage);
    if (req.prompt) fd.append('prompt', req.prompt);
    req.furnitureItems.forEach((file) => fd.append('furnitureItems', file));
    return this.http.post<GenerateResponse>(`${this.apiUrl}/visualize/build-room`, fd).pipe(this.refreshCredits());
  }

  cleanup(req: CleanupRequest): Observable<GenerateResponse> {
    const fd = new FormData();
    fd.append('userId', req.userId);
    fd.append('room', req.roomImage);
    fd.append('mask', req.maskImage);
    return this.http.post<GenerateResponse>(`${this.apiUrl}/visualize/cleanup`, fd).pipe(this.refreshCredits());
  }

  styleTransfer(req: StyleTransferRequest): Observable<GenerateResponse> {
    const fd = new FormData();
    fd.append('userId', req.userId);
    fd.append('room', req.roomImage);
    fd.append('mask', req.maskImage);
    if (req.styleDescription) fd.append('styleDescription', req.styleDescription);
    if (req.objectImage) fd.append('objectImage', req.objectImage);
    return this.http.post<GenerateResponse>(`${this.apiUrl}/visualize/style-transfer`, fd).pipe(this.refreshCredits());
  }

  getHistory(page = 0, limit = 20): Observable<{ items: GenerationItem[]; hasMore: boolean }> {
    return this.http.get<any>(`${this.apiUrl}/history?page=${page}&limit=${limit}`).pipe(
      map((res) => {
        const items: GenerationItem[] = Array.isArray(res)
          ? res
          : (res?.data ?? res?.items ?? res?.generations ?? []);
        const total: number | null = res?.total ?? res?.count ?? null;
        const hasMore = total != null ? page * limit < total : items.length >= limit;
        return { items, hasMore };
      })
    );
  }

  getById(id: string): Observable<GenerationItem> {
    return this.http.get<GenerationItem>(`${this.apiUrl}/history/${id}`);
  }

  surfaceEdit(req: SurfaceEditRequest): Observable<GenerateResponse> {
    const fd = new FormData();
    fd.append('userId', req.userId);
    fd.append('room', req.roomImage);
    fd.append('type', req.type);
    fd.append('styleId', req.styleId);
    fd.append('styleName', req.styleName);
    fd.append('stylePrompt', req.stylePrompt);
    if (req.customStyle) fd.append('customStyle', req.customStyle);
    if (req.palettePrompt) fd.append('palettePrompt', req.palettePrompt);
    return this.http.post<GenerateResponse>(`${this.apiUrl}/visualize/surface-edit`, fd).pipe(this.refreshCredits());
  }

  deleteGeneration(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/history/${id}`);
  }
}
