import { Component, OnInit } from '@angular/core';
import { ApiService } from './services/api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  response: any;
  first: any;
  second: any;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.testConn();
    this.testFirst();
    this.testSecond();
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

  testFirst() {
    this.apiService.testFirstRoute().subscribe(
      (data: any) => {
        this.first = data.message;
      },
      (err: any) => {
        console.error('Error:', err);
        this.first = 'Error receiving first route.';
      }
    );
  }

  testSecond() {
    this.apiService.testSecondRoute().subscribe(
      (data: any) => {
        this.second = data.message;
      },
      (err: any) => {
        console.error('Error:', err);
        this.second = 'Error receiving second route.';
      }
    );
  }
}
