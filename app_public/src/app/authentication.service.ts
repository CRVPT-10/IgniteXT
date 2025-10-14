import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, map, throwError, firstValueFrom } from 'rxjs';

// JWT User interface
export interface User {
  _id: string;
  email: string;
  name: string;
  role: string;
  exp: number;
  iat: number;
}

// Auth response interface
export interface AuthResponse {
  token?: string;    // optional
  message?: string;  // optional
}

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private apiBaseUrl = 'http://localhost:3000/api/users';
  private token: string | null = null;

  constructor(private http: HttpClient, private router: Router) {}

  // Get token
  public getToken(): string | null {
    if (!this.token) this.token = localStorage.getItem('mean-token');
    return this.token;
  }

  // Save token
  public saveToken(token: string): void {
    localStorage.setItem('mean-token', token);
    this.token = token;
  }

  // Logout
  public logout(): void {
    this.token = null;
    localStorage.removeItem('mean-token');
    this.router.navigateByUrl('/login');
  }

  // Decode user from token
  public getCurrentUser(): User | null {
    const token = this.getToken();
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload as User;
      } catch (err) {
        console.error('Invalid token format', err);
        return null;
      }
    }
    return null;
  }

  // Check if logged in
  public isLoggedIn(): boolean {
    const user = this.getCurrentUser();
    return user ? user.exp > Date.now() / 1000 : false;
  }

  // Generic POST request for login/register
  private async request(type: 'login' | 'register', user?: any): Promise<AuthResponse> {
    try {
      const observable = this.http.post<AuthResponse>(`${this.apiBaseUrl}/${type}`, user)
        .pipe(
          map(res => {
            if (res && res.token) this.saveToken(res.token);
            return res;
          }),
          catchError((err: HttpErrorResponse) => {
            const errorResponse: AuthResponse = { message: err.error?.message || 'Server error' };
            return throwError(() => errorResponse);
          })
        );
      return await firstValueFrom(observable);
    } catch (err) {
      throw err;
    }
  }

  // Register
  public register(user: any): Promise<AuthResponse> {
    return this.request('register', user);
  }
  clearToken(): void {
  localStorage.removeItem('token');
}

  // Login
  public login(credentials: any): Promise<AuthResponse> {
    return this.request('login', credentials);
  }
}
