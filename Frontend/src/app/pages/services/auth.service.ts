import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../Environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  signUp(data: any) {
    return this.http.post(`${environment.apiUrl}/auth/register`, data);
  }

  login(data: any) {
    return this.http.post(`${environment.apiUrl}/auth/login`, data);
  }

  vertifyOtp(data: any) {
    return this.http.post(`${environment.apiUrl}/auth/verify-otp`, data);
  }

  getToken() {
    return localStorage.getItem('token');
  }
  setToken(token: string) {
    localStorage.setItem('token', token);
  }

  getCategoryById()
  {
    return this.http.get(`${environment.apiUrl}/categories/1`);
  }

  clearToken() {
    localStorage.removeItem('token');
  }
  isAuthenticated() {
    if (localStorage.getItem('IsAuthicated')) {
      const value = localStorage.getItem('IsAuthicated');
      return value == 'true';
    } else {
      return false;
    }
  }
}
