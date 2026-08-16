import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ItemRecord, SectionRecord, VersionRecord } from '../models/workspace.models';

@Injectable({ providedIn: 'root' })
export class EditorService {
  private readonly sectionsUrl = `${environment.apiUrl}/sections`;
  private readonly itemsUrl = `${environment.apiUrl}/items`;
  private readonly versionsUrl = `${environment.apiUrl}/versions`;
  private readonly exportUrl = `${environment.apiUrl}/export`;

  constructor(private http: HttpClient) {}

  listSections(documentId: number): Observable<{ success: boolean; sections: SectionRecord[] }> {
    return this.http.get<{ success: boolean; sections: SectionRecord[] }>(`${this.sectionsUrl}/document/${documentId}`);
  }

  createSection(data: { documentId: number; heading: string; position: number }): Observable<{ success: boolean; section: SectionRecord }> {
    return this.http.post<{ success: boolean; section: SectionRecord }>(this.sectionsUrl, data);
  }

  updateSection(id: number, data: Partial<SectionRecord>): Observable<{ success: boolean; section: SectionRecord }> {
    return this.http.put<{ success: boolean; section: SectionRecord }>(`${this.sectionsUrl}/${id}`, data);
  }

  removeSection(id: number): Observable<void> {
    return this.http.delete<void>(`${this.sectionsUrl}/${id}`);
  }

  listItems(sectionId: number): Observable<{ success: boolean; items: ItemRecord[] }> {
    return this.http.get<{ success: boolean; items: ItemRecord[] }>(`${this.itemsUrl}/section/${sectionId}`);
  }

  createItem(data: { sectionId: number; content: string; position: number }): Observable<{ success: boolean; item: ItemRecord }> {
    return this.http.post<{ success: boolean; item: ItemRecord }>(this.itemsUrl, data);
  }

  updateItem(id: number, data: Partial<ItemRecord>): Observable<{ success: boolean; item: ItemRecord }> {
    return this.http.put<{ success: boolean; item: ItemRecord }>(`${this.itemsUrl}/${id}`, data);
  }

  removeItem(id: number): Observable<void> {
    return this.http.delete<void>(`${this.itemsUrl}/${id}`);
  }

  listVersions(documentId: number): Observable<{ success: boolean; versions: VersionRecord[] }> {
    return this.http.get<{ success: boolean; versions: VersionRecord[] }>(`${this.versionsUrl}/document/${documentId}`);
  }

  createVersion(data: { documentId: number; label: string; snapshot: string }): Observable<{ success: boolean; version: VersionRecord }> {
    return this.http.post<{ success: boolean; version: VersionRecord }>(this.versionsUrl, data);
  }

  exportPdf(documentId: number): Observable<{ success: boolean; export: { fileUrl: string } }> {
    return this.http.post<{ success: boolean; export: { fileUrl: string } }>(`${this.exportUrl}/pdf`, { documentId });
  }
}
