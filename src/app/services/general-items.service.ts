import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GeneralItemsService {
  constructor(private httpClient: HttpClient) {}

  GetAreaTable(reqG: any) {
    return this.httpClient.post<any[]>('GeneralItems/GetAreaTable', reqG);
  }

  GetCategoryWithItems(payload: any) {
    return this.httpClient.post<any[]>(
      'GeneralItems/GetCategoryWithItems',
      payload
    );
  }

  GetGeneralItems(payload: any) {
    return this.httpClient.post<any[]>('GeneralItems/GetGeneralItems', payload);
  }
  createOrder(order: any): Observable<any> {
    return this.httpClient.post<any>(`Orders`, order);
  }

  getAllOrders(payload: any): Observable<any> {
    return this.httpClient.post<any>(`Orders/GetAll`, payload);
  }
  updateOrder(id: number, order: any): Observable<any> {
    return this.httpClient.post<any>(`Orders/${id}`, order);
  }
}
