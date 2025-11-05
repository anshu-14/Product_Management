import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../Environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
constructor(private http: HttpClient) { }

  getProductById(id: any) {
    return this.http.get(`${environment.apiUrl}/products/${id}`);
  }

  getProducts(params: {
  page: number;
  pageSize: number;
  orderBy: string;
  orderDir: 'ASC' | 'DESC';
  search?: string;
  isActive?: boolean | null;
}){
    return this.http.get(`${environment.apiUrl}/products`,{ params: params as any });
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
     return this.http.get(`${environment.apiUrl}/products`, {
      params: params as any,responseType: 'blob',      // CRITICAL: tell Angular it's a file
      observe: 'response'
    });

  }


  updateProduct(id:any,data: any) {
    return this.http.put(`${environment.apiUrl}/products/${id}`,data);
  }

  toggleStatus(id:any,data: any) {
    return this.http.patch(`${environment.apiUrl}/products/${id}/toggle`,data);
  }
  addProduct(data: any)
  {
     return this.http.post(`${environment.apiUrl}/products`,data);
  }
  deleteProduct(id:any) {
    return this.http.delete(`${environment.apiUrl}/products/${id}`);
  }
}
