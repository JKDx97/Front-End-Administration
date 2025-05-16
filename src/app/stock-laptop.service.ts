import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StockLaptopService {
  private apiStockLaptopUrl = 'http://localhost:3000/stock-laptop';

  constructor(private http: HttpClient) {}

  getAllStock() {
    return this.http.get<any[]>(this.apiStockLaptopUrl);
  }

  addStock(stockData: any): Observable<any> {
    return this.http.post<any>(`${this.apiStockLaptopUrl}`, stockData);
  }
}
