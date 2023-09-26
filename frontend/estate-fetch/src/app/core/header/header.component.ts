import { Component, EventEmitter, HostListener, Output } from '@angular/core';
import { Router } from '@angular/router';
import { scrollToTop } from 'src/app/shared/helpers/scrollToTop';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  scrollToTop = scrollToTop;
  isMobileMenuOpen = false;
  currentRoute!: string;
  showBackToTop = false;
  @Output() currentRouteChange = new EventEmitter<string>();

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollY = window.scrollY;
    if (scrollY >= 300) {
      this.showBackToTop = true;
    } else {
      this.showBackToTop = false;
    }
  }

  constructor(private router: Router) {
    this.router.events.subscribe(() => {
      this.currentRoute = this.router.url;
      this.currentRouteChange.emit(this.currentRoute);
    });
  }

  openMobileMenu() {
    this.isMobileMenuOpen = true;
  }

  handleCloseMobileMenu(value: boolean) {
    this.isMobileMenuOpen = value;
  }
}
