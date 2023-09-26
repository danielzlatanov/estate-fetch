import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.css'],
})
export class SpinnerComponent {
  @Input() width = 16;
  @Input() height = 16;

  get spinnerClasses(): string {
    return `
      w-${this.width}
      h-${this.height}
      animate-spin
      rounded-full
      shadow-md
      border-x-4
      border-solid
      border-t-transparent
      border-blue-600
    `;
  }
}
