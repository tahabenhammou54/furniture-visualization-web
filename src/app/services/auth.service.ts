import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { StorageService } from './storage.service';
import { AuthResponse } from '../models/api-response.model';
import { AuthCredentials, RegisterDto, User } from '../models/user.model';

const TOKEN_KEY = 'auth_token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiUrl = environment.apiUrl;
  private _token: string | null = null;
  private _currentUser$ = new BehaviorSubject<User | null>(null);

  currentUser$ = this._currentUser$.asObservable();
  readonly credits = signal<number | null>(null);
  isAuthenticated$ = this._currentUser$.asObservable().pipe(
    // map to boolean — consumers can use !!user
  );

  constructor(
    private http: HttpClient,
    private router: Router,
    private storage: StorageService
  ) {}

  get token(): string | null {
    return this._token;
  }

  get currentUser(): User | null {
    return this._currentUser$.value;
  }

  async initialize(): Promise<void> {
    const token = await this.storage.get(TOKEN_KEY);
    if (token) {
      this._token = token;
      // Optionally fetch profile here; keep lightweight for startup
      try {
        const user = await this.http
          .get<User>(`${this.apiUrl}/auth/me`)
          .toPromise();
        if (user) this.setUser(user);
      } catch {
        // Token expired or invalid — clear it
        await this.clearSession();
      }
    }
  }

  login(credentials: AuthCredentials): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/auth/login`, credentials)
      .pipe(tap((res) => this.handleAuthResponse(res)));
  }

  register(dto: RegisterDto): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/auth/register`, dto)
      .pipe(tap((res) => this.handleAuthResponse(res)));
  }

  async refreshUser(): Promise<void> {
    try {
      const user = await this.http
        .get<User>(`${this.apiUrl}/auth/me`)
        .toPromise();
      if (user) this.setUser(user);
    } catch {
      // Non-critical — ignore
    }
  }

  /** Redirect the browser to the API's Google OAuth endpoint */
  loginWithGoogle(): void {
    window.location.href = `${this.apiUrl}/auth/google`;
  }

  /** Called by the google-success page after the OAuth redirect */
  async handleGoogleToken(token: string): Promise<void> {
    this._token = token;
    await this.storage.set(TOKEN_KEY, token);
    try {
      const user = await this.http
        .get<User>(`${this.apiUrl}/auth/me`)
        .toPromise();
      if (user) this.setUser(user);
    } catch {
      // Non-critical
    }
  }

  logout(): void {
    this.clearSession().then(() => {
      this.router.navigate(['/auth/login'], { replaceUrl: true });
    });
  }

  private async handleAuthResponse(res: AuthResponse): Promise<void> {
    this._token = res.accessToken;
    await this.storage.set(TOKEN_KEY, res.accessToken);
    // Fetch user profile after auth
    try {
      const user = await this.http
        .get<User>(`${this.apiUrl}/auth/me`)
        .toPromise();
      if (user) this.setUser(user);
    } catch {
      // Profile fetch failed — not critical
    }
  }

  private setUser(user: User | null): void {
    this._currentUser$.next(user);
    this.credits.set(user?.credits ?? null);
  }

  private async clearSession(): Promise<void> {
    this._token = null;
    this.setUser(null);
    await this.storage.remove(TOKEN_KEY);
  }
}
