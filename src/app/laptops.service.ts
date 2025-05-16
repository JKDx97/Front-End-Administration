import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LaptopsService {

  private laptopsUrl = 'http://localhost:3000/laptop'
  private laptopsImageUrl = 'http://localhost:3000/laptops_image'

  constructor(private http : HttpClient) { }

  getLaptops(){
    return this.http.get<any[]>(`${this.laptopsUrl}`)
  }

  getImagesLaptops(laptop_id: string){
    return this.http.get<any[]>(`${this.laptopsImageUrl}/${laptop_id}`)
  }

  createLaptops(laptopData: any):Observable<any>{
    return this.http.post<any>(`${this.laptopsUrl}` , laptopData)
  }

  updateLaptop(id: string, laptopData: any): Observable<any>{
    return this.http.put<any>(`${this.laptopsUrl}/${id}`, laptopData)
  }
  
  toggleLaptop(id: string, estado: number){
    return this.http.put(`${this.laptopsUrl}/toggle/${id}`, { estado })
  }
  
  deleteLaptop(id: string){
    return this.http.delete(`${this.laptopsUrl}/${id}`)
  }
  
  uploadImag(image: File, id: number): Observable<any> {
    const formData = new FormData();
    formData.append("image", image);
    formData.append("laptop_id", id.toString());
    console.log("Enviando FormData:", formData);
    return this.http.post<any>(`${this.laptopsImageUrl}/upload`, formData);
  }
}
