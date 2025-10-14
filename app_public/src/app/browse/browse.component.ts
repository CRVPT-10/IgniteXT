import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { ContentService, StudyMaterial } from '../content.service';
import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-browse',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.css']
})
export class BrowseComponent implements OnInit {
  branches = ['AI', 'AI-ML', 'CSE', 'CSE-DS', 'CSE-CS', 'IT', 'ECE', 'EEE'];
  years = ['I', 'II', 'III', 'IV'];
  subjects: string[] = [];

  selectedBranch = '';
  selectedYear = '';
  selectedSubject = '';

  uploadedMaterials: StudyMaterial[] = [];

  constructor(
    private contentService: ContentService,
    private authService: AuthenticationService, // ✅ Injected
    private router: Router                       // ✅ Injected
  ) {}

  ngOnInit(): void {}

  selectBranch(branch: string) {
    this.selectedBranch = branch;
    this.selectedYear = '';
    this.selectedSubject = '';
    this.uploadedMaterials = [];
    this.subjects = [];

    // Example subject mapping
    if (branch === 'AI' || branch === 'AI-ML') this.subjects = ['ML', 'DL', 'NLP'];
    else if (branch.includes('CSE')) this.subjects = ['DSA', 'DBMS', 'OS', 'CN'];
    else if (branch === 'IT') this.subjects = ['Networking', 'Web Tech'];
    else if (branch === 'ECE') this.subjects = ['Signals', 'Microprocessors'];
    else if (branch === 'EEE') this.subjects = ['Circuits', 'Control Systems'];
  }

  selectYear(year: string) {
    this.selectedYear = year;
    this.selectedSubject = '';
    this.uploadedMaterials = [];
  }

  selectSubject(subject: string) {
    this.selectedSubject = subject;
    this.uploadMaterials();
  }

  logout() {
    this.authService.clearToken(); // Clear stored JWT
    this.router.navigate(['/']);    // Redirect to login page
  }

  uploadMaterials() {
    if (!this.selectedBranch || !this.selectedYear || !this.selectedSubject) return;

    this.contentService
      .getMaterials(this.selectedBranch, this.selectedYear, this.selectedSubject)
      .subscribe({
        next: (materials) => this.uploadedMaterials = materials,
        error: (err) => {
          console.error(err);
          this.uploadedMaterials = [];
        }
      });
  }
}
