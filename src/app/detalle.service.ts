import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {environment} from './environments/environment'

@Injectable({
  providedIn: 'root'
})
export class DetalleService {

  private apiUrlDetalle = `${environment.api}/detalle`

  constructor(private http : HttpClient) { }

  getDetalle(venta_id : number):Observable<any[]>{
    return this.http.get<any[]>(`${this.apiUrlDetalle}/${venta_id}`)
  }
}
