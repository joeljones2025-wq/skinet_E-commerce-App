import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AccountService } from '../services/accounts.service';
import { map } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const accountService = inject(AccountService);
  const router = inject(Router);

  if (accountService.currentUser()) {
    return true;
  }

  return accountService.getAuthState().pipe(
    map(auth => {
      if (auth.isAuthenticated) {
        return true;
      }

      return router.createUrlTree(['/account/login'], {queryParams: { returnUrl: state.url }
      });
    })
  );
};