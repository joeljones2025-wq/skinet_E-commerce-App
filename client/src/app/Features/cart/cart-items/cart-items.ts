import { Component, inject, input } from '@angular/core';
import { CartItem } from '../../../shared/Models/cart.model';
import { RouterLink } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { CurrencyPipe } from '@angular/common';
import { CartService } from '../../../core/services/cart.service';

@Component({
  imports: [RouterLink,MatIcon,CurrencyPipe],
  selector: 'app-cart-item',
  styleUrl: './cart-items.css',
  templateUrl: './cart-items.html',
})
export class CartItems {
  item = input.required<CartItem>();
  cartservice = inject(CartService)
incrementQuantity() {
    this.cartservice.addItemToCart(this.item());
  }

  decrementQuantity() {
    this.cartservice.removeItemFromCart(this.item().productId, 1);
  }

  removeItemFromCart() {
    this.cartservice.removeItemFromCart(this.item().productId, this.item().quantity);
}
}
