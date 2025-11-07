import { CategoryService } from '../../../services/category.service';
import { Component } from '@angular/core';
import { TableComponent } from '../../../shared/components/table/table.component';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { CommonModule } from '@angular/common';
import { TextareaModule } from 'primeng/textarea';
import { ButtonModule } from 'primeng/button';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { DividerModule } from 'primeng/divider';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
@Component({
  selector: 'app-category',
  imports: [
    TableComponent,
    CommonModule,
    LoaderComponent,
    DialogModule,
    InputTextModule,
    ButtonModule,
    FormsModule,
    ReactiveFormsModule,
    TextareaModule,
    ConfirmPopupModule,
    DividerModule,
  ],
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
  visible: boolean = false;
  categoryForm!: FormGroup;
  mode: any = 'add';
  constructor(
    private categoryService: CategoryService,
    private fb: FormBuilder,
  ) {
    this.categoryForm = this.createCategoryForm();
  }
  createCategoryForm() {
    return this.fb.group({
      CategoryId: [null],
      Name: [null, [Validators.required]],
      Description: [null],
    });
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
  getCategoryList(isExport: boolean = false) {
    this.loading = true;
    this.categoryService
      .getCategories({
        page: this.query.page,
        pageSize: this.query.pageSize,
        orderBy: this.query.orderBy,
        orderDir: this.query.orderDir,
        isExport: isExport,
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

  downloadReport() {
    this.loading = true;
    this.categoryService
      .downloadReport({
        page: this.query.page,
        pageSize: this.query.pageSize,
        orderBy: this.query.orderBy,
        orderDir: this.query.orderDir,
        isExport: true,
      })
      .subscribe({
        next: (response: any) => {
          const contentDisposition = response.headers.get(
            'content-disposition',
          );
          let fileName = 'Category.xlsx';
          if (contentDisposition) {
            const match = contentDisposition.match(/filename="(.+)"/);
            if (match && match[1]) fileName = match[1];
          }

          const blob = new Blob([response.body!], {
            type: response.body?.type,
          });
          const url = window.URL.createObjectURL(blob);

          const a = document.createElement('a');
          a.href = url;
          a.download = fileName;
          document.body.appendChild(a);
          a.click();

          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
          this.loading = false;
        },
        error: (err) => {
          this.loading = false;
        },
      });
  }



  getCategoryById(id: any) {
    this.loading = true;
    this.mode = 'edit';
    this.categoryService.getCategoryById(id).subscribe((res: any) => {
      console.log(res);
      this.bindCategoryForm(res);
      this.loading = false;
      this.visible = true;
    });
  }
  deleteCategory(id: any) {
    this.loading = true;
    this.categoryService.deleteCategory(id).subscribe((res: any) => {
      this.loading = false;
      this.getCategoryList();
    });
  }
  toggleStatus(event: any) {
    this.loading = true;
    this.categoryService
      .toggleStatus(event.CategoryId, event)
      .subscribe((res: any) => {
        this.loading = false;
        this.getCategoryList();
      });
  }
  bindCategoryForm(data: any) {
    this.categoryForm.patchValue(data);
  }

  openAddDialog() {
    this.mode = 'add';
    this.visible = true;
    this.categoryForm.reset({
      CategoryId: null,
      Name: null,
      Description: null,
    });
  }
  onToggleActive(event: any) {
    this.toggleStatus(event);
  }
  onEdit(event: any) {
    this.getCategoryById(event.CategoryId);
  }

  onDelete(event: any) {
    this.deleteCategory(event.CategoryId);
  }

  onUpdate() {
    if (this.categoryForm.invalid) {
      this.categoryForm.markAllAsTouched();
      return;
    }
    this.visible = false;
    this.loading = true;
    const data = this.categoryForm.value;
    if (this.mode === 'edit') {
      this.categoryService.updateCategory(data.CategoryId, data).subscribe({
        next: (res: any) => {
          console.log(res);
          this.loading = false;
          this.getCategoryList();
        },
        error: (err) => {
          console.log(err);
        },
      });
    } else {
      this.categoryService.addCategory(data).subscribe({
        next: (res: any) => {
          console.log(res);
          this.loading = false;
          this.visible = false;
          this.getCategoryList();
        },
        error: (err) => {
          console.log(err);
        },
      });
    }
  }
}
