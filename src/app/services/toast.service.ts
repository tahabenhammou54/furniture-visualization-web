import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular/standalone';

@Injectable({ providedIn: 'root' })
export class ToastService {
  constructor(private toastCtrl: ToastController) {}

  async show(
    message: string,
    color: 'success' | 'danger' | 'warning' | 'primary' = 'success',
    duration = 2500
  ): Promise<void> {
    const toast = await this.toastCtrl.create({
      message,
      duration,
      position: 'top',
      color,
      cssClass: 'custom-toast',
      buttons: [{ icon: 'close', role: 'cancel' }],
    });
    await toast.present();
  }

  async success(message: string): Promise<void> {
    return this.show(message, 'success');
  }

  async error(message: string): Promise<void> {
    return this.show(message, 'danger');
  }

  async warning(message: string): Promise<void> {
    return this.show(message, 'warning');
  }
}
