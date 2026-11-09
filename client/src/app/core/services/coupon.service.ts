import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Cart } from '../../shared/Models/cart.model';

@Injectable({
  providedIn: 'root'
})
export class CouponService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  applyCoupon(cartId: string, code: string) {
    return this.http.post<Cart>(
      `${this.baseUrl}coupons/apply?cartId=${encodeURIComponent(cartId)}`,
      { code }
    );
  }
}
