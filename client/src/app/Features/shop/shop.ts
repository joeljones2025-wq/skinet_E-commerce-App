import { Component, inject, OnInit, signal } from '@angular/core';
import { ShopService } from '../../core/services/shop.service';
import { Product } from '../../shared/Models/Product';
import { ProductItem } from './product-item/product-item';
import { MatDialog } from '@angular/material/dialog';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { MatListOption, MatSelectionList, MatSelectionListChange } from '@angular/material/list';
import { ShopParams } from '../../shared/Models/shopeparams';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Pagination } from '../../shared/Models/Pagenation';
import { FormsModule } from '@angular/forms';
import { EmptyState } from '../../shared/component/empty-state/empty-state';

@Component({
  imports: [ProductItem, MatButton, MatIcon, MatMenu, MatSelectionList, MatListOption, MatMenuTrigger, MatPaginator, FormsModule, MatIconButton, EmptyState],
  standalone: true,
  selector: 'app-shop',
  styleUrl: './shop.css',
  templateUrl: './shop.html',
})
export class Shop implements OnInit {
  private shopService = inject(ShopService);
  private dialogService = inject(MatDialog);
  products?: Pagination<Product>;
  selectedSort = 'name';
  sortoptions = [
    { name: 'Alphabetical', value: 'name' },
    { name: 'Price: Low-High', value: 'priceAsc' },
    { name: 'Price: High-Low', value: 'priceDesc' }
  ];
  shopParams = new ShopParams();
  pageSizeOptions = [5,10,15,20]
  loading = signal(true);
  loadError = signal<string | null>(null);

  ngOnInit(): void {
    this.initializeShop();
  }

  initializeShop() {
    this.shopService.getBrands();
    this.shopService.getTypes();
    this.getProducts();
  }

  resetFilter(){
    this.shopParams = new ShopParams();
    this.getProducts();
  }

  getProducts() {
    this.loading.set(true);
    this.loadError.set(null);

    this.shopService.getProducts(this.shopParams).subscribe({
      next: response => {
        this.products = response;
        this.loading.set(false);
      },
      error: error => {
        console.error('Failed to load products.', error);
        this.loadError.set('Could not load products from the API. Check that the API and database are running, then refresh.');
        this.loading.set(false);
      }
    });
  }

  onSearchChange() {
    this.shopParams.PageNumber = 1;
    this.getProducts();
  }

  handelPageEvent(event: PageEvent) {
    this.shopParams.PageNumber = event.pageIndex+1;
    this.shopParams.PageSize = event.pageSize;
    this.getProducts();
  }

  onSortChange(event: MatSelectionListChange) {
    const selectedOption = event.options[0];
    if (selectedOption) {
      this.shopParams.sort = selectedOption.value;
      this.shopParams.PageNumber = 1;
      this.selectedSort = this.shopParams.sort;
      this.getProducts();
    }
  }

  async openFilterDialog() {
    const { FilterDialog } = await import('./filter-dialo/filter-dialo');
    const dialogRef = this.dialogService.open(FilterDialog, {
      width: '500px',
      data: {
        selectedBrand: this.shopParams.brands,
        selectedType: this.shopParams.types
      }
    });

    dialogRef.afterClosed().subscribe({
      next: result => {
        if (result) {
          this.shopParams.brands = result.selectedBrand ?? [];
          this.shopParams.types = result.selectedType ?? [];
          this.shopParams.PageNumber = 1;
          this.getProducts();
        }
      },
      error: (error: any) => {
        console.error('Failed to load filtered products.', error);
        this.loadError.set('Could not load filtered products. Check that the API and database are running, then try again.');
      }
    });
  }
}
