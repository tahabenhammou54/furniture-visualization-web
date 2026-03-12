import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonContent,
  IonIcon,
  IonSpinner,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { personCircleOutline, createOutline, logOutOutline, cameraOutline, checkmarkOutline, flashOutline } from 'ionicons/icons';
import { ProfileService } from '../services/profile.service';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';
import { UserProfile } from '../models/user.model';
import { SkeletonLoaderComponent } from '../components/skeleton-loader/skeleton-loader.component';
import { TranslatePipe } from '../pipes/translate.pipe';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonContent,
    IonIcon,
    IonSpinner,
    SkeletonLoaderComponent,
    TranslatePipe,
  ],
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  profile = signal<UserProfile | null>(null);
  isLoading = signal<boolean>(false);
  isEditing = signal<boolean>(false);
  isSaving = signal<boolean>(false);
  editForm: FormGroup;

  constructor(
    private profileService: ProfileService,
    public auth: AuthService,
    private toast: ToastService,
    private fb: FormBuilder,
    private router: Router
  ) {
    addIcons({ personCircleOutline, createOutline, logOutOutline, cameraOutline, checkmarkOutline, flashOutline });

    this.editForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
    });
  }

  ngOnInit(): void {
    if (!this.auth.token) return;
    this.loadProfile();
  }

  get subscriptionPlanKey(): string {
    const plan = this.profile()?.subscription ?? 'free';
    return `sub.${plan}.name`;
  }

  get subscriptionExpiry(): string | null {
    const plan = this.profile()?.subscription;
    if (!plan || plan === 'free' || plan === 'lifetime') return null;
    const exp = this.profile()?.subscriptionExpiresAt;
    if (!exp) return null;
    return new Date(exp).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  }

  get userInitials(): string {
    const name = this.profile()?.name || '';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  loadProfile(): void {
    this.isLoading.set(true);
    this.profileService.getProfile().subscribe({
      next: (p) => {
        this.profile.set(p);
        this.editForm.patchValue({ name: p.name });
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      },
    });
  }

  startEditing(): void {
    this.editForm.patchValue({ name: this.profile()?.name });
    this.isEditing.set(true);
  }

  cancelEditing(): void {
    this.isEditing.set(false);
  }

  saveProfile(): void {
    if (this.editForm.invalid || this.isSaving()) return;

    this.isSaving.set(true);
    this.profileService.updateProfile(this.editForm.value).subscribe({
      next: (updated) => {
        this.profile.set(updated);
        this.isEditing.set(false);
        this.isSaving.set(false);
        this.toast.success('Profile updated!');
      },
      error: () => {
        this.toast.error('Failed to update profile');
        this.isSaving.set(false);
      },
    });
  }

  logout(): void {
    this.auth.logout();
  }

  goToLogin(): void {
    this.router.navigate(['/auth/login'], { queryParams: { returnUrl: '/tabs/profile' } });
  }

  goToRegister(): void {
    this.router.navigate(['/auth/register'], { queryParams: { returnUrl: '/tabs/profile' } });
  }
}
