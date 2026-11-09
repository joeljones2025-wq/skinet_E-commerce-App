import { Component, DestroyRef, effect, inject, OnInit, signal } from '@angular/core';
import { OrderService } from '../../core/services/order.service';
import { Order as OrderModel } from '../../shared/Models/Order';
import { SignalService } from '../../core/services/signalr.service';
import { RouterLink } from '@angular/router';
import { CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  imports: [RouterLink,CurrencyPipe,DatePipe],
  selector: 'app-order',
  styleUrl: './order.css',
  templateUrl: './order.html',
})
export class Order implements OnInit {
  private orderService = inject(OrderService);
  private signalrService = inject(SignalService);
  private destroyRef = inject(DestroyRef);
  private loadTimeout?: ReturnType<typeof setTimeout>;
  orders = signal<OrderModel[]>([]);
  loading = signal(true);
  loadError = signal(false);
  loadErrorMessage = signal('Your orders could not be loaded.');

  constructor() {
    this.destroyRef.onDestroy(() => clearTimeout(this.loadTimeout));
    effect(() => {
      const updatedOrder = this.signalrService.orderSignal();
      if (!updatedOrder) return;

      this.orders.update(orders => orders.map(order =>
        order.id === updatedOrder.id ? updatedOrder : order
      ));
    });
  }

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    clearTimeout(this.loadTimeout);
    this.loading.set(true);
    this.loadError.set(false);
    this.loadErrorMessage.set('Your orders could not be loaded.');
    this.loadTimeout = setTimeout(() => {
      if (this.loading()) {
        this.loading.set(false);
        this.loadError.set(true);
        this.loadErrorMessage.set('The orders request is taking too long. Check that the API and database are running, then try again.');
      }
    }, 15000);

    this.orderService.getOrdersForUser().subscribe({
      next: orders => {
        clearTimeout(this.loadTimeout);
        const updatedOrder = this.signalrService.orderSignal();
        this.orders.set(orders.map(order =>
          order.id === updatedOrder?.id ? updatedOrder : order
        ));
        this.loading.set(false);
      },
      error: error => {
        clearTimeout(this.loadTimeout);
        console.error('Unable to load orders.', error);
        this.loadError.set(true);
        this.loading.set(false);
      }
    });
  }
}
