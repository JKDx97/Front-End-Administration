import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {environment} from './environments/environment'

@Injectable({
  providedIn: 'root'
})
export class PedidosService {

  private apiUrlStock = `${environment.api}/pedidos`

  constructor(private http : HttpClient) { }

  getAllPedidos(){
    return this.http.get<any[]>(this.apiUrlStock)
  }
}
