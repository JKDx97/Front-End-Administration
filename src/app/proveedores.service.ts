import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {environment} from './environments/environment'

@Injectable({
  providedIn: 'root'
})
export class ProveedoresService {

  private ApiProveedoresUrl = `${environment.api}/proveedor`

  constructor(private http : HttpClient) { }

  getAllProveedores(){
    return this.http.get<any[]>(this.ApiProveedoresUrl)
  }
  getByIdProveedor(id : number){
    return this.http.get<any[]>(`${this.ApiProveedoresUrl}/${id}`)
  }
  getStateProveedores(){
    return this.http.get<any[]>(`${this.ApiProveedoresUrl}/aviable`)
  }
  createProveedor(proveedorData : any):Observable<any>{
    return this.http.post<any>(`${this.ApiProveedoresUrl}/` , proveedorData)
  }
  updateProveedor(id : number , proveedorData : any):Observable<any>{
    return this.http.put<any>(`${this.ApiProveedoresUrl}/${id}`, proveedorData)
  }
  updateStateProveedor(id : number , estado : number){
    return this.http.put(`${this.ApiProveedoresUrl}/toggle/${id}` , {estado})
  }
  deleteProveedor(id : number){
    return this.http.delete(`${this.ApiProveedoresUrl}/${id}`)
  }
}
