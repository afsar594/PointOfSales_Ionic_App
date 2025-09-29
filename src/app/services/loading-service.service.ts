import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
 
@Injectable({
  providedIn: 'root'
})
export class LoadingServiceService {

  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  constructor() { }

  showLoader() {
    this.loadingSubject.next(true);

  }

  hideLoader() {

    this.loadingSubject.next(false);
    
  }
}
 
