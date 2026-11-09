import { CurrencyPipe } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardActions, MatCardContent } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { Product } from '../../../shared/Models/Product';
import { CartService } from '../../../core/services/cart.service';

@Component({
  imports: [CurrencyPipe, MatButton, MatCard, MatCardActions, MatCardContent, MatIcon, RouterLink],
  selector: 'app-product-item',
  standalone: true,
  styleUrl: './product-item.css',
  templateUrl: './product-item.html',
})
export class ProductItem {
  @Input({ required: true }) product!: Product;
  readonly cartService: CartService = inject(CartService);
}
