import { computed, inject, Injectable, signal } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Cart } from "../../shared/Models/cart.model";
import { firstValueFrom, map, tap } from "rxjs";
import { CartItem } from "../../shared/Models/cart.model";
import { Product } from "../../shared/Models/Product";
import { DeliveryMethod } from "../../shared/Models/DeliveryMethod";

@Injectable({
  providedIn: 'root'
})
export class CartService {
  getUserInfo() {
    throw new Error('Method not implemented.');
  }
  baseUrl = environment.apiUrl;
  private http = inject(HttpClient);
  cart = signal<Cart | null>(null);
  itemcount = computed(() => {
    return this.cart()?.items.reduce((sum,item) => sum + item.quantity, 0) ?? 0;
  })
  SelectedDelivery = signal<DeliveryMethod | null>(null);

  totals = computed(() => {
    const cart = this.cart();
    const delivery = this.SelectedDelivery();
    if (!cart) return null;

    const subtotal = cart.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    const shipping = delivery ? delivery.price: 0;
    const coupon = cart.coupon;
    const discount = coupon?.amountOff != null
      ? Math.min(subtotal, coupon.amountOff / 100)
      : coupon?.percentOff != null
        ? subtotal * coupon.percentOff / 100
        : 0;

    return {
        subtotal,
        shipping,
        discount,
        total: subtotal + shipping - discount
    };
});

  getCart(id: string) {
    return this.http.get<Cart>(`${this.baseUrl}cart/${encodeURIComponent(id)}`).pipe(
      tap(cart => this.cart.set(cart))
    );
  }

  setCart(cart: Cart) {
    return this.http.post<Cart>(this.baseUrl + 'cart', cart).pipe(
      tap(updatedCart => this.cart.set(updatedCart))
    );
  }

  public async addItemToCart(item: CartItem | Product, quantity = 1): Promise<void> {
    const cart = this.cart() ?? this.createCart();
    if (this.isProduct(item)) {
      item = this.mapProductToCartItem(item);
    }
    cart.items = this.addOrUpdateItem(cart.items, item, quantity);
    await firstValueFrom(this.setCart(cart));
  }

  async removeItemFromCart(productId: number, quantity = 1) {
    const cart = this.cart();
    if (!cart) return;
    const index = cart.items.findIndex(i => i.productId === productId);
    if (index !== -1) {
      if (cart.items[index].quantity > quantity) {
        cart.items[index].quantity -= quantity;
      } else {
        cart.items.splice(index, 1);
      }
      if (cart.items.length === 0) {
        this.deleteCart();
      } else {
        await firstValueFrom(this.setCart(cart));
      }
    }
  }

  deleteCart() {
    const cartId = this.cart()?.id;
    if (!cartId) return;

    this.http.delete(`${this.baseUrl}cart/${encodeURIComponent(cartId)}`).subscribe({
      next: () => {
        localStorage.removeItem('cart_id');
        this.cart.set(null);
      }
    });
  }

  private addOrUpdateItem(items: CartItem[], item: CartItem, quantity: number) {
    const index = items.findIndex(i => i.productId === item.productId);
    if (index === -1) {
      item.quantity = quantity;
      items.push(item);
    } else {
      items[index].quantity += quantity;
    }
    return items;
  }

  private mapProductToCartItem(product: Product): CartItem {
    return {
      productId: product.id,
      productName: product.name,
      price: product.price,
      quantity: 0,
      pictureUrl: product.pictureUrl,
      brand: product.brand,
      type: product.type
    };
  }

  private isProduct(item: CartItem | Product): item is Product {
    return (item as Product).id !== undefined;
  }

  private createCart() {
    const cart = new Cart();
    localStorage.setItem('cart_id', String(cart.id));
    return cart;
  }
}
