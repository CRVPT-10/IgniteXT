import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common'; // <-- Import CommonModule

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule], // <-- Add CommonModule here
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerCredentials = { name: '', email: '', password: '', role: '' };
  errorMessage = '';

  constructor(private http: HttpClient, private router: Router) {}

  onRegisterSubmit(form: NgForm) {
    if (!form.valid) {
      this.errorMessage = 'Please fill all fields correctly.';
      return;
    }

    this.http.post<any>('http://localhost:3000/api/users/register', this.registerCredentials)
      .subscribe({
        next: (res) => {
          alert(res.message || 'Registered successfully');
          this.router.navigate(['/login']);
        },
        error: (err) => {
          this.errorMessage = err.error.message || 'Registration failed';
        }
      });
  }
}
