import { CurrencyPipe } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { CartService } from '../../../core/services/cart.service';
import { ConfirmationToken } from '@stripe/stripe-js/dist/api/confirmation-tokens';
import { AddressPipe } from '../../../shared/pipes/address-pipe';
import { PaymentCardPipe } from '../../../shared/pipes/payment-pipe';

@Component({
  imports: [CurrencyPipe, AddressPipe, PaymentCardPipe],
  selector: 'app-checkout-review',
  styleUrl: './checkout-review.css',
  templateUrl: './checkout-review.html',
})
export class CheckoutReview {
  cartService = inject(CartService);
  @Input() confirmationToken?: ConfirmationToken;
  @Input() loading?: boolean;
}
