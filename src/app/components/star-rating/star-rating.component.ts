import {Component, input, output, InputSignal, OutputEmitterRef} from '@angular/core';

@Component({
  imports: [],
  selector: 'app-star-rating',
  styleUrl: './star-rating.component.css',
  templateUrl: './star-rating.component.html',
})
export class StarRatingComponent {

  public readonly rating: InputSignal<number> = input<number>(0);
  public readonly reviewCount: InputSignal<number> = input<number>(0);
  public readonly readonly: InputSignal<boolean> = input<boolean>(true);

  public readonly ratingChange: OutputEmitterRef<number> = output<number>();

  protected hoverRating: number = 0;

  public onMouseEnter(star: number): void {
    if(!this.readonly()) {
      this.hoverRating = star;
    }
  }

  public onMouseLeave(): void {
    this.hoverRating = 0;
  }

  public onStarClick(star: number): void {
    if(!this.readonly()) {
      this.ratingChange.emit(star);
    }
  }

  public isStarFilled(star: number): boolean {
    const activeRating = this.hoverRating || this.rating();
    return star <= activeRating;
  }

}
