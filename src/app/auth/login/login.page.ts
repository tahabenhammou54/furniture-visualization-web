import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Router, ActivatedRoute } from '@angular/router';
import { IonContent, IonIcon, IonSpinner } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { eyeOutline, eyeOffOutline, mailOutline, lockClosedOutline } from 'ionicons/icons';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { I18nService } from '../../services/i18n.service';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, IonContent, IonIcon, IonSpinner, TranslatePipe],
  templateUrl: './login.page.html',
})
export class LoginPage {
  form: FormGroup;
  isLoading = signal(false);
  showPassword = signal(false);

  constructor(
    private fb: FormBuilder,
    public auth: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private toast: ToastService,
    private i18n: I18nService
  ) {
    addIcons({ eyeOutline, eyeOffOutline, mailOutline, lockClosedOutline });

    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  get emailError(): string | null {
    const ctrl = this.form.get('email');
    if (!ctrl?.touched || !ctrl.errors) return null;
    if (ctrl.errors['required']) return this.i18n.t('auth.email_required');
    if (ctrl.errors['email']) return this.i18n.t('auth.email_invalid');
    return null;
  }

  get passwordError(): string | null {
    const ctrl = this.form.get('password');
    if (!ctrl?.touched || !ctrl.errors) return null;
    if (ctrl.errors['required']) return this.i18n.t('auth.password_required');
    if (ctrl.errors['minlength']) return this.i18n.t('auth.password_min');
    return null;
  }

  onSubmit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid || this.isLoading()) return;

    this.isLoading.set(true);
    this.auth.login(this.form.value).subscribe({
      next: () => {
        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/tabs/home';
        this.router.navigateByUrl(returnUrl, { replaceUrl: true });
      },
      error: (err) => {
        const msg = err?.error?.message || 'Invalid email or password';
        this.toast.error(Array.isArray(msg) ? msg[0] : msg);
        this.isLoading.set(false);
      },
    });
  }
}
