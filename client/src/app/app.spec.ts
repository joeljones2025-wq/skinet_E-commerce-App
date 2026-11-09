import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { provideRouter, Router } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { App } from './app.component';
import { routes } from './app.routes';
import { errorInterceptor } from './core/interceptors/error-interceptor';
import { SnackbarService } from './core/services/snackbar';

async function createApp(): Promise<ComponentFixture<App>> {
  const fixture = TestBed.createComponent(App);
  fixture.detectChanges();
  await TestBed.inject(Router).navigateByUrl('/shop');
  fixture.detectChanges();
  return fixture;
}

describe('App', () => {
  let httpTestingController: HttpTestingController;
  let snackbarErrors: string[];

  beforeEach(async () => {
    snackbarErrors = [];
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideHttpClient(withInterceptors([errorInterceptor])),
        provideHttpClientTesting(),
        provideRouter(routes),
        {
          provide: SnackbarService,
          useValue: { error: (message: string) => snackbarErrors.push(message) },
        },
      ],
    })
      .compileComponents();
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.match('/api/products/brands').forEach(request => request.flush([]));
    httpTestingController.match('/api/products/types').forEach(request => request.flush([]));
    httpTestingController.verify();
  });

  it('should create the app', async () => {
    const fixture = await createApp();

    httpTestingController.expectOne('/api/products?pageIndex=1&pageSize=20&sort=name').flush({
      count: 0,
      data: [],
      pageIndex: 0,
      pageSize: 20,
    });

    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should navigate Home to the home page and apply the exact active state', async () => {
    const fixture = await createApp();
    const router = TestBed.inject(Router);
    const compiled = fixture.nativeElement as HTMLElement;
    const homeLink = compiled.querySelector<HTMLAnchorElement>('.main-nav a[routerLink="/home"]');

    httpTestingController.expectOne('/api/products?pageIndex=1&pageSize=20&sort=name').flush({
      count: 0,
      data: [],
      pageIndex: 0,
      pageSize: 20,
    });

    expect(compiled.querySelector('.main-nav a[href="/shop"]')?.classList.contains('active')).toBe(true);
    expect(homeLink?.classList.contains('active')).toBe(false);

    homeLink?.click();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(router.url).toBe('/home');
    expect(compiled.querySelector('app-home')).toBeTruthy();
    expect(homeLink?.classList.contains('active')).toBe(true);
    expect(compiled.querySelector('.main-nav a[href="/shop"]')?.classList.contains('active')).toBe(false);
  });

  it('should navigate Errors to the test error page', async () => {
    const fixture = await createApp();
    const router = TestBed.inject(Router);
    const compiled = fixture.nativeElement as HTMLElement;
    const errorsLink = compiled.querySelector<HTMLAnchorElement>('.main-nav a[href="/test-error"]');

    httpTestingController.expectOne('/api/products?pageIndex=1&pageSize=20&sort=name').flush({
      count: 0,
      data: [],
      pageIndex: 0,
      pageSize: 20,
    });

    errorsLink?.click();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(router.url).toBe('/test-error');
    expect(compiled.querySelector('app-test-error')).toBeTruthy();
    expect(errorsLink?.classList.contains('active')).toBe(true);
    expect(compiled.querySelector('app-test-error')?.textContent).toContain('Test 500 error');
    expect(compiled.querySelector('app-test-error')?.textContent).toContain('Test 400 validation error');
  });

  it('should render products and navigate to their detail route', async () => {
    const fixture = await createApp();
    httpTestingController.expectOne('/api/products?pageIndex=1&pageSize=20&sort=name').flush({
      count: 1,
      data: [{
        id: 1,
        name: 'Test product',
        description: 'A test product',
        price: 10,
        pictureUrl: '/images/products/test.jpg',
        type: 'Test',
        brand: 'Test',
        quantityInStock: 1,
      }],
      pageIndex: 0,
      pageSize: 20,
    });

    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const productImage = compiled.querySelector('app-product-item img');
    expect(productImage?.getAttribute('src')).toBe('/images/products/test.jpg');
    expect(productImage?.getAttribute('alt')).toBe('Test product');
    const productLink = compiled.querySelector<HTMLAnchorElement>('app-product-item a');
    expect(productLink?.getAttribute('href')).toBe('/shop/1');
    const productCard = compiled.querySelector<HTMLElement>('app-product-item mat-card');
    const filterButton = Array.from(compiled.querySelectorAll('button'))
      .find(button => button.textContent?.includes('Filters'));
    expect(filterButton).toBeTruthy();

    productCard?.click();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(TestBed.inject(Router).url).toBe('/shop/1');
    httpTestingController.expectOne('/api/products/1').flush({
      id: 1,
      name: 'Test product',
      description: 'A test product',
      price: 10,
      pictureUrl: '/images/products/test.jpg',
      type: 'Test',
      brand: 'Test',
      quantityInStock: 1,
    });

    await fixture.whenStable();
    fixture.detectChanges();
    expect(compiled.querySelector('app-product-detail')?.textContent).toContain('Test product');
  });

  it('should add and update product quantity from the product detail page', async () => {
    const fixture = await createApp();
    httpTestingController.expectOne('/api/products?pageIndex=1&pageSize=20&sort=name').flush({
      count: 0,
      data: [],
      pageIndex: 0,
      pageSize: 20,
    });

    await TestBed.inject(Router).navigateByUrl('/shop/1');
    fixture.detectChanges();
    httpTestingController.expectOne('/api/products/1').flush({
      id: 1,
      name: 'Test product',
      description: 'A test product',
      price: 10,
      pictureUrl: '/images/products/test.jpg',
      type: 'Test',
      brand: 'Test',
      quantityInStock: 1,
    });
    await fixture.whenStable();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const addToCartButton = compiled.querySelector<HTMLButtonElement>('app-product-detail button');
    addToCartButton?.click();

    const addRequest = httpTestingController.expectOne('/api/cart');
    expect(addRequest.request.body.items[0].quantity).toBe(1);
    const cart = {
      ...addRequest.request.body,
      items: [...addRequest.request.body.items],
    };
    addRequest.flush(cart);
    await fixture.whenStable();
    fixture.detectChanges();

    const quantityInput = compiled.querySelector<HTMLInputElement>('app-product-detail input');
    if (!quantityInput) {
      throw new Error('Product quantity input was not rendered.');
    }
    quantityInput.value = '3';
    quantityInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    addToCartButton?.click();

    const updateRequest = httpTestingController.expectOne('/api/cart');
    expect(updateRequest.request.body.id).toBe(cart.id);
    expect(updateRequest.request.body.items[0].quantity).toBe(3);
    updateRequest.flush(updateRequest.request.body);
    await fixture.whenStable();
    fixture.detectChanges();
    expect(addToCartButton?.disabled).toBe(true);
  });

  it('should not show sample products when the API is unavailable', async () => {
    const fixture = await createApp();
    httpTestingController.expectOne('/api/products?pageIndex=1&pageSize=20&sort=name')
      .error(new ProgressEvent('error'));

    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelectorAll('li')).toHaveLength(0);
    expect(compiled.querySelector('[role="alert"]')?.textContent)
      .toContain('API and database are running');
    expect(snackbarErrors).toContain(
      'Unable to connect to the server. Check your connection and try again.'
    );
  });

  it('should stay on the current page when an API endpoint returns 404', async () => {
    const fixture = await createApp();
    const router = TestBed.inject(Router);
    httpTestingController.expectOne('/api/products?pageIndex=1&pageSize=20&sort=name').flush({
      count: 0,
      data: [],
      pageIndex: 0,
      pageSize: 20,
    });

    TestBed.inject(HttpClient).get('/api/missing').subscribe({ error: () => {} });
    httpTestingController.expectOne('/api/missing').flush({}, {
      status: 404,
      statusText: 'Not Found',
    });

    await fixture.whenStable();
    expect(router.url).toBe('/shop');
    expect(snackbarErrors).toContain('The requested resource was not found.');
  });
});
