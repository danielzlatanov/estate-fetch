import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { MobileMenuComponent } from './mobile-menu/mobile-menu.component';
import { RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { LoadingService } from '../shared/services/loading.service';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    MobileMenuComponent,
    PageNotFoundComponent,
  ],
  imports: [CommonModule, RouterModule, SharedModule],
  providers: [LoadingService],
  exports: [
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    MobileMenuComponent,
  ],
})
export class CoreModule {}
