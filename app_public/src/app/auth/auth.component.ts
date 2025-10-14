import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {
  isRightPanelActive = false;

  registerCredentials = { name: '', email: '', password: '', role: '' };
  loginCredentials = { email: '', password: '' };

  registerMessage = '';
  loginMessage = '';

  constructor(private http: HttpClient) {}

  togglePanel() {
    this.isRightPanelActive = !this.isRightPanelActive;
  }

  onRegisterSubmit() {
    this.http.post<any>('http://localhost:3000/api/register', this.registerCredentials)
      .subscribe({
        next: (res) => this.registerMessage = res.message || 'Registration successful!',
        error: (err) => this.registerMessage = err.error?.message || 'Registration failed!'
      });
  }

  onLoginSubmit() {
    this.http.post<any>('http://localhost:3000/api/login', this.loginCredentials)
      .subscribe({
        next: (res) => {
          localStorage.setItem('token', res.token);
          this.loginMessage = 'Login successful!';
        },
        error: (err) => this.loginMessage = err.error?.message || 'Login failed!'
      });
  }
}
