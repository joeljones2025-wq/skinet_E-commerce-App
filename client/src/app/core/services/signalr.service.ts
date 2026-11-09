import { Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HubConnection, HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';
import { Order } from '/Users/jordan/Desktop/skinet/client/src/app/shared/Models/Order';

@Injectable({
  providedIn: 'root'
})
export class SignalService {
  hubUrl = environment.hubUrl;
  hubConnection?: HubConnection;
  orderSignal = signal<Order | null>(null);
  private reconnectTimer?: ReturnType<typeof setTimeout>;
  private reconnectDelay = 1000;
  private shouldReconnect = true;

  createHubConnection() {
    this.shouldReconnect = true;

    if (!this.hubConnection) {
      this.hubConnection = new HubConnectionBuilder()
        .withUrl(this.hubUrl, {
          withCredentials: true
        })
        .withAutomaticReconnect({
          nextRetryDelayInMilliseconds: context =>
            Math.min(1000 * 2 ** context.previousRetryCount, 30_000)
        })
        .build();

      this.hubConnection.on('OrderCompleteNotification', (order: Order) => {
        this.orderSignal.set(order)
      });
      this.hubConnection.onclose(() => this.scheduleReconnect());
    }

    this.startHubConnection();
  }

  private startHubConnection() {
    const connection = this.hubConnection;
    if (!connection || connection.state !== HubConnectionState.Disconnected) return;

    clearTimeout(this.reconnectTimer);
    this.reconnectTimer = undefined;

    connection.start()
      .then(() => this.reconnectDelay = 1000)
      .catch(error => {
        console.error('Unable to connect to order notifications.', error);
        this.scheduleReconnect();
      });
  }

  private scheduleReconnect() {
    if (!this.shouldReconnect || this.reconnectTimer) return;

    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = undefined;
      this.startHubConnection();
    }, this.reconnectDelay);
    this.reconnectDelay = Math.min(this.reconnectDelay * 2, 30_000);
  }

  stopHubConnection() {
    this.shouldReconnect = false;
    clearTimeout(this.reconnectTimer);
    this.reconnectTimer = undefined;

    if (this.hubConnection && this.hubConnection.state !== HubConnectionState.Disconnected) {
      this.hubConnection.stop().catch(error =>
        console.error('Unable to disconnect from order notifications.', error)
      );
    }
  }
}
