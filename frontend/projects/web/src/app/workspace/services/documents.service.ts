import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DocumentRecord, DocumentType } from '../models/workspace.models';

interface DocumentsResponse {
  success: boolean;
  documents: DocumentRecord[];
}

interface DocumentResponse {
  success: boolean;
  document: DocumentRecord;
}

@Injectable({ providedIn: 'root' })
export class DocumentsService {
  private readonly apiUrl = `${environment.apiUrl}/documents`;

  constructor(private http: HttpClient) {}

  list(): Observable<DocumentsResponse> {
    return this.http.get<DocumentsResponse>(this.apiUrl);
  }

  get(id: number): Observable<DocumentResponse> {
    return this.http.get<DocumentResponse>(`${this.apiUrl}/${id}`);
  }

  create(data: { title: string; type: DocumentType; templateId?: number | null }): Observable<DocumentResponse> {
    return this.http.post<DocumentResponse>(this.apiUrl, data);
  }

  update(id: number, data: Partial<Pick<DocumentRecord, 'title' | 'type' | 'templateId'>>): Observable<DocumentResponse> {
    return this.http.put<DocumentResponse>(`${this.apiUrl}/${id}`, data);
  }

  duplicate(id: number): Observable<DocumentResponse> {
    return this.http.post<DocumentResponse>(`${this.apiUrl}/${id}/duplicate`, {});
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
