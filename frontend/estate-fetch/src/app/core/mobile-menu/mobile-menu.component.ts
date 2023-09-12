import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-mobile-menu',
  templateUrl: './mobile-menu.component.html',
  styleUrls: ['./mobile-menu.component.css'],
})
export class MobileMenuComponent {
  @Output() isMobileMenuOpenChange = new EventEmitter<boolean>();

  closeMobileMenu() {
    this.isMobileMenuOpenChange.emit(false);
  }
}
