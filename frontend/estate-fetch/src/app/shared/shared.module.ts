import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SliderComponent } from './slider/slider.component';
import { SpinnerComponent } from './spinner/spinner.component';
import { LightboxModule } from 'ng-gallery/lightbox';
import { GalleryModule } from 'ng-gallery';
import { DarkModeToggleComponent } from './dark-mode-toggle/dark-mode-toggle.component';

@NgModule({
  declarations: [SliderComponent, SpinnerComponent, DarkModeToggleComponent],
  imports: [CommonModule, LightboxModule, GalleryModule],
  exports: [SliderComponent, SpinnerComponent, DarkModeToggleComponent],
})
export class SharedModule {}
