import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VentaService {


  private apitUrlVenta = 'http://localhost:3000/venta'

  constructor(private http : HttpClient) { }

  getVentaDni( dni : any):Observable<any>{
    return this.http.get<any[]>(`${this.apitUrlVenta}/${dni}`)
  }
}
