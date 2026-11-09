import { Component, inject, OnDestroy } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { SignalService } from '/Users/jordan/Desktop/skinet/client/src/app/core/services/signalr.service';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { PaymentCardPipe } from '../../../shared/pipes/payment-pipe';
import { AddressPipe } from '../../../shared/pipes/address-pipe';
import { OrderService } from '../../../core/services/order.service';

@Component({
  imports: [MatButton, RouterLink, MatProgressSpinner, CurrencyPipe, DatePipe, PaymentCardPipe, AddressPipe],
  selector: 'app-checkout-success',
  styleUrl: './checkout-success.css',
  templateUrl: './checkout-success.html',
})
export class CheckoutSuccess implements OnDestroy {
  signalrService = inject(SignalService);
  private orderService = inject(OrderService);

  ngOnDestroy() {
    this.orderService.orderComplete = false;
    this.signalrService.orderSignal.set(null);
}
}