import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EstateRoutingModule } from './estate-routing.module';
import { CatalogComponent } from './catalog/catalog.component';
import { DetailsComponent } from './details/details.component';

@NgModule({
  declarations: [CatalogComponent, DetailsComponent],
  imports: [CommonModule, EstateRoutingModule],
})
export class EstateModule {}
