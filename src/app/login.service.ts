import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private socket!: Socket;
  private loginError = new BehaviorSubject<string>(''); // Nuevo BehaviorSubject para errores
  loginError$ = this.loginError.asObservable(); // Observable de errores

  isLoggedIn: boolean = false;

  private loginStatus = new BehaviorSubject<boolean>(false);
  loginStatus$ = this.loginStatus.asObservable();


  constructor() {
    this.socket = io('http://localhost:3000');

    this.socket.on('login_success', (data) => {
      console.log('✅ Inicio de sesión exitoso:', data);
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('user', JSON.stringify(data.user));
      this.loginStatus.next(true);
      this.loginError.next(''); 
    });

    this.socket.on('login_error', (error) => {
      console.error('❌ Error en login:', error);
      this.loginStatus.next(false);
      this.loginError.next('Usuario o contraseña incorrectos'); 
    });
  }
  login(usuario: string, password: string) {
    if (!this.socket.connected) {
      this.socket.connect(); 
    }
    this.loginError.next(''); 
    this.socket.emit('login', { usuario, password });
  }
  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('isLoggedIn'); 
    this.loginStatus.next(false);
    this.socket.disconnect();
  }
  isAuthenticated(): boolean {
    const storedStatus = localStorage.getItem('isLoggedIn');
    return storedStatus === 'true';
  }
}
