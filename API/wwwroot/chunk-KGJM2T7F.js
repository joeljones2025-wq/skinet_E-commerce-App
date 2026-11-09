import {
  Component,
  FormsModule,
  MAT_DIALOG_DATA,
  MatButton,
  MatDialogRef,
  MatDivider,
  MatDividerModule,
  MatListOption,
  MatSelectionList,
  NgControlStatus,
  NgModel,
  ShopService,
  inject2 as inject,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵcontrol,
  ɵɵcontrolCreate,
  ɵɵdefineComponent,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵlistener,
  ɵɵproperty,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIndex,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty
} from "./chunk-PDVYQMOF.js";

// src/app/Features/shop/filter-dialo/filter-dialo.ts
function FilterDialog_For_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-list-option", 5);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const brand_r1 = ctx.$implicit;
    \u0275\u0275property("value", brand_r1);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(brand_r1);
  }
}
function FilterDialog_For_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-list-option", 5);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const type_r2 = ctx.$implicit;
    \u0275\u0275property("value", type_r2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(type_r2);
  }
}
var FilterDialog = class _FilterDialog {
  shopService = inject(ShopService);
  dialogRef = inject(MatDialogRef);
  data = inject(MAT_DIALOG_DATA);
  selectedBrand = [...this.data.selectedBrand];
  selectedType = [...this.data.selectedType];
  applyFilter() {
    this.dialogRef.close({
      selectedBrand: this.selectedBrand,
      selectedType: this.selectedType
    });
  }
  static \u0275fac = function FilterDialog_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _FilterDialog)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _FilterDialog, selectors: [["app-filter-dialo"]], decls: 20, vars: 4, consts: [[1, "text-3xl", "text-center", "pt-6", "mb-3"], [1, "flex", "p-4"], [1, "w-1/2"], [1, "font-semibold", "text-xl", "text-primary"], [3, "ngModelChange", "ngModel", "multiple"], [3, "value"], [1, "flex", "justify-end", "p-4"], ["mat-flat-button", "", 3, "click"]], template: function FilterDialog_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div")(1, "h3", 0);
      \u0275\u0275text(2, "Filters");
      \u0275\u0275elementEnd();
      \u0275\u0275element(3, "mat-divider");
      \u0275\u0275elementStart(4, "div", 1)(5, "div", 2)(6, "h4", 3);
      \u0275\u0275text(7, "Brands");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(8, "mat-selection-list", 4);
      \u0275\u0275controlCreate();
      \u0275\u0275twoWayListener("ngModelChange", function FilterDialog_Template_mat_selection_list_ngModelChange_8_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.selectedBrand, $event) || (ctx.selectedBrand = $event);
        return $event;
      });
      \u0275\u0275repeaterCreate(9, FilterDialog_For_10_Template, 2, 2, "mat-list-option", 5, \u0275\u0275repeaterTrackByIndex);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(11, "div", 2)(12, "h4", 3);
      \u0275\u0275text(13, "Types");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(14, "mat-selection-list", 4);
      \u0275\u0275controlCreate();
      \u0275\u0275twoWayListener("ngModelChange", function FilterDialog_Template_mat_selection_list_ngModelChange_14_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.selectedType, $event) || (ctx.selectedType = $event);
        return $event;
      });
      \u0275\u0275repeaterCreate(15, FilterDialog_For_16_Template, 2, 2, "mat-list-option", 5, \u0275\u0275repeaterTrackByIndex);
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(17, "div", 6)(18, "button", 7);
      \u0275\u0275listener("click", function FilterDialog_Template_button_click_18_listener() {
        return ctx.applyFilter();
      });
      \u0275\u0275text(19, "Apply Filters");
      \u0275\u0275elementEnd()()();
    }
    if (rf & 2) {
      \u0275\u0275advance(8);
      \u0275\u0275twoWayProperty("ngModel", ctx.selectedBrand);
      \u0275\u0275property("multiple", true);
      \u0275\u0275control();
      \u0275\u0275advance();
      \u0275\u0275repeater(ctx.shopService.productBrands);
      \u0275\u0275advance(5);
      \u0275\u0275twoWayProperty("ngModel", ctx.selectedType);
      \u0275\u0275property("multiple", true);
      \u0275\u0275control();
      \u0275\u0275advance();
      \u0275\u0275repeater(ctx.shopService.productTypes);
    }
  }, dependencies: [MatDividerModule, MatDivider, MatSelectionList, MatListOption, MatButton, FormsModule, NgControlStatus, NgModel], styles: ["\n/*# sourceMappingURL=filter-dialo.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FilterDialog, [{
    type: Component,
    args: [{ imports: [MatDividerModule, MatSelectionList, MatListOption, MatButton, FormsModule], standalone: true, selector: "app-filter-dialo", template: '<div>\n    <h3 class="text-3xl text-center pt-6 mb-3">Filters</h3>\n    <mat-divider></mat-divider>\n\n    <div class="flex p-4">\n        <div class="w-1/2">\n            <h4 class="font-semibold text-xl text-primary">Brands</h4>\n            <mat-selection-list [(ngModel)]="selectedBrand" [multiple]="true">\n                @for (brand of shopService.productBrands; track $index) {\n                    <mat-list-option [value]="brand">{{brand}}</mat-list-option>\n                }\n            </mat-selection-list>\n        </div>\n\n        <div class="w-1/2">\n            <h4 class="font-semibold text-xl text-primary">Types</h4>\n            <mat-selection-list [(ngModel)]="selectedType" [multiple]="true">\n                @for (type of shopService.productTypes; track $index) {\n                    <mat-list-option [value]="type">{{type}}</mat-list-option>\n                }\n            </mat-selection-list>\n        </div>\n    </div>\n     <div class="flex justify-end p-4">\n        <button mat-flat-button (click)="applyFilter()">Apply Filters</button>\n    </div>\n</div>', styles: ["/* src/app/Features/shop/filter-dialo/filter-dialo.css */\n/*# sourceMappingURL=filter-dialo.css.map */\n"] }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(FilterDialog, { className: "FilterDialog", filePath: "src/app/features/shop/filter-dialo/filter-dialo.ts", lineNumber: 21 });
})();
export {
  FilterDialog
};
//# debugId=b0870733-827b-5097-ba75-ae93449fa930
//# sourceMappingURL=chunk-KGJM2T7F.js.map
