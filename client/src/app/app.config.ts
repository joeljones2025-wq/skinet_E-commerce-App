import { ApplicationConfig, inject, provideAppInitializer, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import "zone.js";
import { MAT_DIALOG_DATA, MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { errorInterceptor } from './core/interceptors/error-interceptor';
import { loadingInterceptor } from './core/interceptors/loading-interceptor';
import { catchError, finalize, of } from 'rxjs';
import { InitService } from './core/services/init.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideZoneChangeDetection(),
    provideHttpClient(withInterceptors([loadingInterceptor, errorInterceptor])),
    provideAppInitializer(() => {
      const initService = inject(InitService);
      return initService.init().pipe(
        catchError((error: unknown) => {
          console.error('Unable to restore the shopping cart during startup.', error);
          return of(null);
        }),
        finalize(() => {
          document.getElementById('initial-splash')?.remove();
        })
      );
    }),
  ]
};
