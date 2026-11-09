import { Component, inject } from '@angular/core';
import { CartService } from '../../core/services/cart.service';
import { CartItems } from './cart-items/cart-items';
import { OrderSummary } from '../../shared/component/order-summary/order-summary';
import { EmptyState } from '../../shared/component/empty-state/empty-state';
import { Router } from '@angular/router';

@Component({
  imports: [CartItems, OrderSummary, EmptyState],
  standalone: true,
  selector: 'app-cart',
  styleUrl: './cart.css',
  templateUrl: './cart.html',
})
export class Cart {
  private router = inject(Router);
  readonly cartService = inject(CartService);


  onAction() {
    this.router.navigateByUrl('/shop');
  }
}
