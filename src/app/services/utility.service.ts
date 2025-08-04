import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {

constructor(private route: Router, private http: HttpClient,private router: Router ) { }

  GetAuthToken() {
    return localStorage.getItem('userToken')
  }
  SetLoginData(authData: any) {
    
    localStorage.setItem('userId', authData?.id);
    localStorage.setItem('userName', authData?.userName );
    localStorage.setItem('userEmail', authData?.email);
    localStorage.setItem('userToken', authData?.token);
    // localStorage.setItem('userRole', authData?.Role);
  }
  GetUserId() {
    return localStorage.getItem('userId')
  }
  GetUserName() {
    return localStorage.getItem('userName')
  }
  GetUserEmail() {
    return localStorage.getItem('userEmail')
  }
  GetUserRole() {
    return localStorage.getItem('userRole')
  }
}
