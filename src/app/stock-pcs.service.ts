import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StockPcsService {
  private apiStockPcUrl = 'http://localhost:3000/stock-pc';

  constructor(private http: HttpClient) {}

   getAllStock() {
    return this.http.get<any[]>(this.apiStockPcUrl);
  }

  addStock(stockData: any): Observable<any> {
    return this.http.post<any>(`${this.apiStockPcUrl}`, stockData);
  }
}
