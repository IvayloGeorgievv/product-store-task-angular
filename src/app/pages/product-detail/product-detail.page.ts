import { Component, inject,  computed, signal, Signal, WritableSignal} from '@angular/core';
import { ActivatedRoute, ParamMap, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { StarRatingComponent } from '../../components/star-rating/star-rating.component';
import {BreadcrumbComponent} from '../../components/breadcrumb/breadcrumb.component';
import {CategoryIconPipe} from '../../pipes/category-icon-pipe';

@Component({
  imports: [
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    StarRatingComponent,
    BreadcrumbComponent,
    CategoryIconPipe,
  ],
  selector: 'app-product-detail',
  styleUrl: './product-detail.page.css',
  templateUrl: './product-detail.page.html',
})
export class ProductDetailPage {
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly productService: ProductService = inject(ProductService);
  protected readonly cartService: CartService = inject(CartService);

  private readonly paramMap: Signal<ParamMap | undefined> = toSignal(this.route.paramMap);

  protected readonly product: Signal<Product | undefined> = computed((): Product | undefined => {
    const id: number = Number(this.paramMap()?.get('id'));
    return isNaN(id) ? undefined : this.productService.getById(id);
  });

  protected readonly relatedProducts: Signal<Product[]> = computed((): Product[] => {
    const currentProduct: Product | undefined = this.product();
    return currentProduct ? this.productService.getRelated(currentProduct).slice(0, 3) : [];
  });

  protected readonly selectedThumbnail: WritableSignal<number> = signal<number>(0);
  protected readonly quantity: WritableSignal<number> = signal<number>(1);

  public setThumbnail(index: number): void {
    this.selectedThumbnail.set(index);
  }

  public incrementQuantity(): void {
    this.quantity.update((q: number): number => (q < 10 ? q + 1 : q));
  }

  public decrementQuantity(): void {
    this.quantity.update((q: number): number => (q > 1 ? q - 1 : q));
  }

  public onAddToCart(): void {
    const currentProduct: Product | undefined = this.product();
    if (currentProduct && currentProduct.inStock) {
      this.cartService.addItem(currentProduct, this.quantity());
    }
  }
}
