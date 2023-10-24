import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import KeenSlider, { KeenSliderInstance } from 'keen-slider';
import { Gallery, GalleryItem, ImageItem } from 'ng-gallery';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.css'],
})
export class SliderComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('sliderRef') sliderRef!: ElementRef<HTMLElement>;
  @Input() images: string[] = [];
  items: GalleryItem[] = [];

  currentSlide = 0;
  dotHelper: Array<number> = [];
  slider: KeenSliderInstance | null = null;

  constructor(private gallery: Gallery) {}

  ngOnInit() {
    this.items = this.images.map(
      (image) => new ImageItem({ src: image, thumb: image })
    );
    const galleryRef = this.gallery.ref();
    galleryRef.load(this.items);
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (this.slider) {
      if (event.key === 'ArrowLeft') {
        this.slider.prev();
      } else if (event.key === 'ArrowRight') {
        this.slider.next();
      }
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.slider = new KeenSlider(this.sliderRef.nativeElement, {
        initial: this.currentSlide,
        slideChanged: (s) => {
          this.currentSlide = s.track.details.rel;
        },
      });
      this.dotHelper = [
        ...Array(this.slider.track.details.slides.length).keys(),
      ];
    });
  }

  ngOnDestroy() {
    if (this.slider) {
      this.slider.destroy();
    }
  }
}
