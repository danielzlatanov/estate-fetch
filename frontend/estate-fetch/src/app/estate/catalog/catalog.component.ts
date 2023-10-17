import { Component, OnInit } from '@angular/core';
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
  showEmptyState = false;
  showNoMatchMsg = false;
  searchQuery = '';
  currentPage = 1;
  totalPages!: number;
  pagesToShow = 10;
  startPage!: number;
  endPage!: number;
  selectPageNums!: number[];

  constructor(
    private estateService: EstateService,
    private router: Router,
    private route: ActivatedRoute,
    public loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    this.loadingService.isLoading = true;
    this.loadingService.isSearching = false;

    this.route.queryParams.subscribe((params) => {
      this.searchQuery = params['keywords'] || '';
      this.currentPage = params['page'] || 1;

      if (this.searchQuery) {
        this.estateService
          .getEstates(this.currentPage, undefined, this.searchQuery)
          .subscribe((data: ICatalogResponse) => {
            this.estates = data.estates;
            this.totalPages = data.totalPages;
            this.selectPageNums = Array.from(
              { length: this.totalPages },
              (x, index) => index + 1
            );

            this.calculatePageRange(this.currentPage, this.totalPages);

            this.showNoMatchMsg = data.estates.length == 0;
            this.loadingService.isLoading = false;
          });
      } else {
        this.fetchEstates();
        this.showNoMatchMsg = false;
      }
    });
  }

  private fetchEstates(): void {
    this.loadingService.isLoading = true;

    this.estateService.getEstates(this.currentPage).subscribe({
      next: (data: ICatalogResponse) => {
        this.estates = data.estates;
        this.totalPages = data.totalPages;
        this.selectPageNums = Array.from(
          { length: this.totalPages },
          (x, index) => index + 1
        );
        this.calculatePageRange(this.currentPage, this.totalPages);

        this.showEmptyState = this.estates.length === 0;
        this.loadingService.isLoading = false;

        if (
          isNaN(this.currentPage) ||
          this.currentPage < 1 ||
          this.currentPage > this.totalPages
        ) {
          this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { page: 1 },
            queryParamsHandling: 'merge',
          });
        }
      },
      error: (error: Error) => {
        this.loadingService.isLoading = false;
        console.error('An error occurred:', error);
      },
    });
  }

  getPagesInRange(): number[] {
    const pages = [];
    for (let i = this.startPage; i <= this.endPage; i++) {
      pages.push(i);
    }
    return pages;
  }

  calculatePageRange(currentPage: number, totalPages: number) {
    const half = Math.floor(this.pagesToShow / 2);

    this.startPage = Math.max(1, currentPage - half);
    this.endPage = Math.min(totalPages, this.startPage + this.pagesToShow - 1);

    if (this.endPage - this.startPage + 1 < this.pagesToShow) {
      this.startPage = Math.max(1, this.endPage - this.pagesToShow + 1);
    }
  }

  handlePageChange(pageOrAction: number | string) {
    if (typeof pageOrAction === 'number' && pageOrAction !== this.currentPage) {
      this.currentPage = pageOrAction;
    } else if (pageOrAction === 'prev' && this.currentPage > 1) {
      this.currentPage--;
    } else if (pageOrAction === 'next' && this.currentPage < this.totalPages) {
      this.currentPage++;
    }

    this.updateRoute();
    if (this.searchQuery) {
      this.onSearch();
    } else {
      this.fetchEstates();
    }
  }

  updateRoute() {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: this.currentPage },
      queryParamsHandling: 'merge',
    });
  }

  onSearch(): void {
    this.loadingService.isSearching = true;

    if (this.searchQuery.trim() !== '') {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { page: 1, keywords: this.searchQuery },
        queryParamsHandling: 'merge',
      });

      this.estateService
        .getEstates(this.currentPage, undefined, this.searchQuery)
        .subscribe({
          next: (data: ICatalogResponse) => {
            this.estates = data.estates;
            this.totalPages = data.totalPages;
            this.selectPageNums = Array.from(
              { length: this.totalPages },
              (x, index) => index + 1
            );
            this.calculatePageRange(this.currentPage, this.totalPages);
            this.showNoMatchMsg = data.estates.length == 0;
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
        queryParams: { page: 1, keywords: null },
        queryParamsHandling: 'merge',
      });

      this.fetchEstates();
      this.showNoMatchMsg = false;
      this.loadingService.isSearching = false;
    }
  }
}
