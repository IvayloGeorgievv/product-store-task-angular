import { inject } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot} from '@angular/router';
import { CartService } from '../services/cart.service';

export const cartNotEmptyGuard: CanActivateFn = (
  _route: ActivatedRouteSnapshot,
  _state: RouterStateSnapshot
): boolean => {
  const cart: CartService = inject(CartService);
  const router: Router = inject(Router);

  if (cart.totalItems() > 0) {
    return true;
  }

  router.navigate(['/cart']);
  return false;
};
