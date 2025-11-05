import { Component } from '@angular/core';
import { TableComponent } from '../../../shared/components/table/table.component';
import { CategoryService } from '../../../services/category.service';

import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-category',
  imports: [TableComponent, CommonModule, LoaderComponent],
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss',
})
export class CategoryComponent {
  query = {
    page: 1,
    pageSize: 10,
    orderBy: 'CategoryId',
    orderDir: 'ASC' as 'ASC' | 'DESC',
    filters: { search: '', isActive: null as boolean | null },
  };
  total = 0;
  data: any = [];
  columns: any = [
    { field: 'Name', header: 'Name' },
    { field: 'Description', header: 'Description' },
    { field: 'IsActive', header: 'Status' },
  ];
  loading = false;
  constructor(private categoryService: CategoryService) {

  }
  loadPage(e: any) {
    
    this.query = {
      ...this.query,
      page: e.page,
      pageSize: e.size,
      orderBy: e.sortField ?? this.query.orderBy,
      orderDir: e.sortOrder === -1 ? 'DESC' : 'ASC',
    };
    this.getCategoryList();
  }
  getCategoryList() {
    this.loading = true;
    this.categoryService
      .getCategories({
        page: this.query.page,
        pageSize: this.query.pageSize,
        orderBy: this.query.orderBy,
        orderDir: this.query.orderDir,
      })
      .subscribe((res: any) => {
        this.loading = false;
  
        this.data = res.data.map((item: any) => ({
          ...item,
          IsActive: item.IsActive === 1 ? true : false,
        }));
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
