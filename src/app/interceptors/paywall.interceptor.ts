import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { DOCUMENT } from '@angular/common';
import { catchError, throwError } from 'rxjs';

export const paywallInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const doc = inject(DOCUMENT);

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 402 && auth.token) {
        doc.defaultView!.location.href = '/tabs/subscription';
      }
      return throwError(() => err);
    }),
  );
};
