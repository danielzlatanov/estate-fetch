import { Component, OnInit } from '@angular/core';
import { ApiService } from './services/api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  response: any;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.testConn();
  }

  testConn() {
    this.apiService.testBackendConnection().subscribe(
      (data: any) => {
        this.response = data;
      },
      (err: any) => {
        console.error('Error:', err);
        this.response = 'Error connecting to the backend.';
      }
    );
  }
}
