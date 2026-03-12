import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ThemeService } from '../services/theme.service';
import { StorageService } from '../services/storage.service';
import { I18nService, Language } from '../services/i18n.service';
import { AuthService } from '../services/auth.service';
import { TranslatePipe } from '../pipes/translate.pipe';
import { IconComponent } from '../shared/icon/icon.component';

type ImageQuality = 'low' | 'medium' | 'high';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslatePipe, IconComponent],
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  imageQuality = signal<ImageQuality>('high');
  notificationsEnabled = signal<boolean>(true);

  showReportModal = signal(false);
  reportName = '';
  reportEmail = '';
  reportMessage = '';
  reportStatus = signal<'idle' | 'sending' | 'success' | 'error'>('idle');

  readonly appVersion = '1.0.0';

  readonly languages = [
    { code: 'en', label: 'English' },
    { code: 'fr', label: 'Français' },
    { code: 'ar', label: 'العربية' },
  ];

  get currentLang(): Language {
    return this.i18n.currentLang();
  }

  constructor(
    public theme: ThemeService,
    private storage: StorageService,
    public i18n: I18nService,
    public auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.storage.get('image_quality').then((q) => {
      if (q) this.imageQuality.set(q as ImageQuality);
    });
    this.storage.get('notifications').then((n) => {
      if (n !== null) this.notificationsEnabled.set(n === 'true');
    });
  }

  openPrivacy(): void {
    this.router.navigate(['/tabs/privacy']);
  }

  goToLogin(): void {
    this.router.navigate(['/auth/login'], { queryParams: { returnUrl: '/tabs/settings' } });
  }

  goToRegister(): void {
    this.router.navigate(['/auth/register'], { queryParams: { returnUrl: '/tabs/settings' } });
  }

  toggleDarkMode(): void {
    this.theme.setDark(!this.theme.isDark());
  }

  onQualityChange(quality: ImageQuality): void {
    this.imageQuality.set(quality);
    this.storage.set('image_quality', quality);
  }

  toggleNotifications(): void {
    const enabled = !this.notificationsEnabled();
    this.notificationsEnabled.set(enabled);
    this.storage.set('notifications', String(enabled));
  }

  setLanguage(lang: Language): void {
    this.i18n.setLanguage(lang);
  }

  openReportModal(): void {
    this.reportName = '';
    this.reportEmail = '';
    this.reportMessage = '';
    this.reportStatus.set('idle');
    this.showReportModal.set(true);
  }

  closeReportModal(): void {
    this.showReportModal.set(false);
  }

  async submitReport(): Promise<void> {
    if (!this.reportName || !this.reportEmail || !this.reportMessage) return;
    this.reportStatus.set('sending');
    try {
      const formData = new FormData();
      formData.append('access_key', 'e592f48c-fc32-4bda-aac9-5e8ec9ea571a');
      formData.append('name', this.reportName);
      formData.append('email', this.reportEmail);
      formData.append('message', this.reportMessage);
      formData.append('subject', 'App Report / Feedback');
      const res = await fetch('https://api.web3forms.com/submit', { method: 'POST', body: formData });
      const data = await res.json();
      this.reportStatus.set(data.success ? 'success' : 'error');
    } catch {
      this.reportStatus.set('error');
    }
  }
}
