import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { IonContent, IonIcon, IonSpinner } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { eyeOutline, eyeOffOutline, mailOutline, lockClosedOutline, keyOutline } from 'ionicons/icons';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

type Step = 'email' | 'pin' | 'password';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, IonContent, IonIcon, IonSpinner],
  templateUrl: './forgot-password.page.html',
})
export class ForgotPasswordPage {
  step = signal<Step>('email');
  isLoading = signal(false);
  showPassword = signal(false);
  showConfirmPassword = signal(false);

  emailForm: FormGroup;
  pinForm: FormGroup;
  passwordForm: FormGroup;

  private email = '';
  private pin = '';

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private toast: ToastService,
  ) {
    addIcons({ eyeOutline, eyeOffOutline, mailOutline, lockClosedOutline, keyOutline });

    this.emailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });

    this.pinForm = this.fb.group({
      pin: ['', [Validators.required, Validators.minLength(4)]],
    });

    this.passwordForm = this.fb.group(
      {
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: this.passwordsMatch },
    );
  }

  private passwordsMatch(group: FormGroup) {
    const pw = group.get('password')?.value;
    const cpw = group.get('confirmPassword')?.value;
    return pw === cpw ? null : { mismatch: true };
  }

  get emailError(): string | null {
    const ctrl = this.emailForm.get('email');
    if (!ctrl?.touched || !ctrl.errors) return null;
    if (ctrl.errors['required']) return 'Email is required';
    if (ctrl.errors['email']) return 'Enter a valid email';
    return null;
  }

  get pinError(): string | null {
    const ctrl = this.pinForm.get('pin');
    if (!ctrl?.touched || !ctrl.errors) return null;
    if (ctrl.errors['required']) return 'PIN is required';
    if (ctrl.errors['minlength']) return 'Enter the full PIN';
    return null;
  }

  get passwordError(): string | null {
    const ctrl = this.passwordForm.get('password');
    if (!ctrl?.touched || !ctrl.errors) return null;
    if (ctrl.errors['required']) return 'Password is required';
    if (ctrl.errors['minlength']) return 'Password must be at least 6 characters';
    return null;
  }

  get confirmPasswordError(): string | null {
    const ctrl = this.passwordForm.get('confirmPassword');
    if (!ctrl?.touched) return null;
    if (ctrl.errors?.['required']) return 'Please confirm your password';
    if (this.passwordForm.errors?.['mismatch']) return 'Passwords do not match';
    return null;
  }

  submitEmail(): void {
    this.emailForm.markAllAsTouched();
    if (this.emailForm.invalid || this.isLoading()) return;

    this.isLoading.set(true);
    this.email = this.emailForm.value.email;

    this.auth.forgotPassword(this.email).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.toast.success('PIN sent to your email');
        this.step.set('pin');
      },
      error: (err) => {
        console.log("🚀 ~ ForgotPasswordPage ~ submitEmail ~ err:", err)
        const msg: string = err?.error?.text || 'Failed to send PIN. Please try again.';
        console.log("msg",msg);
        if (msg.toLowerCase().includes('pin already sent')) {
          this.isLoading.set(false);
          this.step.set('pin');
          return;
        }
        this.toast.error(msg);
        this.isLoading.set(false);
      },
    });
  }

  submitPin(): void {
    this.pinForm.markAllAsTouched();
    if (this.pinForm.invalid || this.isLoading()) return;

    this.isLoading.set(true);
    this.pin = this.pinForm.value.pin;

    this.auth.verifyPin(this.email, this.pin).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.step.set('password');
      },
      error: (err) => {
        const msg = err?.error?.message || 'Invalid PIN';
        this.toast.error(Array.isArray(msg) ? msg[0] : msg);
        this.isLoading.set(false);
      },
    });
  }

  submitPassword(): void {
    this.passwordForm.markAllAsTouched();
    if (this.passwordForm.invalid || this.isLoading()) return;

    this.isLoading.set(true);

    this.auth.resetPasswordWithPin(this.email, this.pin, this.passwordForm.value.password).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.toast.success('Password updated successfully');
        this.router.navigate(['/auth/login'], { replaceUrl: true });
      },
      error: (err) => {
        console.log("🚀 ~ ForgotPasswordPage ~ submitPassword ~ err:", err)
        const msg = err?.error?.message || 'Failed to reset password';
        this.toast.error(Array.isArray(msg) ? msg[0] : msg);
        this.isLoading.set(false);
      },
    });
  }

  goBack(): void {
    if (this.step() === 'pin') this.step.set('email');
    else if (this.step() === 'password') this.step.set('pin');
    else this.router.navigate(['/auth/login']);
  }
}
