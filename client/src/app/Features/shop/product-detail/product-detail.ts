import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ShopService } from '../../../core/services/shop.service';
import { CartService } from '../../../core/services/cart.service';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../../../shared/Models/Product';
import { EMPTY, catchError, switchMap } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatDivider } from '@angular/material/divider';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';

@Component({
  standalone: true,
  imports: [CurrencyPipe, FormsModule, MatButton, MatDivider, MatFormField, MatIcon, MatInput, MatLabel],
  selector: 'app-product-detail',
  styleUrl: './product-detail.css',
  templateUrl: './product-detail.html',
})
export class ProductDetail implements OnInit {
  private shopService = inject(ShopService);
  private cartService = inject(CartService);
  private activatedRoute = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);

  product = signal<Product | undefined>(undefined);
  loading = signal(true);
  loadError = signal<string | null>(null);
  quantity = 1;
  quantityInCart = 0;
  updatingCart = false;

  ngOnInit(): void {
    this.activatedRoute.paramMap.pipe(
      switchMap(params => {
        const id = Number(params.get('id'));
        this.product.set(undefined);
        this.loadError.set(null);
        this.loading.set(true);
        this.quantity = 1;
        this.quantityInCart = 0;

        if (!Number.isInteger(id) || id < 1) {
          this.loading.set(false);
          this.loadError.set('Product not found.');
          return EMPTY;
        }

        return this.shopService.getProduct(id).pipe(
          catchError(error => {
            console.error('Failed to load product details.', error);
            this.loading.set(false);
            this.loadError.set('Could not load product details. Check that the API and database are running, then try again.');
            return EMPTY;
          })
        );
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(product => {
      this.product.set(product);
      this.quantityInCart = this.cartService.cart()?.items
        .find(item => item.productId === product.id)?.quantity ?? 0;
      this.quantity = Math.max(this.quantityInCart, 1);
      this.loading.set(false);
    });
  }

  getButtonText(): string {
    return this.quantityInCart > 0 ? 'Update cart' : 'Add to cart';
  }

  isValidQuantity(): boolean {
    return Number.isInteger(this.quantity) && this.quantity >= 1;
  }

  async updateCart(): Promise<void> {
    const product = this.product();
    if (!product || !this.isValidQuantity() || this.quantity === this.quantityInCart || this.updatingCart) {
      return;
    }

    const targetQuantity = this.quantity;
    const quantityDifference = targetQuantity - this.quantityInCart;
    this.updatingCart = true;

    try {
      if (quantityDifference > 0) {
        await this.cartService.addItemToCart(product, quantityDifference);
      } else {
        await this.cartService.removeItemFromCart(product.id, -quantityDifference);
      }
      this.quantityInCart = targetQuantity;
    } catch (error) {
      console.error('Failed to update the cart from product details.', error);
    } finally {
      this.updatingCart = false;
    }
  }
}
