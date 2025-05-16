import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PedidosService {

  private apiUrlStock = 'http://localhost:3000/pedidos'

  constructor(private http : HttpClient) { }

  getAllPedidos(){
    return this.http.get<any[]>(this.apiUrlStock)
  }
}
