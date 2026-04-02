import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonIcon, IonSpinner } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  eyeOutline, eyeOffOutline, mailOutline, lockClosedOutline,
  personOutline, closeOutline,
} from 'ionicons/icons';
import { AuthService } from '../../services/auth.service';
import { AuthModalService } from '../../services/auth-modal.service';
import { ToastService } from '../../services/toast.service';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { I18nService } from '../../services/i18n.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-auth-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,RouterLink, IonIcon, IonSpinner, TranslatePipe],
  templateUrl: './auth-modal.component.html',
})
export class AuthModalComponent {
  activeTab = signal<'login' | 'register'>('login');
  showPassword = signal(false);
  isLoading = signal(false);

  loginForm: FormGroup;
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    public authModal: AuthModalService,
    private toast: ToastService,
    private i18n: I18nService,
  ) {
    addIcons({ eyeOutline, eyeOffOutline, mailOutline, lockClosedOutline, personOutline, closeOutline });

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  switchTab(tab: 'login' | 'register'): void {
    this.activeTab.set(tab);
    this.showPassword.set(false);
    this.loginForm.reset();
    this.registerForm.reset();
  }

  onLogin(): void {
    this.loginForm.markAllAsTouched();
    if (this.loginForm.invalid || this.isLoading()) return;
    this.isLoading.set(true);
    this.auth.login(this.loginForm.value).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.authModal.notifySuccess();
      },
      error: (err) => {
        const msg = err?.error?.message || 'Invalid email or password';
        this.toast.error(Array.isArray(msg) ? msg[0] : msg);
        this.isLoading.set(false);
      },
    });
  }

  onRegister(): void {
    this.registerForm.markAllAsTouched();
    if (this.registerForm.invalid || this.isLoading()) return;
    this.isLoading.set(true);
    this.auth.register(this.registerForm.value).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.authModal.notifySuccess();
      },
      error: (err) => {
        const msg = err?.error?.message || 'Registration failed. Please try again.';
        this.toast.error(Array.isArray(msg) ? msg[0] : msg);
        this.isLoading.set(false);
      },
    });
  }

  onGoogleLogin(): void {
    this.auth.loginWithGooglePopup(() => this.authModal.notifySuccess());
  }

  fieldError(form: FormGroup, field: string): string | null {
    const ctrl = form.get(field);
    if (!ctrl?.touched || !ctrl.errors) return null;
    if (ctrl.errors['required']) {
      if (field === 'name') return this.i18n.t('auth.name_required');
      if (field === 'email') return this.i18n.t('auth.email_required');
      return this.i18n.t('auth.password_required');
    }
    if (ctrl.errors['email']) return this.i18n.t('auth.email_invalid');
    if (ctrl.errors['minlength']) {
      if (field === 'name') return this.i18n.t('auth.name_min');
      return this.i18n.t('auth.password_min');
    }
    return null;
  }
}
