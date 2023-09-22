import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EstateRoutingModule } from './estate-routing.module';
import { CatalogComponent } from './catalog/catalog.component';
import { DetailsComponent } from './details/details.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [CatalogComponent, DetailsComponent],
  imports: [CommonModule, EstateRoutingModule, SharedModule],
})
export class EstateModule {}
