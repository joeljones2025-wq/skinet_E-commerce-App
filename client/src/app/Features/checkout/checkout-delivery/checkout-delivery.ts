import { Component, inject, OnInit, output, signal } from '@angular/core';
import { Checkout } from '../../../core/services/checkout.service';
import { MatRadioModule } from '@angular/material/radio';
import { CurrencyPipe } from '@angular/common';
import { CartService } from '../../../core/services/cart.service';
import { DeliveryMethod } from '../../../shared/Models/DeliveryMethod';
import { firstValueFrom } from 'rxjs';

@Component({
  imports: [MatRadioModule, CurrencyPipe],
  selector: 'app-checkout-delivery',
  styleUrl: './checkout-delivery.css',
  templateUrl: './checkout-delivery.html',
})
export class CheckoutDelivery implements OnInit {
  checkoutService = inject(Checkout);
  cartService = inject(CartService);
  deliveryComplete = output<boolean>();
  deliveryError = signal<string | null>(null);
  savingDelivery = signal(false);

  ngOnInit(): void {
    this.checkoutService.deliveryMethodsError.set(null);
    this.checkoutService.getDeliveryMethods().subscribe({
      next: methods => {
        this.checkoutService.deliveryMethods.set(methods);

        const method = methods.find(x => x.id === this.cartService.cart()?.deliveryMethodId);
        if (method) {
          this.cartService.SelectedDelivery.set(method);
          this.deliveryComplete.emit(true);
        }
      },
      error: (error: unknown) => {
        this.checkoutService.deliveryMethodsError.set('Unable to load shipping options.');
        console.error('Unable to load checkout delivery methods.', error);
      }
    });
  }

  async updateDeliveryMethod(method: DeliveryMethod) {
    if (this.savingDelivery()) return;

    const cart = this.cartService.cart();
    if (!cart) {
      this.deliveryComplete.emit(false);
      this.deliveryError.set('Your cart is unavailable. Please try again.');
      return;
    }

    const previousMethod = this.cartService.SelectedDelivery();
    this.deliveryError.set(null);
    this.deliveryComplete.emit(false);
    this.cartService.SelectedDelivery.set(method);
    this.savingDelivery.set(true);

    try {
      await firstValueFrom(this.cartService.setCart({
        ...cart,
        deliveryMethodId: method.id
      }));
      this.deliveryComplete.emit(true);
    } catch (error) {
      this.cartService.SelectedDelivery.set(previousMethod);
      this.deliveryError.set('Unable to save the shipping option. Please try again.');
      console.error('Unable to save checkout delivery method.', error);
    } finally {
      this.savingDelivery.set(false);
    }
  }

}
