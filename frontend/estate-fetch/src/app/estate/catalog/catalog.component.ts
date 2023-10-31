import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { EstateService } from '../estate.service';
import { IEstate } from 'src/app/shared/interfaces/estate';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { ICatalogResponse } from 'src/app/shared/interfaces/catalogResponse';
import { IFilters } from 'src/app/shared/interfaces/filters';

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
  pagesToShow = 10;
  totalPages!: number;
  startPage!: number;
  endPage!: number;
  selectPageNums!: number[];
  isSortOpen = false;
  sortField!: string;
  sortOrder!: string;
  isFilterOpen = false;
  selectedMinPrice = '';
  selectedMaxPrice = '';
  selectedLocation = '';
  selectedConstruction = '';
  selectedArea = '';
  selectedRooms = '';
  filtersApplied = false;
  appliedFilterCount = 0;
  filters!: IFilters;
  @ViewChild('searchInput') searchInput!: ElementRef;

  constructor(
    private estateService: EstateService,
    private router: Router,
    private route: ActivatedRoute,
    public loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.searchQuery = (params['keywords'] || '').trim();
      this.currentPage = params['page'] || 1;
      this.selectedLocation = params['location'] || '';
      this.selectedMinPrice = params['minPrice'] || '';
      this.selectedMaxPrice = params['maxPrice'] || '';
      this.selectedArea = params['minArea'] || '';
      this.selectedRooms = params['roomCount'] || '';
      this.selectedConstruction = params['construction'] || '';

      this.fetchEstates();
    });
  }

  clearSearchQuery() {
    this.searchQuery = '';
  }

  toggleFilter() {
    this.isFilterOpen = !this.isFilterOpen;
  }

  toggleSort() {
    this.isSortOpen = !this.isSortOpen;
  }

  onSortSubmit(sortOption: string) {
    this.isSortOpen = false;
    switch (sortOption) {
      case 'price-asc':
        this.sortField = 'price';
        this.sortOrder = 'asc';
        this.fetchEstates(true);
        break;

      case 'price-desc':
        this.sortField = 'price';
        this.sortOrder = 'desc';
        this.fetchEstates(true);
        break;

      case 'most-rel':
        this.sortField = '';
        this.sortOrder = '';
        this.fetchEstates(true);
        break;
    }
  }

  onFilterReset() {
    this.selectedMinPrice = '';
    this.selectedMaxPrice = '';
    this.selectedLocation = '';
    this.selectedConstruction = '';
    this.selectedArea = '';
    this.selectedRooms = '';
    this.onFilterSubmit();
  }

  onFilterSubmit() {
    this.isFilterOpen = false;
    this.fetchEstates(true);
  }

  setFilters() {
    this.filters = {
      location: this.selectedLocation,
      minPrice: this.selectedMinPrice,
      maxPrice: this.selectedMaxPrice,
      minArea: this.selectedArea,
      roomCount: this.selectedRooms,
      construction: this.selectedConstruction,
    };
    this.appliedFilterCount = Object.values(this.filters).filter(
      (value) => value !== ''
    ).length;
    this.filtersApplied = this.appliedFilterCount > 0;
  }

  fetchEstates(isInit = false): void {
    this.setFilters();

    if (isInit) {
      this.currentPage = 1;
    }
    if (!this.showEmptyState) {
      this.loadingService.isLoading = true;
    }
    this.updateRoute(this.currentPage, this.searchQuery);
    this.searchInput?.nativeElement?.blur();

    this.estateService
      .getEstates(
        this.currentPage,
        undefined,
        this.searchQuery,
        this.filters,
        this.sortField,
        this.sortOrder
      )
      .subscribe({
        next: (data: ICatalogResponse) => {
          this.estates = data.estates;
          this.totalPages = data.totalPages;
          this.selectPageNums = Array.from(
            { length: this.totalPages },
            (x, index) => index + 1
          );
          this.calculatePageRange(this.currentPage, this.totalPages);

          if (
            (this.searchQuery || this.filtersApplied) &&
            this.estates.length === 0
          ) {
            this.showNoMatchMsg = true;
          } else {
            this.showEmptyState = this.estates.length === 0;
            this.showNoMatchMsg = false;
          }

          if (
            isNaN(this.currentPage) ||
            this.currentPage < 1 ||
            this.currentPage > this.totalPages
          ) {
            this.updateRoute(1, this.searchQuery);
          }

          this.loadingService.isLoading = false;
        },
        error: (error: Error) => {
          this.loadingService.isLoading = false;
          console.error('An error occurred:', error);
        },
      });
  }

  updateRoute(currentPage = 1, keywords = '') {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        page: currentPage,
        keywords: keywords.trim() !== '' ? keywords : null,
        location:
          this.filters && this.filters.location !== ''
            ? this.filters.location
            : null,
        minPrice:
          this.filters && this.filters.minPrice !== ''
            ? this.filters.minPrice
            : null,
        maxPrice:
          this.filters && this.filters.maxPrice !== ''
            ? this.filters.maxPrice
            : null,
        minArea:
          this.filters && this.filters.minArea !== ''
            ? this.filters.minArea
            : null,
        roomCount:
          this.filters && this.filters.roomCount !== ''
            ? this.filters.roomCount
            : null,
        construction:
          this.filters && this.filters.construction !== ''
            ? this.filters.construction
            : null,
        sortField: this.sortField ? this.sortField : null,
        sortOrder: this.sortOrder ? this.sortOrder : null,
      },
      queryParamsHandling: 'merge',
    });
  }

  handlePageChange(pageOrAction: number | string) {
    if (typeof pageOrAction === 'number' && pageOrAction !== this.currentPage) {
      this.currentPage = pageOrAction;
    } else if (pageOrAction === 'prev' && this.currentPage > 1) {
      this.currentPage--;
    } else if (pageOrAction === 'next' && this.currentPage < this.totalPages) {
      this.currentPage++;
    }

    this.fetchEstates();
  }

  calculatePageRange(currentPage: number, totalPages: number) {
    const half = Math.floor(this.pagesToShow / 2);

    this.startPage = Math.max(1, currentPage - half);
    this.endPage = Math.min(totalPages, this.startPage + this.pagesToShow - 1);

    if (this.endPage - this.startPage + 1 < this.pagesToShow) {
      this.startPage = Math.max(1, this.endPage - this.pagesToShow + 1);
    }
  }

  getPagesInRange(): number[] {
    const pages = [];
    for (let i = this.startPage; i <= this.endPage; i++) {
      pages.push(i);
    }
    return pages;
  }
}
