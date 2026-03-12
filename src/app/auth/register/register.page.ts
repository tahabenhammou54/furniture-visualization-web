import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { I18nService } from '../../services/i18n.service';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { IconComponent } from '../../shared/icon/icon.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, TranslatePipe, IconComponent],
  templateUrl: './register.page.html',
})
export class RegisterPage {
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
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  get nameError(): string | null {
    const ctrl = this.form.get('name');
    if (!ctrl?.touched || !ctrl.errors) return null;
    if (ctrl.errors['required']) return this.i18n.t('auth.name_required');
    if (ctrl.errors['minlength']) return this.i18n.t('auth.name_min');
    return null;
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
    this.auth.register(this.form.value).subscribe({
      next: () => {
        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/tabs/home';
        this.router.navigateByUrl(returnUrl, { replaceUrl: true });
      },
      error: (err) => {
        const msg = err?.error?.message || 'Registration failed. Please try again.';
        this.toast.error(Array.isArray(msg) ? msg[0] : msg);
        this.isLoading.set(false);
      },
    });
  }
}
