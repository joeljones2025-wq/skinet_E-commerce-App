import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { RouterLink } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';
import { CurrencyPipe, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CouponService } from '../../../core/services/coupon.service';

@Component({
  imports: [RouterLink, MatButton, MatFormField, MatLabel, MatInput, CurrencyPipe, FormsModule],
  selector: 'app-order-summary',
  styleUrl: './order-summary.css',
  templateUrl: './order-summary.html',
})
export class OrderSummary {
  cartservice = inject(CartService);
  location = inject(Location);
  private couponService = inject(CouponService);
  couponCode = '';
  applyingCoupon = signal(false);
  couponError = signal<string | null>(null);
  couponMessage = signal<string | null>(null);

  applyCoupon() {
    const cart = this.cartservice.cart();
    const code = this.couponCode.trim();
    if (!cart || !code || this.applyingCoupon()) return;

    this.applyingCoupon.set(true);
    this.couponError.set(null);
    this.couponMessage.set(null);

    this.couponService.applyCoupon(cart.id, code).subscribe({
      next: updatedCart => {
        this.cartservice.cart.set(updatedCart);
        this.couponCode = '';
        this.couponMessage.set(`Coupon ${updatedCart.coupon?.promotionCode ?? code} applied.`);
        this.applyingCoupon.set(false);
      },
      error: (error: unknown) => {
        this.couponError.set(this.getErrorMessage(error));
        this.applyingCoupon.set(false);
      }
    });
  }

  private getErrorMessage(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      if (error.status === 0) {
        return 'Could not reach the API. Check that the backend is running, then try again.';
      }

      if (typeof error.error === 'string') return error.error;
      if (typeof error.error?.message === 'string') return error.error.message;
      if (typeof error.error?.title === 'string') return error.error.title;
      if (typeof error.error?.detail === 'string') return error.error.detail;
    }

    return 'Could not apply the coupon. Please try again.';
  }
}
