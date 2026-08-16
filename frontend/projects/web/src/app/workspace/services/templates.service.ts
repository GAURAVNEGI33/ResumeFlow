import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { TemplateRecord } from '../models/workspace.models';

@Injectable({ providedIn: 'root' })
export class TemplatesService {
  private readonly apiUrl = `${environment.apiUrl}/templates`;

  constructor(private http: HttpClient) {}

  list(): Observable<{ success: boolean; templates: TemplateRecord[] }> {
    return this.http.get<{ success: boolean; templates: TemplateRecord[] }>(this.apiUrl);
  }

  create(data: { name: string; config: string }): Observable<{ success: boolean; template: TemplateRecord }> {
    return this.http.post<{ success: boolean; template: TemplateRecord }>(this.apiUrl, data);
  }
}
