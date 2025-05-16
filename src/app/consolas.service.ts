import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConsolasService {

  private consolasUrl = 'http://localhost:3000/consola'
  private consolaImagenUrl = 'http://localhost:3000/consolas_image'

  constructor(private http: HttpClient) { }

  getAllConsolas(): Observable<any> {
    return this.http.get(`${this.consolasUrl}`);
  }

  // Obtener consolas disponibles
  getAvailableConsolas(): Observable<any> {
    return this.http.get(`${this.consolasUrl}/available`);
  }

  getImagesConsola(consola_id : string){
    return this.http.get<any[]>(`${this.consolaImagenUrl}/${consola_id}`)
  }

  // Obtener una consola por ID
  getConsolaById(id: number): Observable<any> {
    return this.http.get(`${this.consolasUrl}/${id}`);
  }

  // Crear una consola
  createConsola(consola: any): Observable<any> {
    return this.http.post(`${this.consolasUrl}`, consola);
  }

  // Actualizar una consola
  updateConsola(id: number, consola: any): Observable<any> {
    return this.http.put(`${this.consolasUrl}/${id}`, consola);
  }

  // Eliminar una consola
  deleteConsola(id: number): Observable<any> {
    return this.http.delete(`${this.consolasUrl}/${id}`);
  }

  // Cambiar el estado de una consola (habilitar/deshabilitar)
  toggleConsolaState(id: number, estado: number): Observable<any> {
    return this.http.put(`${this.consolasUrl}/toggle/${id}`, { estado });
  }



  uploadImag(image: File, consolaId: number): Observable<any> {
    const formData = new FormData();
    formData.append("image", image); // 🛠️ El nombre debe coincidir con el backend
    formData.append("consola_id", consolaId.toString());
  
    console.log("Enviando FormData:", formData);
  
    return this.http.post<any>(`${this.consolaImagenUrl}/upload`, formData);
  }
}
