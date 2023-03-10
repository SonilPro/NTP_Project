import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from "rxjs";
import {AuthService} from './auth/auth.service';


@Injectable({providedIn: 'root'})
export class AuthenticationGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    console.log(this.authService.isAuthenticated());

    if (this.authService.isAuthenticated())
      return true;

    this.router.navigate(['/login']);
    return false;
  }
}
