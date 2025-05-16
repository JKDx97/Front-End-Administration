import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {environment} from './environments/environment'

@Injectable({
  providedIn: 'root',
})
export class StockLaptopService {
  private apiStockLaptopUrl = `${environment.api}/stock-laptop`

  constructor(private http: HttpClient) {}

  getAllStock() {
    return this.http.get<any[]>(this.apiStockLaptopUrl);
  }

  addStock(stockData: any): Observable<any> {
    return this.http.post<any>(`${this.apiStockLaptopUrl}`, stockData);
  }
}
