import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SliderComponent } from './slider/slider.component';
import { SpinnerComponent } from './spinner/spinner.component';
import { LightboxModule } from 'ng-gallery/lightbox';
import { GalleryModule } from 'ng-gallery';

@NgModule({
  declarations: [SliderComponent, SpinnerComponent],
  imports: [CommonModule, LightboxModule, GalleryModule],
  exports: [SliderComponent, SpinnerComponent],
})
export class SharedModule {}
