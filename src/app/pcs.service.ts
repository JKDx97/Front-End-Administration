import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {environment} from './environments/environment'

@Injectable({
  providedIn: 'root'
})
export class pcsService {

  private pcsUrl = `${environment.api}/pcs`
  private pcImagenUrl = `${environment.api}/pc_imagen`

  constructor(private http : HttpClient) { }

  getPcs(){
    return this.http.get<any[]>(`${this.pcsUrl}`)
  }

  getImagesPcs(pc_id : string){
    return this.http.get<any[]>(`${this.pcImagenUrl}/${pc_id}`)
  }

  createPcs(pcData: any):Observable<any>{
    return this.http.post<any>(`${this.pcsUrl}` , pcData)
  }

  updatePcs(id : number , laptopData : any):Observable<any>{
    return this.http.put<any>(`${this.pcsUrl}/${id}`, laptopData)
  }

  togglePcs(id : number,estado: number){
    return this.http.put(`${this.pcsUrl}/toggle/${id}` , {estado})
  }

  deletePcs(id : number){
    return this.http.delete(`${this.pcsUrl}/${id}`)
  }

  uploadImag(image: File, pcId: number): Observable<any> {
    const formData = new FormData();
    formData.append("image", image); // 🛠️ El nombre debe coincidir con el backend
    formData.append("pc_id", pcId.toString());
  
    console.log("Enviando FormData:", formData);
  
    return this.http.post<any>(`${this.pcImagenUrl}/upload`, formData);
  }
}
