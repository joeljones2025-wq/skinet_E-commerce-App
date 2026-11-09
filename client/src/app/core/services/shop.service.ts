import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Pagination } from '../../shared/Models/Pagenation';
import { Product } from '../../shared/Models/Product';
import { ShopParams } from '../../shared/Models/shopeparams';

@Injectable({
  providedIn: 'root'
})
export class ShopService {
  baseUrl = '/api/';
  private http = inject(HttpClient);
  productTypes: string[] = [];
  productBrands: string[] = [];

  getProducts(params: ShopParams = new ShopParams()) {
    let httpParams = new HttpParams()
      .set('pageIndex', params.PageNumber.toString())
      .set('pageSize', params.PageSize.toString());

    if (params.brands.length > 0) {
      httpParams = httpParams.set('brands', params.brands.join(','));
    }

    if (params.types.length > 0) {
      httpParams = httpParams.set('types', params.types.join(','));
    }

    if (params.sort) {
      httpParams = httpParams.set('sort', params.sort);
    }

    if(params.Search) {
      httpParams = httpParams.set('search',params.Search);
    }

    return this.http.get<Pagination<Product>>(this.baseUrl + 'products', { params: httpParams });
  }

  getProduct(id: number){
    return this.http.get<Product>(this.baseUrl + 'products/' + id);
  }

  getBrands() {
    if (this.productBrands.length > 0) return;

    return this.http.get<string[]>(this.baseUrl + 'products/brands').subscribe({
      next: response => this.productBrands = response
    });
  }

  getTypes() {
    if (this.productTypes.length > 0) return;

    return this.http.get<string[]>(this.baseUrl + 'products/types').subscribe({
      next: response => this.productTypes = response
    });
  }
}
