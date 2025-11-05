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
  data: any = [];
  columns: any = [
    { field: 'Name', header: 'Name' },
    { field: 'Description', header: 'Description' },
    { field: 'IsActive', header: 'Status' },
  ];
  loading = false;
  constructor(private categoryService: CategoryService) {
    
    this.getCategoryList();
  }

  getCategoryList() {
    this.loading = true;
    this.categoryService.getCategories().subscribe((res: any) => {
      this.loading = false;
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
  onEdit(event: any) {
    console.log(event);
  }

  onDelete(event: any) {
    console.log(event);
  }
}
