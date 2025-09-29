import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GeneralItemsService {
  

  constructor(private httpClient: HttpClient) { }

  GetAreaTable(reqG: any) {
    return this.httpClient.post<any[]>( "GeneralItems/GetAreaTable", reqG);

  }

  GetCategoryWithItems(payload : any) {
    return this.httpClient.post<any[]>("GeneralItems/GetCategoryWithItems", payload);

  }

  GetGeneralItems(payload : any) {
    return this.httpClient.post<any[]>("GeneralItems/GetGeneralItems", payload);

  }
}
