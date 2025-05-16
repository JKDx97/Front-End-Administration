import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {environment} from './environments/environment'

@Injectable({
  providedIn: 'root'
})
export class VentaService {


  private apitUrlVenta = `${environment.api}/venta`

  constructor(private http : HttpClient) { }

  getVentaDni( dni : any):Observable<any>{
    return this.http.get<any[]>(`${this.apitUrlVenta}/${dni}`)
  }
}
