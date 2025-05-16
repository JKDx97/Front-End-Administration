import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoginService } from '../login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  usuario: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: LoginService, private router: Router) {
    this.authService.loginStatus$.subscribe(isLoggedIn => {
      if (isLoggedIn) {
        this.errorMessage = ''; // Si el login es exitoso, limpiamos el error
        this.router.navigate(['/']);
      }
    });

    this.authService.loginError$.subscribe(error => {
      this.errorMessage = error;
    });
  }

  login() {
    this.errorMessage = ''; // Limpiar error antes de intentar loguear
    this.authService.login(this.usuario, this.password);
  }
}

