import {Component, input, output, InputSignal, OutputEmitterRef, inject} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Product } from '../../models/product.model';
import { StarRatingComponent } from '../star-rating/star-rating.component';
import { TruncatePipe } from '../../pipes/truncate-pipe';
import { RelativeTimePipe } from '../../pipes/relative-time-pipe';
import { CartService } from '../../services/cart.service';
import {CategoryIconPipe} from '../../pipes/category-icon-pipe';
import {RouterLink} from '@angular/router';

@Component({
  imports: [FormsModule, StarRatingComponent, TruncatePipe, RelativeTimePipe, CategoryIconPipe, RouterLink],
  selector: 'app-product-card',
  styleUrl: './product-card.component.css',
  templateUrl: './product-card.component.html',
})
export class ProductCardComponent {
  private readonly cartService: CartService = inject(CartService);

  public readonly product: InputSignal<Product> = input.required<Product>();

  public readonly addedToCart: OutputEmitterRef<Product> = output<Product>();

  protected quantity: number = 1;

  protected get discountPercent(): number {
    const salePrice = this.product().salePrice;
    if(!salePrice) {
      return 0;
    }
    return Math.round(((this.product().price - salePrice) / this.product().price) * 100);
  }

  protected get isInCart(): boolean {
    return this.cartService.isInCart(this.product().id);
  }

  public onAddToCart(): void {
    if (this.product().inStock) {
      this.cartService.addItem(this.product(), this.quantity);
      this.addedToCart.emit(this.product());
    }
  }

  public onNotifyMe(): void {
    console.log(`Notify me requested for: ${this.product().name}`);
  }
}
