import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ShareRecord } from '../models/workspace.models';

export interface PublicShareResponse {
  success: boolean;
  message?: string;
  share: {
    id: number;
    slug: string;
    createdAt: string;
    document: {
      id: number;
      title: string;
      type: string;
      createdAt: string;
      updatedAt: string;
      User?: {
        id: number;
        name: string;
        email: string;
      };
      Sections?: Array<{
        id: number;
        heading: string;
        position: number;
        isSidebar: boolean;
        Items?: Array<{
          id: number;
          content: string;
          position: number;
        }>;
      }>;
    };
  };
}

@Injectable({ providedIn: 'root' })
export class SharesService {
  private readonly apiUrl = `${environment.apiUrl}/shares`;

  constructor(private http: HttpClient) {}

  listByDocument(documentId: number): Observable<{ success: boolean; shares: ShareRecord[] }> {
    return this.http.get<{ success: boolean; shares: ShareRecord[] }>(`${this.apiUrl}/document/${documentId}`);
  }

  create(documentId: number, slug: string): Observable<{ success: boolean; share: ShareRecord }> {
    return this.http.post<{ success: boolean; share: ShareRecord }>(this.apiUrl, { documentId, slug });
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getBySlug(slug: string): Observable<PublicShareResponse> {
    return this.http.get<PublicShareResponse>(`${this.apiUrl}/public/${slug}`);
  }
}
