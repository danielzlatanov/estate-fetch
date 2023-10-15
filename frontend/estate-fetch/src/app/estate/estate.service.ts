import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { IEstate } from '../shared/interfaces/estate';
import { Observable } from 'rxjs';
import { ICatalogResponse } from '../shared/interfaces/catalogResponse';

@Injectable({
  providedIn: 'root',
})
export class EstateService {
  private baseUrl = 'https://estate-fetch-api.vercel.app';
  // private baseUrl = 'http://localhost:8000';

  constructor(private http: HttpClient) {}

  //!
  // scrape(): Observable<object> {
  //   return this.http.get(`${this.baseUrl}/api/scrape`);
  // }

  getEstates(
    page: number,
    perPage?: number,
    query?: string
  ): Observable<ICatalogResponse> {
    let params = new HttpParams().set('page', page.toString());

    if (perPage) {
      params = params.set('perPage', perPage.toString());
    }

    if (query) {
      params = params.set('keywords', query);
    }

    const url = query
      ? `${this.baseUrl}/api/estates/search`
      : `${this.baseUrl}/api/estates`;

    return this.http.get<ICatalogResponse>(url, {
      params,
    });
  }

  getEstateById(id: string): Observable<IEstate> {
    return this.http.get<IEstate>(`${this.baseUrl}/api/estates/${id}`);
  }
}
