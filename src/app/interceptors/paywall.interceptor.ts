import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { catchError, throwError } from 'rxjs';

export const paywallInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const auth = inject(AuthService);

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 402 && auth.token) {
        const currentUrl = router.url;
        router.navigate(['/tabs/subscription'], {
          state: { from: currentUrl },
        });
      }
      return throwError(() => err);
    }),
  );
};
