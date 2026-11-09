import { Routes } from '@angular/router';
import { Shop } from './Features/shop/shop';
import { Cart } from './Features/cart/cart';
import { ProductDetail } from './Features/shop/product-detail/product-detail';
import { TestErrorComponent } from './Features/test-error/test-error';
import { ServerErrorComponent } from './shared/component/server-error/server-error';
import { NotFoundComponent } from './shared/component/not-found/not-found';
import { CheckoutComponent } from './Features/checkout/checkout';
import { CheckoutSuccess } from './Features/checkout/checkout-success/checkout-success';
import { LoginComponent } from './Features/account/login/login';
import { RegisterComponent } from './Features/account/register/register';
import { authGuard } from './core/guards/auth-guard';
import { emptyCartGuard } from './core/guards/empty-cart-guard';
import { Order } from './Features/orders/order';
import { OrderDetailed } from './Features/orders/order-detailed/order-detailed';
import { orderCompleteGuard } from './core/guards/order-complete-guard';
import { Home } from './Features/home/home';
import { AdminComponent } from './Features/admin/admin-component';
import { adminGuard } from './core/guards/admin-guard';


export const routes: Routes = [
    {path: '', component: Home, pathMatch: 'full'},
    {path: 'home', component: Home},
    {path: 'shop', component: Shop},
    {path: 'shop/:id', component: ProductDetail},
    {path: 'cart', component: Cart},
    {path: 'checkout', component: CheckoutComponent, canActivate: [authGuard,emptyCartGuard]},
    {path: 'checkout/success', component: CheckoutSuccess, canActivate: [authGuard, orderCompleteGuard]},
    {path: 'orders', component: Order, canActivate: [authGuard]},
    {path: 'orders/:id', component: OrderDetailed, canActivate: [authGuard]},
    {path: 'account/login', component: LoginComponent},
    {path: 'account/register', component: RegisterComponent},
    {path: 'test-error', component: TestErrorComponent},
    {path: 'server-error', component: ServerErrorComponent},
    {path: 'not-found', component: NotFoundComponent},
    {path: 'admin', component: AdminComponent, canActivate: [authGuard, adminGuard]},
    {path: '**', redirectTo: 'not-found', pathMatch: 'full'},
];
