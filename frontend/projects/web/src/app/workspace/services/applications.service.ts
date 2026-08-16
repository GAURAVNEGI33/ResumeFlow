import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApplicationRecord, ApplicationStatus } from '../models/workspace.models';

@Injectable({ providedIn: 'root' })
export class ApplicationsService {
  private readonly apiUrl = `${environment.apiUrl}/applications`;

  constructor(private http: HttpClient) {}

  list(): Observable<{ success: boolean; applications: ApplicationRecord[] }> {
    return this.http.get<{ success: boolean; applications: ApplicationRecord[] }>(this.apiUrl);
  }

  create(data: { company: string; role: string; status: ApplicationStatus; documentId: number }): Observable<{ success: boolean; application: ApplicationRecord }> {
    return this.http.post<{ success: boolean; application: ApplicationRecord }>(this.apiUrl, data);
  }

  update(id: number, data: Partial<ApplicationRecord>): Observable<{ success: boolean; application: ApplicationRecord }> {
    return this.http.put<{ success: boolean; application: ApplicationRecord }>(`${this.apiUrl}/${id}`, data);
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
