import { Component, inject } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { ShopService } from '../../../core/services/shop.service';
import { MatSelectionList, MatListOption } from '@angular/material/list';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';

interface FilterDialogData {
  selectedBrand: string[];
  selectedType: string[];
}

@Component({
  imports: [MatDividerModule, MatSelectionList, MatListOption, MatButton, FormsModule],
  standalone: true,
  selector: 'app-filter-dialo',
  styleUrl: './filter-dialo.css',
  templateUrl: './filter-dialo.html',
})
export class FilterDialog {
  shopService = inject(ShopService);
  private dialogRef = inject(MatDialogRef<FilterDialog>);
  data = inject<FilterDialogData>(MAT_DIALOG_DATA);

  selectedBrand: string[] = [...this.data.selectedBrand];
  selectedType: string[] = [...this.data.selectedType];
  
  applyFilter() {
    this.dialogRef.close({
      selectedBrand: this.selectedBrand,
      selectedType: this.selectedType
    })
  }
}
