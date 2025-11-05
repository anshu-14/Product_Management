import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { FileUploadModule } from 'primeng/fileupload';
import { CategoryService } from '../../../../services/category.service';
import { MessageService } from 'primeng/api';
import { DividerModule } from 'primeng/divider';

@Component({
  selector: 'app-category-import',
  imports: [FileUploadModule, CommonModule, ButtonModule, DividerModule],
  templateUrl: './category-import.component.html',
  styleUrl: './category-import.component.scss',
  providers: [MessageService],
})
export class CategoryImportComponent {
  loading: boolean=false;
  constructor(
    private categoryService: CategoryService,
    private messageService: MessageService,
  ) {}
  onUpload(event: any) {
    const file = event.files?.[0];
    if (!file) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'No file selected',
      });
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    this.categoryService.importCategories(formData).subscribe({
      next: (res: any) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: res.message,
        });
        console.log('Import summary:', res);
      },
      error: (err: any) => {
        console.error(err);
        const msg = err.error?.message || 'File import failed';
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: msg,
        });
      },
    });
  }

  downloadReport(){
    this.categoryService.downloadSample().subscribe({
        next: (response: any) => {
          const contentDisposition = response.headers.get(
            'content-disposition',
          );
          let fileName = 'ImportSample.xlsx';
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
}
