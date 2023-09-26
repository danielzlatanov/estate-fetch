import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { IEstate } from '../shared/interfaces/estate';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EstateService {
  private baseUrl = 'https://estate-fetch-api.vercel.app';

  constructor(private http: HttpClient) {}

  scrape(): Observable<object> {
    return this.http.get(`${this.baseUrl}/api/scrape`);
  }

  getData(): Observable<IEstate[]> {
    return this.http.get<IEstate[]>(`${this.baseUrl}/api/estates`);
  }

  searchEstates(query: string): Observable<IEstate[]> {
    const params = new HttpParams().set('keywords', query);
    return this.http.get<IEstate[]>(`${this.baseUrl}/api/estates/search`, {
      params,
    });
  }

  getEstateById(id: string): Observable<IEstate> {
    return this.http.get<IEstate>(`${this.baseUrl}/api/estates/${id}`);
  }
}
