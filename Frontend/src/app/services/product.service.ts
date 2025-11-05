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
}
