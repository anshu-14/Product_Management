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

  getProducts(){
    return this.http.get(`${environment.apiUrl}/products`);
  }
}
