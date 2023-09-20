import { scrollToTop } from 'src/app/shared/helpers/scrollToTop';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css'],
})
export class DetailsComponent implements OnInit {
  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.fragment.subscribe((fragment) => {
      if (fragment === 'top') {
        setTimeout(() => {
          scrollToTop();
        }, 100);
      }
    });
  }
}
