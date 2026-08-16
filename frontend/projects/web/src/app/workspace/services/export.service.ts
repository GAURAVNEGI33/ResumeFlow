import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ExportService {

  private apiUrl = `${environment.apiUrl}/export`;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  exportPdf(documentId: number, htmlContent: string): Observable<Blob> {
    return this.http.post(
      `${this.apiUrl}/pdf`,
      { documentId, htmlContent },
      { headers: this.getHeaders(), responseType: 'blob' }
    );
  }

  exportDocx(documentId: number, htmlContent: string): Observable<Blob> {
    return this.http.post(
      `${this.apiUrl}/docx`,
      { documentId, htmlContent },
      { headers: this.getHeaders(), responseType: 'blob' }
    );
  }

  // Helper — Blob se file download trigger karo
  downloadFile(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }
}
