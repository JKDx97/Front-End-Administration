import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LoginService } from './login.service';


export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(LoginService)
  const router = inject(Router)

  const isAuthenticated = authService.isAuthenticated()

  if(!isAuthenticated){
    router.navigate(['/login'])
    return false
  }
  return true
};
