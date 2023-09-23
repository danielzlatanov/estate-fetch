import { Component, HostListener, OnInit } from '@angular/core';
import { EstateService } from '../estate.service';
import { IEstate } from 'src/app/shared/interfaces/estate';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.css'],
})
export class CatalogComponent implements OnInit {
  estates: IEstate[] = [];
  isSmallScreen: boolean = false;
  showEmptyState: boolean = false;
  showNoMatchMsg: boolean = false;
  searchQuery: string = '';

  constructor(
    private estateService: EstateService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.checkScreenSize();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.checkScreenSize();
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const searchQuery = params['keywords'];
      if (searchQuery) {
        this.estateService
          .searchEstates(searchQuery)
          .subscribe((data: IEstate[]) => {
            this.estates = data;
            this.showNoMatchMsg = data.length == 0;
          });
      } else {
        this.fetchEstates();
      }
    });
  }

  private checkScreenSize(): void {
    this.isSmallScreen = window.innerWidth <= 768;
  }

  private fetchEstates(): void {
    this.estateService.getData().subscribe({
      next: (data: IEstate[]) => {
        this.estates = data;
        this.showEmptyState = this.estates.length === 0;
      },
      error: (error: any) => {
        console.error('An error occurred:', error);
      },
    });
  }

  onSearch(): void {
    if (this.searchQuery.trim() !== '') {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { keywords: this.searchQuery },
        queryParamsHandling: 'merge',
      });

      this.estateService.searchEstates(this.searchQuery).subscribe({
        next: (data: IEstate[]) => {
          this.estates = data;
          this.showNoMatchMsg = data.length == 0;
        },
        error: (error: any) => {
          console.error('An error occurred during search:', error);
        },
      });
    } else {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { keywords: null },
        queryParamsHandling: 'merge',
      });

      this.fetchEstates();
    }
  }
}
