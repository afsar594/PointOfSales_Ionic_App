import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { UtilityService } from '../services/utility.service';
import { Router } from '@angular/router';

@Injectable()
export class ApplicationInterceptor implements HttpInterceptor {
  constructor(
    private utilityService: UtilityService,
    private router: Router
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = this.utilityService.GetAuthToken(); 

    const clonedRequest = token
      ? req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`
          }
        })
      : req;

    return next.handle(clonedRequest);
  }
}
