import { Component, OnInit } from '@angular/core';
import { LoadingService } from 'src/app/shared/services/loading.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
})
export class FooterComponent implements OnInit {
  showFooter = false;

  constructor(public loadingService: LoadingService) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.showFooter = true;
    }, 1000);
  }
}
