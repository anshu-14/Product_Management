import { Component } from '@angular/core';
import { TableComponent } from '../../../shared/components/table/table.component';
import { CategoryService } from '../../../services/category.service';
import { ProductService } from '../../../services/product.service';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';

@Component({
  selector: 'app-product',
  imports: [TableComponent,CommonModule,LoaderComponent],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss'
})
export class ProductComponent {
data: any = [];
  columns: any = [
    { field: 'Name', header: 'Name' },
    { field: 'CategoryName', header: 'Category' },
    { field: 'IsActive', header: 'Status' },
  ];
    loading = false;
  constructor(private productService: ProductService) {
    this.loading=true;
   this.getProductsList();
  }
  getProductsList()
  {
this.productService.getProducts().subscribe((res: any) => {
  this.loading=false;
      this.data = res.data.map((item: any) => ({
        ...item,
        IsActive: item.IsActive === 1 ? true : false,
      }));
      console.log(this.data);
    });
  }
  onToggleActive(event: any) {
    console.log(event);
  }
}
