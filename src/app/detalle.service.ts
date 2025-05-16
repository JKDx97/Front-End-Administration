import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DetalleService {

  private apiUrlDetalle = 'http://localhost:3000/detalle'

  constructor(private http : HttpClient) { }

  getDetalle(venta_id : number):Observable<any[]>{
    return this.http.get<any[]>(`${this.apiUrlDetalle}/${venta_id}`)
  }
}
