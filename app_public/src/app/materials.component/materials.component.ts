import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContentService, StudyMaterial } from '../content.service';

@Component({
  selector: 'app-materials',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './materials.component.html',
  styleUrls: ['./materials.component.css']
})
export class MaterialsComponent {
  branches = ['AI', 'AIML', 'CSE', 'CSE-DS', 'CSE-CS', 'IT', 'ECE', 'EEE'];
  years = ['I', 'II', 'III', 'IV'];
  subjects = ['DS', 'OOP', 'DBMS', 'ML', 'AI', 'Networks'];

  selectedBranch = '';
  selectedYear = '';
  selectedSubject = '';

  materials: StudyMaterial[] = [];
  message = '';

  constructor(private contentService: ContentService) {}

  fetchMaterials() {
    if (!this.selectedBranch || !this.selectedYear || !this.selectedSubject) {
      this.message = 'Please select branch, year, and subject';
      return;
    }

    this.contentService.getMaterials(this.selectedBranch, this.selectedYear, this.selectedSubject)
      .subscribe({
        next: (materials) => {
          this.materials = materials;
          this.message = materials.length ? '' : 'No files uploaded for this selection';
        },
        error: (err) => {
          console.error(err);
          this.message = 'Failed to load materials';
        }
      });
  }
}
