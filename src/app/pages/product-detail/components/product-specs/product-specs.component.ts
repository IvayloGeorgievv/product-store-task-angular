import {Component, computed, inject, Signal} from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ProductService } from '../../../../services/product.service';
import {toSignal} from '@angular/core/rxjs-interop';

@Component({
  imports: [],
  selector: 'app-product-specs',
  styleUrl: './product-specs.component.css',
  templateUrl: './product-specs.component.html',
})
export class ProductSpecsComponent{
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly productService: ProductService = inject(ProductService);

  private readonly paramMap: Signal<ParamMap | undefined> = toSignal(
    this.route.parent?.paramMap ?? this.route.paramMap
  );

  protected readonly specs: Signal<[string, string][]> = computed((): [string, string][] => {
    const id: number = Number(this.paramMap()?.get('id'));
    const product = this.productService.getById(id);
    return product?.specs ? Object.entries(product.specs) : [];
  });
}
