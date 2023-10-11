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

  constructor(private http: HttpClient) {}

  //!
  // scrape(): Observable<object> {
  //   return this.http.get(`${this.baseUrl}/api/scrape`);
  // }

  getEstates(page: number, perPage?: number): Observable<ICatalogResponse> {
    let params = new HttpParams().set('page', page.toString());

    if (perPage) {
      params = params.set('perPage', perPage.toString());
    }

    return this.http.get<ICatalogResponse>(`${this.baseUrl}/api/estates`, {
      params,
    });
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
