import { Component, inject, computed, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Product } from '../../../../models/product.model';
import { ProductService } from '../../../../services/product.service';

@Component({
  imports: [],
  selector: 'app-product-reviews',
  styleUrl: './product-reviews.component.css',
  templateUrl: './product-reviews.component.html',
})
export class ProductReviewsComponent {
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly productService: ProductService = inject(ProductService);

  private readonly paramMap: Signal<ParamMap | undefined> = toSignal(
    this.route.parent?.paramMap ?? this.route.paramMap
  );

  protected readonly reviewCount: Signal<number> = computed((): number => {
    const id: number = Number(this.paramMap()?.get('id'));
    const product: Product | undefined = this.productService.getById(id);
    return product?.reviewCount ?? 0;
  });
}
