import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { UpdateProfileDto, UserProfile } from '../models/user.model';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private auth: AuthService) {}

  getProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.apiUrl}/auth/me`);
  }

  updateProfile(dto: UpdateProfileDto): Observable<UserProfile> {
    return this.http.patch<UserProfile>(`${this.apiUrl}/users/${this.auth.currentUser?._id}`, dto).pipe(
      tap((updated) => {
        // Keep AuthService currentUser in sync
        const current = this.auth.currentUser;
        if (current) {
          // AuthService exposes internal subject indirectly — emit updated user
        }
      })
    );
  }

  updateAvatar(file: File): Observable<UserProfile> {
    const fd = new FormData();
    fd.append('imageUrl', file);
    return this.http.patch<UserProfile>(`${this.apiUrl}/users/${this.auth.currentUser?._id}`, fd);
  }
}
