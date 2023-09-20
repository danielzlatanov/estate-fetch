import { Component, HostListener, OnInit } from '@angular/core';
import { EstateService } from '../estate.service';
import { IEstate } from 'src/app/shared/interfaces/estate';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.css'],
})
export class CatalogComponent implements OnInit {
  estates: IEstate[] = [];
  isSmallScreen: boolean = false;

  constructor(private estateService: EstateService) {
    this.checkScreenSize();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.checkScreenSize();
  }

  ngOnInit(): void {
    this.fetchEstates();
  }

  private checkScreenSize(): void {
    this.isSmallScreen = window.innerWidth <= 768;
  }

  private fetchEstates(): void {
    this.estateService.getData().subscribe({
      next: (data: IEstate[]) => {
        this.estates = data;
        console.log('fetched all estates:', this.estates);
      },
      error: (error: any) => {
        console.error('An error occurred:', error);
      },
    });
  }
}
