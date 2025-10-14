import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface StudyMaterial {
  _id?: string;           // Add _id to match backend
  filename: string;
  url?: string;           // optional, because backend serves download via ID
  branch: string;
  year: string;
  subject: string;
  uploadedBy: string;
  uploadedAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class ContentService {
  private baseUrl = 'http://localhost:3000/api/materials';

  constructor(private http: HttpClient) {}

  // Get materials filtered by optional branch, year, subject
  getMaterials(branch?: string, year?: string, subject?: string): Observable<StudyMaterial[]> {
    const params: any = {};
    if (branch) params.branch = branch;
    if (year) params.year = year;
    if (subject) params.subject = subject;
    return this.http.get<StudyMaterial[]>(this.baseUrl, { params });
  }

  // Upload file
  uploadMaterial(formData: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/upload`, formData);
  }

  // Download material by ID
  downloadMaterial(materialId: string): Observable<Blob> {
  return this.http.get(`http://localhost:3000/api/materials/download/${materialId}`, { responseType: 'blob' });
}


  // Optional: get all resources (unfiltered)
  getResources(): Observable<StudyMaterial[]> {
    return this.http.get<StudyMaterial[]>(this.baseUrl);
  }
}
