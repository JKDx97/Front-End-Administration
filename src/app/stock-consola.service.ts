import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {environment} from './environments/environment'

@Injectable({
  providedIn: 'root'
})
export class StockConsolaService {

  private apiStockConsolaUrl = `${environment.api}/stock-consolas`

  constructor(private http : HttpClient) { }

  getAllStock(){
    return this.http.get<any[]>(this.apiStockConsolaUrl)
  }

  addStock(stockData : any):Observable<any>{
    return this.http.post<any>(`${this.apiStockConsolaUrl}` , stockData)
  }
}
