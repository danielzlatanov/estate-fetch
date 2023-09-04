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
    this.testFirst();
    this.testSecond();
  }

  startScraping() {
    this.testScrape();
  }

  testScrape() {
    this.apiService.testScrape().subscribe(
      (data: any) => {
        this.response = data;
      },
      (err: any) => {
        console.error('Error:', err);
        this.response = 'Error while scraping.';
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
