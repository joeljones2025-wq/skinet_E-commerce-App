import { AfterViewInit, Component, inject, OnDestroy, signal } from '@angular/core';
import { MatStepper, MatStepperModule } from "@angular/material/stepper";
import { MatButton } from '@angular/material/button';
import { ConfirmationToken, StripeAddressElement, StripeAddressElementChangeEvent, StripePaymentElement, StripePaymentElementChangeEvent } from '@stripe/stripe-js';
import { StripeService } from '../../core/services/stripe.service';
import { Router, RouterLink } from '@angular/router';
import { SnackbarService } from '../../core/services/snackbar';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { firstValueFrom } from 'rxjs';
import { AccountService } from '../../core/services/accounts.service';
import { CheckoutDelivery } from './checkout-delivery/checkout-delivery';
import { CartService } from '../../core/services/cart.service';
import { CurrencyPipe } from '@angular/common';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { CheckoutReview } from './checkout-review/checkout-review';
import { OrderSummary } from '../../shared/component/order-summary/order-summary';
import { OrderToCreate, ShippingAddress } from '../../shared/Models/Order';
import { Address } from '../../shared/Models/user';
import { OrderService } from '../../core/services/order.service';
import { SignalService } from '../../core/services/signalr.service';

@Component({
  selector: 'app-checkout',
  imports: [
    OrderSummary,
    MatStepperModule,
    MatButton,
    RouterLink,
    MatCheckboxModule,
    CheckoutDelivery,
    CheckoutReview,
    CurrencyPipe,
    MatProgressSpinner
  ],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css'
})
export class CheckoutComponent implements AfterViewInit, OnDestroy {
  private stripeService = inject(StripeService);
  private accountService = inject(AccountService);
  private snackbar = inject(SnackbarService);
  private router = inject(Router);
  private orderService = inject(OrderService);
  private signalrService = inject(SignalService);
  cartService = inject(CartService);
  addressElement?: StripeAddressElement;
  paymentElement?: StripePaymentElement;
  saveAddress = false;
  completionStatus = signal<{ address: boolean, card: boolean, delivery: boolean }>(
    { address: false, card: false, delivery: false });
  confirmationToken?: ConfirmationToken;
  loading = false;
  private paymentSucceeded = false;

  async ngAfterViewInit() {
    try {
      this.addressElement = await this.stripeService.createAddressElement();
      this.addressElement.mount('#address-element');
      this.addressElement.on('change', this.handleAddressChange);

      this.paymentElement = await this.stripeService.createPaymentElement();
      this.paymentElement.mount('#payment-element');
      this.paymentElement.on('change', this.handlePaymentChange);
    } catch (error: any) {
      this.snackbar.error(error.message)
    }
  }

  handleAddressChange = (event: StripeAddressElementChangeEvent) => {
    this.completionStatus.update(state => ({ ...state, address: event.complete }));
  }

  handlePaymentChange = (event: StripePaymentElementChangeEvent) => {
    this.completionStatus.update(state => ({ ...state, card: event.complete }));
  }

  handleDeliveryChange(event: boolean) {
    this.completionStatus.update(state => ({ ...state, delivery: event }));
  }

  async getConfirmationToken() {
    try {
      if (Object.values(this.completionStatus()).every(status => status === true)) {
        const result = await this.stripeService.createConfirmationToken();
        if (result.error) throw new Error(result.error.message)
        this.confirmationToken = result.confirmationToken;
        console.log(this.confirmationToken);
      }
    } catch (error: any) {
      this.snackbar.error(error.message)
    }
  }

  async onStepChange(event: StepperSelectionEvent) {
    if (event.selectedIndex === 1) {
      if (this.saveAddress) {
        const address = await this.getAddressFromStripeAddress() as Address;
        if (address) {
          await firstValueFrom(this.accountService.updateAddress(address));
        }
      }
    }
    if (event.selectedIndex === 2) {
      await firstValueFrom(this.stripeService.createOrUpdatePaymentIntent());
    }
    if (event.selectedIndex === 3) {
      await this.getConfirmationToken();
    }
  }

  async confirmPayment(stepper: MatStepper) {
    this.loading = true;
    try {
      if (this.confirmationToken) {
        if (!this.paymentSucceeded) {
          const result = await this.stripeService.confirmPayment(this.confirmationToken);

          if (result.paymentIntent?.status === 'succeeded') {
            this.paymentSucceeded = true;
          } else if (result.error) {
            throw new Error(result.error.message);
          } else {
            throw new Error('Something went wrong');
          }
        }

        const order = await this.createOrderModel();
        const createdOrder = await firstValueFrom(this.orderService.createOrder(order));
        this.signalrService.orderSignal.update(currentOrder =>
          currentOrder?.id === createdOrder.id ? currentOrder : createdOrder
        );
        this.orderService.orderComplete = true;

        this.cartService.deleteCart();
        this.cartService.SelectedDelivery.set(null);
        this.router.navigateByUrl('/checkout/success');
      }
    } catch (error: any) {
      this.snackbar.error(error.message || 'Something went wrong');
      if (!this.paymentSucceeded) stepper.previous();
    } finally {
      this.loading = false;
    }
  }

  private async createOrderModel(): Promise<OrderToCreate> {
    const cart = this .cartService.cart();
    const shippingAddress = await this.getAddressFromStripeAddress() as ShippingAddress;
    const card = this.confirmationToken?.payment_method_preview.card;

    if(!cart?.id || !cart.deliveryMethodId || !card || !shippingAddress){
      throw new Error('Missing required information to create order');
    }

    return {
      cartId: cart.id,
      paymentSummary: {
        last4: +card.last4,
        brand: card.brand,
        expMonth: card.exp_month,
        expYear: card.exp_year
      },
      deliveryMethodId: cart.deliveryMethodId,
      shippingAddress
    }
  }

  private async getAddressFromStripeAddress(): Promise<Address | ShippingAddress | null> {
    const result = await this.addressElement?.getValue();
    const address = result?.value.address;

    if (address) {
      return {
        name: result.value.name,
        line1: address.line1,
        line2: address?.line2 || undefined,
        city: address.city,
        state: address.state,
        country: address.country,
        postalCode: address.postal_code
      }
    } else return null;
  }

  onSaveAddressCheckboxChange(event: MatCheckboxChange) {
    this.saveAddress = event.checked
  }

  ngOnDestroy(): void {
    this.stripeService.disposeElements();
  }
}