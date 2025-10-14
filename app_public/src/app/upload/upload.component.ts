import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContentService, StudyMaterial } from '../content.service';
import { AuthenticationService, User } from '../authentication.service';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {
  user: User | null = null;

  branches = ['AI', 'AI-ML', 'CSE', 'CSE-DS', 'CSE-CS', 'IT', 'ECE', 'EEE'];
  years = ['I', 'II', 'III', 'IV'];
  subjects: string[] = [];

  selectedBranch = '';
  selectedYear = '';
  selectedSubject = '';

  fileToUpload: File | null = null;
  message = '';
  materials: StudyMaterial[] = [];

  constructor(
    private auth: AuthenticationService,
    private contentService: ContentService
  ) {}

  ngOnInit(): void {
    this.user = this.auth.getCurrentUser();
  }

  onBranchChange(): void {
    this.selectedYear = '';
    this.selectedSubject = '';
    this.subjects = [];
    this.materials = [];

    if (this.selectedBranch === 'AI' || this.selectedBranch === 'AI-ML') {
      this.subjects = ['ML', 'DL', 'NLP'];
    } else if (this.selectedBranch.includes('CSE')) {
      this.subjects = ['DSA', 'DBMS', 'OS', 'CN'];
    } else if (this.selectedBranch === 'IT') {
      this.subjects = ['Networking', 'Web Tech'];
    } else if (this.selectedBranch === 'ECE') {
      this.subjects = ['Signals', 'Microprocessors'];
    } else if (this.selectedBranch === 'EEE') {
      this.subjects = ['Circuits', 'Control Systems'];
    }
  }

  onYearChange(): void {
    this.selectedSubject = '';
    this.materials = [];
  }

  handleFileInput(event: any): void {
    this.fileToUpload = event.target.files[0] || null;
  }

  upload(): void {
    if (!this.fileToUpload || !this.selectedBranch || !this.selectedYear || !this.selectedSubject) {
      alert('Please select a file, branch, year, and subject.');
      return;
    }

    const formData = new FormData();
    formData.append('file', this.fileToUpload);
    formData.append('branch', this.selectedBranch);
    formData.append('year', this.selectedYear);
    formData.append('subject', this.selectedSubject);
    formData.append('uploadedBy', this.user?.name || 'Faculty');

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

  fetchMaterials(): void {
    if (!this.selectedBranch || !this.selectedYear || !this.selectedSubject) {
      this.message = 'Please select Branch, Year, and Subject.';
      this.materials = [];
      return;
    }

    this.message = 'Loading materials...';
    this.contentService.getMaterials(this.selectedBranch, this.selectedYear, this.selectedSubject)
      .subscribe({
        next: (res) => {
          this.materials = res;
          this.message = res.length ? '' : 'No materials uploaded yet.';
        },
        error: (err) => {
          console.error(err);
          this.message = 'Failed to fetch materials.';
        }
      });
  }
}
