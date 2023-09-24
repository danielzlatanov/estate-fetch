import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SliderComponent } from './slider/slider.component';
import { SpinnerComponent } from './spinner/spinner.component';

@NgModule({
  declarations: [SliderComponent, SpinnerComponent],
  imports: [CommonModule],
  exports: [SliderComponent, SpinnerComponent],
})
export class SharedModule {}
