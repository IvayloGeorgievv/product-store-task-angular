import { Component, computed, inject, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import {filter, map} from 'rxjs';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';

interface BreadcrumbItem {
  label: string;
  url?: string;
}
@Component({
  imports: [RouterLink],
  selector: 'app-breadcrumb',
  styleUrl: './breadcrumb.component.css',
  templateUrl: './breadcrumb.component.html',
})
export class BreadcrumbComponent {
  private readonly router: Router = inject(Router);
  private readonly productService: ProductService = inject(ProductService);

  private readonly currentUrl: Signal<string> = toSignal(
    this.router.events.pipe(
      filter((event: unknown): event is NavigationEnd => event instanceof NavigationEnd),
      map((event: NavigationEnd): string => event.urlAfterRedirects || event.url)
    ),
    { initialValue: this.router.url }
  );

  protected readonly breadcrumbs: Signal<BreadcrumbItem[]> = computed((): BreadcrumbItem[] => {
    const url: string = this.currentUrl();
    const items: BreadcrumbItem[] = [{ label: 'Home', url: '/' }];
    const cleanUrl: string = url.split('?')[0];
    const segments: string[] = cleanUrl.split('/').filter(Boolean);

    if (segments.length === 0) {
      return items;
    }

    if (segments[0] === 'products') {
      if (segments.length === 1) {
        items.push({ label: 'Products' });
      } else {
        items.push({ label: 'Products', url: '/products' });
        const productId: number = Number(segments[1]);
        if (!isNaN(productId)) {
          const product: Product | undefined = this.productService.getById(productId);
          items.push({ label: product ? product.name : `Product #${productId}` });
        }
      }
    } else if (segments[0] === 'cart') {
      items.push({ label: 'Shopping Cart' });
    } else if (segments[0] === 'about') {
      items.push({ label: 'About Us' });
    } else {
      items.push({ label: segments[0] });
    }

    return items;
  });
}
