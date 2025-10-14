import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ContentService, StudyMaterial } from '../content.service';
import { AuthenticationService, User } from '../authentication.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  user: User | null = null;
  branches = ['AI', 'AI-ML', 'CSE', 'CSE-DS', 'CSE-CS', 'IT', 'ECE', 'EEE'];
  years = ['I', 'II', 'III', 'IV'];
  subjects: string[] = [];

  selectedBranch = '';
  selectedYear = '';
  selectedSubject = '';

  materials: StudyMaterial[] = [];
  message = '';

  fileToUpload: File | null = null;

  constructor(
    private auth: AuthenticationService,
    private contentService: ContentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.user = this.auth.getCurrentUser();
  }

  // ===== Navbar logout =====
  logout(): void {
    this.auth.clearToken();         // Clear JWT/session
    this.router.navigate(['/']);     // Redirect to login
  }

  onBranchChange(): void {
    this.selectedYear = '';
    this.selectedSubject = '';
    this.subjects = [];
    this.materials = [];

    switch (this.selectedBranch) {
      case 'AI':
      case 'AI-ML':
        this.subjects = ['ML', 'DL', 'NLP'];
        break;
      case 'CSE':
      case 'CSE-DS':
      case 'CSE-CS':
        this.subjects = ['DSA', 'DBMS', 'OS', 'CN'];
        break;
      case 'IT':
        this.subjects = ['Networking', 'Web Tech'];
        break;
      case 'ECE':
        this.subjects = ['Signals', 'Microprocessors'];
        break;
      case 'EEE':
        this.subjects = ['Circuits', 'Control Systems'];
        break;
      default:
        this.subjects = [];
    }
  }

  onYearChange(): void {
    this.selectedSubject = '';
    this.materials = [];
  }

  fetchMaterials(): void {
    if (!this.selectedBranch || !this.selectedYear || !this.selectedSubject) {
      this.message = 'Please select Branch, Year, and Subject.';
      this.materials = [];
      return;
    }
    this.message = 'Loading materials...';
    this.contentService.getMaterials(this.selectedBranch, this.selectedYear, this.selectedSubject)
      .subscribe({
        next: (materials) => {
          this.materials = materials;
          this.message = materials.length ? '' : 'No materials uploaded yet.';
        },
        error: (err) => {
          console.error(err);
          this.message = 'Failed to load materials.';
        }
      });
  }

  handleFileInput(event: any): void {
    this.fileToUpload = event.target.files[0] || null;
  }

  upload(): void {
    if (!this.fileToUpload || !this.selectedBranch || !this.selectedYear || !this.selectedSubject || !this.user) {
      alert('Please select a file, branch, year, and subject.');
      return;
    }

    const formData = new FormData();
    formData.append('file', this.fileToUpload);
    formData.append('branch', this.selectedBranch);
    formData.append('year', this.selectedYear);
    formData.append('subject', this.selectedSubject);
    formData.append('uploadedBy', this.user._id);

    this.contentService.uploadMaterial(formData).subscribe({
      next: () => {
        alert('File uploaded successfully!');
        this.fileToUpload = null;
        this.fetchMaterials();
      },
      error: (err) => {
        console.error(err);
        alert('File upload failed.');
      }
    });
  }

  // ===== Download Material =====
  downloadMaterial(material: StudyMaterial): void {
  if (!material._id) return;

  this.contentService.downloadMaterial(material._id).subscribe({
    next: (blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = material.filename; // Use original filename
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    },
    error: (err) => {
      console.error('Download error:', err);
      alert('Download failed.');
    }
  });
}
}
