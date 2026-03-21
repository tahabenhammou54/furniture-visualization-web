import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthModalService {
  readonly isOpen = signal(false);

  private _onSuccess?: () => void;

  open(onSuccess?: () => void): void {
    this._onSuccess = onSuccess;
    this.isOpen.set(true);
  }

  close(): void {
    this.isOpen.set(false);
    this._onSuccess = undefined;
  }

  notifySuccess(): void {
    const cb = this._onSuccess;
    this.close();
    cb?.();
  }
}
