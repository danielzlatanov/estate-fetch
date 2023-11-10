import {
  Component,
  EventEmitter,
  HostListener,
  OnInit,
  Output,
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { NAV_LINKS } from 'src/app/shared/helpers/navLinks';
import { scrollToTop } from 'src/app/shared/helpers/scrollToTop';
import { LoadingService } from 'src/app/shared/services/loading.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  scrollToTop = scrollToTop;
  isMobileMenuOpen = false;
  finalRoute: string | null = null;
  showBackToTop = false;
  showBurgerBtn = false;
  showCta = false;
  navLinks = NAV_LINKS;
  @Output() finalRouteChange = new EventEmitter<string>();

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollY = window.scrollY;
    if (scrollY >= 300) {
      this.showBackToTop = true;
      this.showBurgerBtn = true;
    } else {
      this.showBackToTop = false;
      this.showBurgerBtn = false;
    }
  }

  constructor(private router: Router, public loadingService: LoadingService) {}

  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.finalRoute = event.url;
        this.finalRouteChange.emit(this.finalRoute);
      }
    });
  }

  openMobileMenu() {
    this.isMobileMenuOpen = true;
  }

  handleCloseMobileMenu(value: boolean) {
    this.isMobileMenuOpen = value;
  }
}
