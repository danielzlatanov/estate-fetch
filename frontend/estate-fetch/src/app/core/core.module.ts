import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { MobileMenuComponent } from './mobile-menu/mobile-menu.component';

@NgModule({
  declarations: [
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    MobileMenuComponent,
  ],
  imports: [CommonModule],
  exports: [
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    MobileMenuComponent,
  ],
})
export class CoreModule {}
