import { HttpClient, HttpParams } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Address, User } from '../../shared/Models/user';
import { SignalService } from './signalr.service';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  baseUrl = environment.apiUrl;
  private http = inject(HttpClient);
  private signalrService = inject(SignalService);
  currentUser = signal<User | null>(null);
  isAdmin = computed(() => {
    const roles = this.currentUser()?.roles;
    return (Array.isArray(roles) ? roles : [roles])
      .some(role => role?.toLowerCase() === 'admin');
  });

  login(values: any) {
    let params = new HttpParams();
    params = params.append('useCookies', true);

    return this.http.post<User>(this.baseUrl + 'login', values, { params }).pipe(
      tap(() => this.signalrService.createHubConnection())
    );
  }

  register(values: any) {
    return this.http.post(
      this.baseUrl + 'account/register',
      values
    );
  }

  getUserInfo() {
    return this.http.get<User>(
      this.baseUrl + 'account/user-info'
    ).pipe(
      tap(user => this.currentUser.set(user))
    );
  }

  logout() {
    return this.http.post(this.baseUrl + 'account/logout',{}).pipe(
      tap(() => {
        this.signalrService.stopHubConnection();
        this.currentUser.set(null);
      })
    );
  }

  updateAddress(address: Address) {
    return this.http.post(
      this.baseUrl + 'account/address',
      address
    );
  }

  getAuthState () {
    return this.http.get<{isAuthenticated: boolean}>(this.baseUrl + 'account/auth-status');
  }
}