import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TableService {
apiUrl:any;
  constructor(private httpClient: HttpClient) { 
    this.apiUrl = environment.apiURL;
  }
 getList(item: any){
  return this.httpClient.post<any[]>(this.apiUrl+"GenerallItems/GetAreaTable", item)
}

}
  