import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IEstate } from 'src/app/shared/interfaces/estate';
import { EstateService } from '../estate.service';
import { LoadingService } from 'src/app/shared/services/loading.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css'],
})
export class DetailsComponent implements OnInit {
  estate: IEstate | undefined;
  realtorAddress!: string;
  realtorInfo!: string;
  splitIndex = -1;

  constructor(
    private route: ActivatedRoute,
    private estateService: EstateService,
    public loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    this.loadingService.isLoading = true;
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.estateService.getEstateById(id).subscribe({
        next: (data: IEstate) => {
          this.estate = data;

          const realtorInfo = this.estate.realtorInfo;
          const keywords = [
            'агенция',
            'строителна',
            'банка',
            'инвеститор',
            'чси',
          ];

          for (const keyword of keywords) {
            const regex = new RegExp(keyword, 'i');
            const match = realtorInfo.match(regex);

            if (match) {
              this.splitIndex = realtorInfo.indexOf(match[0]);
              break;
            }
          }

          if (this.splitIndex !== -1) {
            this.realtorAddress =
              this.splitIndex !== -1
                ? realtorInfo.substring(0, this.splitIndex).trim()
                : realtorInfo;
            this.realtorInfo =
              this.splitIndex !== -1
                ? realtorInfo.substring(this.splitIndex).trim()
                : '';
          }

          this.loadingService.isLoading = false;
        },
        error: (error: Error) => {
          this.loadingService.isLoading = false;
          console.error('An error occurred:', error);
        },
      });
    }
  }
}
