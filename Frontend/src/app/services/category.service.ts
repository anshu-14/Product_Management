import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../Environments/environment';
@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private http: HttpClient) { }

  getCategoryById(id: any) {
    return this.http.get(`${environment.apiUrl}/categories/${id}`);
  }

  getCategories(){
    return this.http.get(`${environment.apiUrl}/categories`);
  }
}
