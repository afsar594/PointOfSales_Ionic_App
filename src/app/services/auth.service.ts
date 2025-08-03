import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient,
    private router: Router
  ) {
  }
login(credentials: { username: string; password: string }): Observable<any> {
    return this.http.post<any>('Auth/login', credentials).pipe(
      tap(response => {
        if (response?.isSuccess && response.data?.token) {

          localStorage.setItem('user', JSON.stringify(response.data));
          localStorage.setItem('token', response.data.token);
        }
      })
    );
  }

  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('userToken');
    this.router.navigate(['/authen/login']);

  }

  getLoggedUser() {
    return JSON.parse(localStorage.getItem('user') || '{}');
  }

  getToken() {
    return localStorage.getItem('token');
  }
}