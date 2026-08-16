import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { DocumentType } from '../workspace/models/workspace.models';

export interface DashboardStatsResponse {
  success: boolean;
  data: {
    counts: {
      documents: number;
      applications: number;
      versions: number;
      exports: number;
    };
    recentDocuments: Array<{
      id: number;
      title: string;
      type: DocumentType;
      templateId?: number;
      updatedAt: string;
      Template?: {
        name: string;
      };
    }>;
    applicationPipeline: {
      saved: number;
      applied: number;
      interview: number;
      offer: number;
      rejected: number;
    };
  };
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = `${environment.apiUrl}/dashboard`;

  constructor(private http: HttpClient) {}

  getStats(): Observable<DashboardStatsResponse> {
    return this.http.get<DashboardStatsResponse>(`${this.apiUrl}/stats`);
  }
}
