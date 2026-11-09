import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { OrderService } from '../../../core/services/order.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Order } from '../../../shared/Models/Order';
import { MatCard } from '@angular/material/card';
import { MatButton } from '@angular/material/button';
import { AddressPipe } from '../../../shared/pipes/address-pipe';
import { PaymentCardPipe } from '../../../shared/pipes/payment-pipe';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { TimeoutError, timeout } from 'rxjs';
import { SignalService } from '../../../core/services/signalr.service';

@Component({
  imports: [MatCard, MatButton, AddressPipe, PaymentCardPipe, CurrencyPipe, DatePipe],
  selector: 'app-order-detailed',
  styleUrl: './order-detailed.css',
  templateUrl: './order-detailed.html',
})
export class OrderDetailed implements OnInit {
  readonly buttonText = 'Back to orders';

  private orderService = inject(OrderService);
  private signalrService = inject(SignalService);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);

  order = signal<Order | undefined>(undefined);
  loading = signal(true);
  loadError = signal(false);
  loadErrorMessage = signal('Your order details could not be loaded.');

  constructor() {
    effect(() => {
      const updatedOrder = this.signalrService.orderSignal();
      if (updatedOrder && updatedOrder.id === this.order()?.id) {
        this.order.set(updatedOrder);
      }
    });
  }

  ngOnInit(): void {
    this.loadOrder();
  }

  onReturnClick(): void {
    void this.router.navigate(['/orders']);
  }

  loadOrder(): void {
    const id = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    if (!Number.isInteger(id) || id <= 0) {
      this.loading.set(false);
      this.loadError.set(true);
      this.loadErrorMessage.set('This order link is invalid.');
      return;
    }

    this.loading.set(true);
    this.loadError.set(false);
    this.orderService.getOrderDetailed(id).pipe(
      timeout({ first: 15000 })
    ).subscribe({
      next: order => {
        const updatedOrder = this.signalrService.orderSignal();
        this.order.set(updatedOrder?.id === order.id ? updatedOrder : order);
        this.loading.set(false);
      },
      error: error => {
        console.error('Unable to load order details.', error);
        this.loadError.set(true);
        this.loadErrorMessage.set(error instanceof TimeoutError
          ? 'The order request is taking too long. Check that the API and database are running, then try again.'
          : 'Your order details could not be loaded.');
        this.loading.set(false);
      }
    });
  }
}
