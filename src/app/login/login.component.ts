import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoginService } from '../login.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  usuario: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: LoginService, private router: Router) {}

  ngOnInit() {
    this.authService.loginStatus$.subscribe((isLoggedIn) => {
      if (isLoggedIn) {
        Swal.close();
        this.errorMessage = '';
        this.authService.clearLoginError(); // limpia error
        Swal.fire({
          icon: 'success',
          title: '¡Bienvenido!',
          text: 'Has iniciado sesión correctamente.',
          timer: 1500,
          showConfirmButton: false,
        }).then(() => {
          this.router.navigate(['/']);
        });
      }
    });

    this.authService.loginError$.subscribe((error) => {
      if (error) {
        Swal.close();
        this.errorMessage = error;
        Swal.fire({
          icon: 'error',
          title: 'Error al iniciar sesión',
          text: error,
          confirmButtonColor: '#d33',
        });
      }
    });
  }

  login() {
    Swal.fire({
      title: 'Ingresando...',
      text: 'Por favor espera',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    this.authService.login(this.usuario, this.password);
  }
}
