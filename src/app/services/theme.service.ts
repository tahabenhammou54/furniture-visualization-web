import { Injectable, signal } from '@angular/core';
import { StorageService } from './storage.service';

const THEME_KEY = 'app_theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  isDark = signal<boolean>(false);

  constructor(private storage: StorageService) {}

  initialize(): void {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored !== null) {
      this.applyTheme(stored === 'dark');
    } else {
      this.applyTheme(false);
    }
  }

  toggle(): void {
    this.applyTheme(!this.isDark());
    this.storage.set(THEME_KEY, this.isDark() ? 'dark' : 'light');
  }

  setDark(dark: boolean): void {
    this.applyTheme(dark);
    this.storage.set(THEME_KEY, dark ? 'dark' : 'light');
  }

  private applyTheme(dark: boolean): void {
    this.isDark.set(dark);
    if (dark) {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.removeAttribute('data-theme');
    }
    // Sync Ionic dark palette
    document.body.classList.toggle('ion-palette-dark', dark);
  }
}
