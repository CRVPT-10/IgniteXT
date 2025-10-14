import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService, User } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private auth: AuthenticationService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const user: User | null = this.auth.getCurrentUser();

    if (!user || !this.auth.isLoggedIn()) {
      // Not logged in → redirect to login
      this.router.navigate(['/']);
      return false;
    }

    // Optional: role-based route protection
    const allowedRoles: string[] = route.data['roles'] || [];

    if (allowedRoles.length && !allowedRoles.includes(user.role)) {
      // Redirect based on role
      if (user.role === 'faculty') {
        this.router.navigate(['/dashboard']);
      } else if (user.role === 'student') {
        this.router.navigate(['/browse']);
      } else {
        this.router.navigate(['/home']);
      }
      return false;
    }

    return true;
  }
}
