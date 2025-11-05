import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../Environments/environment';
@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  constructor(private http: HttpClient) {}

  getCategoryById(id: any) {
    return this.http.get(`${environment.apiUrl}/categories/${id}`);
  }

  getCategories(params: {
    page: number;
    pageSize: number;
    orderBy: string;
    orderDir: 'ASC' | 'DESC';
    search?: string;
    isActive?: boolean | null;
    isExport?: boolean;
  }) {
    return this.http.get(`${environment.apiUrl}/categories`, {
      params: params as any,
    });
  }

  downloadReport(params: {
    page: number;
    pageSize: number;
    orderBy: string;
    orderDir: 'ASC' | 'DESC';
    search?: string;
    isActive?: boolean | null;
    isExport?: boolean;
  })
  {
     return this.http.get(`${environment.apiUrl}/categories`, {
      params: params as any,responseType: 'blob',      // CRITICAL: tell Angular it's a file
      observe: 'response'
    });

  }


  updateCategory(id:any,data: any) {
    return this.http.put(`${environment.apiUrl}/categories/${id}`,data);
  }

  toggleStatus(id:any,data: any) {
    return this.http.patch(`${environment.apiUrl}/categories/${id}/toggle`,data);
  }
  addCategory(data: any)
  {
     return this.http.post(`${environment.apiUrl}/categories`,data);
  }
  deleteCategory(id:any) {
    return this.http.delete(`${environment.apiUrl}/categories/${id}`);
  }

  importCategories(formData: FormData) {
    return this.http.post<any>(`${environment.apiUrl}/categories/import`, formData);
  }

  downloadSample()
  {
     return this.http.get(`${environment.apiUrl}/categories/sample`, {responseType: 'blob',      // CRITICAL: tell Angular it's a file
      observe: 'response'
    });

  }
}
