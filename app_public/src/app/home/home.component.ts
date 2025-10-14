import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthenticationService } from '../authentication.service';
import { HttpClientModule, HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  branches = [
    'AI', 'AIML', 'CSE', 'CSE-DS', 'CSE-CS', 'IT', 'ECE', 'EEE', 'ME', 'CE', 'BT'
  ];
  years = ['I', 'II', 'III', 'IV'];
  subjects: string[] = [];
  selectedBranch: string | null = null;
  selectedYear: string | null = null;
  selectedSubject: string | null = null;

  uploadedMaterials: { name: string, type: string, url: string }[] = [];

  constructor(
    private auth: AuthenticationService,
    private router: Router,
    private http: HttpClient
  ) {
    // Redirect if not logged in
    if (!this.auth.isLoggedIn()) {
      alert('You are not logged in. Redirecting to login...');
      this.router.navigate(['/login']);
    }
  }

  logout() {
    this.auth.logout();
  }

  selectBranch(branch: string) {
    this.selectedBranch = branch;
    this.selectedYear = null;
    this.selectedSubject = null;
    this.subjects = [];
    this.uploadedMaterials = [];
  }

  selectYear(year: string) {
    this.selectedYear = year;
    this.selectedSubject = null;
    this.subjects = this.getSubjectsForBranchYear(this.selectedBranch!, this.selectedYear);
    this.uploadedMaterials = [];
  }

  selectSubject(subject: string) {
    this.selectedSubject = subject;
    this.loadMaterials(this.selectedBranch!, this.selectedYear!, subject);
  }

  getSubjectsForBranchYear(branch: string, year: string): string[] {
    // Replace with your subjects per branch/year
    return ['Mathematics', 'Physics', 'Chemistry', 'Programming', 'Data Structures', 'DBMS', 'Networking'];
  }

  loadMaterials(branch: string, year: string, subject: string) {
    // Fetch uploaded PDFs/PPTs from backend
    this.http.get<{ name: string, type: string, url: string }[]>(
      `http://localhost:3000/api/materials?branch=${branch}&year=${year}&subject=${subject}`,
      {
        headers: {
          Authorization: `Bearer ${this.auth.getToken() || ''}`
        }
      }
    ).subscribe({
      next: (res) => this.uploadedMaterials = res,
      error: (err) => {
        console.error(err);
        alert('Failed to load materials');
      }
    });
  }
}
