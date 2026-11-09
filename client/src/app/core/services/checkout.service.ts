import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { DeliveryMethod } from '../../shared/Models/DeliveryMethod';

@Injectable({
  providedIn: 'root'
})
export class Checkout {
  baseUrl = environment.apiUrl;
  private http = inject(HttpClient);
  orderComplete = false;
  deliveryMethods = signal<DeliveryMethod[]>([]);
  deliveryMethodsError = signal<string | null>(null);

  getDeliveryMethods(): Observable<DeliveryMethod[]> {
    return this.http.get<DeliveryMethod[]>(this.baseUrl + 'payments/delivery-methods').pipe(
      map(methods => methods.sort((a, b) => b.price - a.price))
    );
  }
}