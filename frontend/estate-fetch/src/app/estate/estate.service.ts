import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IEstate } from '../shared/interfaces/estate';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EstateService {
  private baseUrl = 'http://localhost:8000';

  constructor(private http: HttpClient) {}

  scrape(): any {
    return this.http.get(`${this.baseUrl}/api/scrape`);
  }

  getData(): Observable<IEstate[]> {
    return this.http.get<IEstate[]>(`${this.baseUrl}/api/estates`);
  }
}
