import { scrollToTop } from 'src/app/shared/helpers/scrollToTop';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IEstate } from 'src/app/shared/interfaces/estate';
import { EstateService } from '../estate.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css'],
})
export class DetailsComponent implements OnInit {
  estate: IEstate | undefined;
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private estateService: EstateService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    const id = this.route.snapshot.paramMap.get('id');

    this.route.fragment.subscribe((fragment) => {
      if (fragment === 'top') {
        setTimeout(() => {
          scrollToTop();
        }, 100);
      }
    });

    if (id) {
      this.estateService.getEstateById(id).subscribe({
        next: (data: IEstate) => {
          this.estate = data;
          this.isLoading = false;
        },
        error: (error: Error) => {
          this.isLoading = false;
          console.error('An error occurred:', error);
        },
      });
    }
  }
}
