import { Component } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  response: any;

  constructor(private apiService: ApiService) {}

  startScraping() {
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
}
