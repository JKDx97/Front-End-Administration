import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { environment } from './environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private socket!: Socket;

  private loginError = new BehaviorSubject<string>(''); // Manejo de errores
  loginError$ = this.loginError.asObservable();

  private loginStatus = new BehaviorSubject<boolean>(false);
  loginStatus$ = this.loginStatus.asObservable();

  isLoggedIn: boolean = false;

  constructor() {
    this.socket = io(environment.api);

    this.socket.on('login_success', (data) => {
      console.log('✅ Inicio de sesión exitoso:', data);
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('user', JSON.stringify(data.user));
      this.loginStatus.next(true);
      this.loginError.next(''); // ← importante: limpia error
    });

    this.socket.on('login_error', (error) => {
      console.error('❌ Error en login:', error);
      this.loginStatus.next(false);
      this.loginError.next('Usuario o contraseña incorrectos'); // ← se muestra solo si falla
    });
  }

  login(usuario: string, password: string) {
    if (!this.socket.connected) {
      this.socket.connect();
    }
    this.loginError.next(''); // Limpia errores previos
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

  clearLoginError() {
    this.loginError.next('');
  }
}
