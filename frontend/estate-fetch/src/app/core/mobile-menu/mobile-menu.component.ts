import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-mobile-menu',
  templateUrl: './mobile-menu.component.html',
  styleUrls: ['./mobile-menu.component.css'],
})
export class MobileMenuComponent {
  @Input() currentRoute: string = '/';
  @Output() isMobileMenuOpenChange = new EventEmitter<boolean>();

  closeMobileMenu() {
    this.isMobileMenuOpenChange.emit(false);
  }
}
