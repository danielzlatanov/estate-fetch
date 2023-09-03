import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl = 'http://localhost:8000';

  constructor(private http: HttpClient) {}

  testBackendConnection(): any {
    return this.http.get(this.baseUrl);
  }

  testFirstRoute(): any {
    return this.http.get(`${this.baseUrl}/api/estates`);
  }
  
  testSecondRoute(): any {
    return this.http.get(`${this.baseUrl}/api/estates/123`);
  }
}
