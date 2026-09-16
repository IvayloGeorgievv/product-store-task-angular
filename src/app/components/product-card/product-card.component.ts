import { Component, input, output, InputSignal, OutputEmitterRef} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductModel } from '../../models/product.model';
import { StarRatingComponent } from '../star-rating/star-rating.component';
import { TruncatePipe } from '../../pipes/truncate-pipe';
import { RelativeTimePipe } from '../../pipes/relative-time-pipe';

@Component({
  imports: [FormsModule, StarRatingComponent, TruncatePipe, RelativeTimePipe],
  selector: 'app-product-card',
  styleUrl: './product-card.component.css',
  templateUrl: './product-card.component.html',
})
export class ProductCardComponent {
  public readonly product: InputSignal<ProductModel> = input.required<ProductModel>();

  public readonly addedToCart: OutputEmitterRef<ProductModel> = output<ProductModel>();

  protected quantity: number = 1;

  protected get discountPercent(): number {
    const salePrice = this.product().salePrice;
    if(!salePrice) {
      return 0;
    }

    return Math.round(((this.product().price - salePrice) / this.product().price) * 100);
  }

  public onAddToCart(): void {
    if (this.product().inStock) {
      this.addedToCart.emit(this.product());
    }
  }

  public onNotifyMe(): void {
    console.log(`Notify me requested for: ${this.product().name}`);
  }
}
