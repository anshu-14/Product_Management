import { Component } from '@angular/core';
import { TableComponent } from '../../../shared/components/table/table.component';
import { CategoryService } from '../../../services/category.service';
import { ProductService } from '../../../services/product.service';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';

@Component({
  selector: 'app-product',
  imports: [TableComponent, CommonModule, LoaderComponent],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss',
})
export class ProductComponent {
   query = {
    page: 1,
    pageSize: 10,
    orderBy: 'ProductId',
    orderDir: 'ASC' as 'ASC' | 'DESC',
    filters: { search: '', isActive: null as boolean | null },
  };
  total = 0;
  data: any = [];
  columns: any = [
    { field: 'Name', header: 'Name' },
    { field: 'CategoryName', header: 'Category' },
    { field: 'IsActive', header: 'Status' },
  ];
  loading = false;
  constructor(private productService: ProductService) {
    //this.getProductsList();
  }

  loadPage(e: any) {
    
    this.query = {
      ...this.query,
      page: e.page,
      pageSize: e.size,
      orderBy: e.sortField ?? this.query.orderBy,
      orderDir: e.sortOrder === -1 ? 'DESC' : 'ASC',
    };
    this.getProductsList();
  }
  getProductsList() {
    this.loading = true;
    this.productService.getProducts({
        page: this.query.page,
        pageSize: this.query.pageSize,
        orderBy: this.query.orderBy,
        orderDir: this.query.orderDir,
      }).subscribe((res: any) => {
      this.loading = false;
      this.data = res.data.map((item: any) => ({
        ...item,
        IsActive: item.IsActive === 1 ? true : false,
      }));
      console.log(this.data);
      this.total = res.total ?? 0;
    });
  }
  onToggleActive(event: any) {
    console.log(event);
  }
  onEdit(event: any) {
    console.log(event);
  }

  onDelete(event: any) {
    console.log(event);
  }
}
