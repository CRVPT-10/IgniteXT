import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { AuthenticationService, AuthResponse, User } from '../authentication.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, HttpClientModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginCredentials = { email: '', password: '' };
  registerCredentials = { name: '', email: '', password: '', role: '' };
  isRightPanelActive = false; // For overlay toggle

  constructor(private authService: AuthenticationService, private router: Router) {}

  // Toggle between login and register panel
  togglePanel() {
    this.isRightPanelActive = !this.isRightPanelActive;
  }

  // Login
  async onLoginSubmit() {
    try {
      const res: AuthResponse = await this.authService.login(this.loginCredentials);

      if (res && res.token) {
        this.authService.saveToken(res.token);

        // Decode user to decide route
        const user: User | null = this.authService.getCurrentUser();
        console.log('Logged in user:', user);

        if (!user) {
          alert('Invalid token, cannot get user info');
          return;
        }

        // Navigate based on role
        switch (user.role) {
          case 'faculty':
            this.router.navigate(['/dashboard']);
            break;
          case 'student':
            this.router.navigate(['/browse']);
            break;
          default:
            this.router.navigate(['/home']);
            break;
        }

      } else {
        alert(res.message || 'Login failed');
      }

    } catch (err: any) {
      console.error('Login error:', err);
      alert(err.message || 'Login failed');
    }
  }

  // Register
  async onRegisterSubmit() {
    if (!this.registerCredentials.role) {
      alert('Please select a role (Student or Faculty)');
      return;
    }

    try {
      const res: AuthResponse = await this.authService.register(this.registerCredentials);
      alert(res.message || 'Registered successfully!');
      this.togglePanel(); // Switch to login panel after registration
    } catch (err: any) {
      console.error('Registration error:', err);
      alert(err.message || 'Registration failed');
    }
  }
}
