import { inject } from '@angular/core/primitives/di';
import { CanActivateFn, Router } from '@angular/router';
import { AccountService } from '../services/accounts.service';
import { SnackbarService } from '../services/snackbar';

export const adminGuard: CanActivateFn = (route, state) => {
  const accountService = inject(AccountService);
  const router = inject(Router);
  const snack = inject(SnackbarService);
  
  if (accountService.isAdmin()) {
    return true;
  } else {
    snack.error('You do not have permission to access this page.');
    router.navigateByUrl('/shop');
    return false;
  }
};
