import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent
} from '@angular/common/http';
import { catchError, finalize, map, Observable, throwError } from 'rxjs';
import { UtilityService } from '../services/utility.service';
import { LoadingServiceService } from '../services/loading-service.service';
import { environment } from 'src/environments/environment';
import { ToastService } from '../services/toast.service';
import { Router } from '@angular/router';

@Injectable()

export class ApplicationInterceptor implements HttpInterceptor {
  constructor(
    private utilityService: UtilityService,
    private loaderService: LoadingServiceService,
    private toastService: ToastService,
    private route: Router
  ) { }
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    const token: any = this.utilityService.GetAuthToken();

    // Attach token if available
    if (token) {
      request = request.clone({
        url: environment.apiURL + request.url,
        setHeaders: { Authorization: `Bearer ${token}` }
      });
    } else {
      request = request.clone({
        url: environment.apiURL + request.url
      });
    }

    this.loaderService.showLoader();

    return next.handle(request).pipe(
  map(event => event),
  catchError(err => {
    if (err.status === 401) {
      // Navigate to login
      this.route.navigate(['authen/login']);

      // Show Ionic Toast (already async internally, no need to await here)
      this.toastService.show('You are unauthorized to perform this action.', 'danger');

      localStorage.clear();
    }

    const error = err.message || err.statusText;
    return throwError(() => error);
  }),
  finalize(() => this.loaderService.hideLoader())
);

  }
}

