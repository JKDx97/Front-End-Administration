import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {environment} from './environments/environment'

@Injectable({
  providedIn: 'root',
})
export class StockPcsService {
  private apiStockPcUrl = `${environment.api}/stock-pc`

  constructor(private http: HttpClient) {}

   getAllStock() {
    return this.http.get<any[]>(this.apiStockPcUrl);
  }

  addStock(stockData: any): Observable<any> {
    return this.http.post<any>(`${this.apiStockPcUrl}`, stockData);
  }
}
