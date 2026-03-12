import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-2 w-full max-w-sm px-4 pointer-events-none">
      @for (toast of toastSvc.toasts(); track toast.id) {
        <div
          class="pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl text-sm font-medium text-white animate-slide-down"
          [class.bg-emerald-500]="toast.type === 'success'"
          [class.bg-red-500]="toast.type === 'error'"
          [class.bg-amber-500]="toast.type === 'warning'"
        >
          <span class="flex-1">{{ toast.message }}</span>
          <button type="button" class="shrink-0 opacity-70 hover:opacity-100" (click)="toastSvc.dismiss(toast.id)">✕</button>
        </div>
      }
    </div>
  `,
})
export class ToastContainerComponent {
  toastSvc = inject(ToastService);
}
