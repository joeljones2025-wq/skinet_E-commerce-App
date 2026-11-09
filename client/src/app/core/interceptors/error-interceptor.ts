import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { SnackbarService } from '../services/snackbar';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const snackbar = inject(SnackbarService);

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 0) {
        snackbar.error('Unable to connect to the server. Check your connection and try again.');
      }
      if (err.status === 400) {
        if (err.error.errors) {
          const modalStateErrors = [];
          for (const key in err.error.errors) {
            if (err.error.errors[key]) {
              modalStateErrors.push(err.error.errors[key])
            }
          }
          throw modalStateErrors.flat();
        } else {
          snackbar.error(err.error.title || err.error)
        }
      }
      if (err.status === 401) {
        snackbar.error(err.error.title || err.error)
      }
      if (err.status === 403) {
        snackbar.error('Forbidden');
      }
      if (err.status === 404) {
        snackbar.error('The requested resource was not found.');
      }
      if (err.status === 500) {
        if (req.method === 'GET' && req.url.includes('/cart/')) {
          snackbar.error('Unable to restore your cart. The rest of the site is still available.');
        } else {
          const navigationExtras: NavigationExtras = {state: {error: err.error}};
          router.navigateByUrl('/server-error', navigationExtras);
        }
      }
      return throwError(() => err)
    })
  )
};
