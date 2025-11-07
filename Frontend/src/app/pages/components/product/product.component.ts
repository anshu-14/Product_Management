import { Component, OnInit } from '@angular/core';
import { TableComponent } from '../../../shared/components/table/table.component';

import { ProductService } from '../../../services/product.service';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { CommonModule } from '@angular/common';
import { TextareaModule } from 'primeng/textarea';
import { ButtonModule } from 'primeng/button';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { DividerModule } from 'primeng/divider';
import { SelectModule } from 'primeng/select';
import { InputNumberModule } from 'primeng/inputnumber';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CategoryService } from '../../../services/category.service';

@Component({
  selector: 'app-product',
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
    SelectModule,
    InputNumberModule,
  ],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss',
})
export class ProductComponent implements OnInit {
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
    { field: 'Price', header: 'Price' },
    { field: 'IsActive', header: 'Status' },
  ];
  loading = false;
  visible: boolean = false;
  productForm!: FormGroup;
  mode: any = 'add';
  categories: any;
  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private fb: FormBuilder,
  ) {
    this.productForm = this.createProductForm();
  }
  ngOnInit() {
    this.getCategoryList();
  }
  getCategoryList(isExport: boolean = false) {
    this.loading = true;
    this.categoryService
      .getCategories({
        page: 0,
        pageSize: 0,
        orderBy: '',
        orderDir: 'ASC',
        isExport: isExport,
      })
      .subscribe((res: any) => {
        this.loading = false;

        this.categories = res.data.map((item: any) => ({
          CategoryId: item.CategoryId,
          Name: item.Name,
        }));
        
      });
  }
  createProductForm() {
    return this.fb.group({
      ProductId: [null],
      CategoryId: [null, [Validators.required]],
      Name: [null, [Validators.required]],
      Price: [null, [Validators.required]],
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
    this.getProductsList();
  }
  getProductsList() {
    this.loading = true;
    this.productService
      .getProducts({
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
        console.log(this.data);
        this.total = res.total ?? 0;
      });
  }
  onToggleActive(event: any) {
      this.toggleStatus(event);
  }
  onEdit(event: any) {
      this.getProductById(event.ProductId);
  }

  onDelete(event: any) {
    this.deleteProduct(event.ProductId);
  }

  downloadReport() {
    this.loading = true;
    this.productService
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
          let fileName = 'Product.xlsx';
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



  getProductById(id: any) {
    this.loading = true;
    this.mode = 'edit';
    this.productService.getProductById(id).subscribe((res: any) => {
      console.log(res);
      this.bindProductForm(res);
      this.loading = false;
      this.visible = true;
    });
  }
  deleteProduct(id: any) {
    this.loading = true;
    this.productService.deleteProduct(id).subscribe((res: any) => {
      this.loading = false;
      this.getProductsList();
    });
  }
  toggleStatus(event: any) {
    this.loading = true;
    this.productService
      .toggleStatus(event.ProductId, event)
      .subscribe((res: any) => {
        this.loading = false;
        this.getProductsList();
      });
  }
  bindProductForm(data: any) {
    this.productForm.patchValue(data);
  }


  openAddDialog() {
    this.mode = 'add';
    this.visible = true;
    this.productForm.reset({
      ProductId: null,
      CategoryId: null,
      Name: null,
      Price: null,
    });
  }
  onUpdate() {
     if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }
    this.visible = false;
     this.loading = true;
    const data = this.productForm.value;

     if (this.mode === 'edit') {
      this.productService.updateProduct(data.ProductId, {name:data.Name,categoryId:data.CategoryId,price:data.Price,isActive:true}).subscribe({
        next: (res: any) => {
          console.log(res);
          this.loading = false;
          this.getProductsList();
        },
        error: (err) => {
                    this.loading = false;
          console.log(err);
        },
      });
    } else {
      this.productService.addProduct({name:data.Name,categoryId:data.CategoryId,price:data.Price}).subscribe({
        next: (res: any) => {
          console.log(res);
          this.loading = false;
          this.visible = false;
          this.getProductsList();
        },
        error: (err) => {
          console.log(err);
        },
      });
    }
  }
}
