import { Component, HostListener, OnInit } from '@angular/core';
import { EstateService } from '../estate.service';
import { IEstate } from 'src/app/shared/interfaces/estate';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { ICatalogResponse } from 'src/app/shared/interfaces/catalogResponse';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.css'],
})
export class CatalogComponent implements OnInit {
  estates: IEstate[] = [];
  isSmallScreen = false;
  showEmptyState = false;
  showNoMatchMsg = false;
  searchQuery = '';
  currentPage = 1;

  constructor(
    private estateService: EstateService,
    private router: Router,
    private route: ActivatedRoute,
    public loadingService: LoadingService
  ) {
    this.checkScreenSize();
  }

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.checkScreenSize();
  }

  ngOnInit(): void {
    this.loadingService.isLoading = true;
    this.loadingService.isSearching = false;

    this.route.queryParams.subscribe((params) => {
      const searchQuery = params['keywords'];

      if (searchQuery) {
        this.estateService
          .searchEstates(searchQuery)
          .subscribe((data: IEstate[]) => {
            this.estates = data;
            this.showNoMatchMsg = data.length == 0;
            this.loadingService.isLoading = false;
          });
      } else {
        this.currentPage = params['page'] || 1;
        this.loadingService.isLoading = true;
        this.fetchEstates();
        this.showNoMatchMsg = false;
      }
    });
  }

  private checkScreenSize(): void {
    this.isSmallScreen = window.innerWidth <= 768;
  }

  private fetchEstates(): void {
    this.estateService.getEstates(this.currentPage).subscribe({
      next: (data: ICatalogResponse) => {
        this.estates = data.estates;
        this.showEmptyState = this.estates.length === 0;
        this.loadingService.isLoading = false;
      },
      error: (error: Error) => {
        this.loadingService.isLoading = false;
        console.error('An error occurred:', error);
      },
    });
  }

  onSearch(): void {
    this.loadingService.isSearching = true;

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
          this.loadingService.isSearching = false;
        },
        error: (error: Error) => {
          this.loadingService.isSearching = false;
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
      this.showNoMatchMsg = false;
      this.loadingService.isSearching = false;
    }
  }
}
