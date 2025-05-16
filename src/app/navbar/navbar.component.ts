import { Component, ElementRef, ViewChild } from '@angular/core';
import { LoginService } from '../login.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  @ViewChild('navbarNav') navbarNav!: ElementRef;
  isNavbarOpen = false;

  constructor(private loginService: LoginService, private router: Router) {}

  toggleNavbar() {
    this.isNavbarOpen = !this.isNavbarOpen;
  }

  closeNavbar() {
    this.isNavbarOpen = false;
  }

  logout(): void {
    this.loginService.logout();
    this.router.navigate(['/login']);
  }
}
