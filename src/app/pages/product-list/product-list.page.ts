import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';

@Component({
  imports: [ProductCardComponent, FormsModule],
  selector: 'app-product-list',
  styleUrl: './product-list.page.css',
  templateUrl: './product-list.page.html',
})
export class ProductListPage implements OnInit {
  private readonly productService: ProductService = inject(ProductService);
 private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly router: Router = inject(Router);

  protected searchTerm: string = '';
  protected readonly debouncedSearchTerm: WritableSignal<string> = signal<string>('');
  private searchTimeout: ReturnType<typeof setTimeout> | null = null;

  protected selectedCategory: string = 'All';
  protected inStockOnly: boolean = false;
  protected selectedSort: string = 'price-asc';

  protected currentPage: number = 1;
  protected readonly pageSize: number = 4;

  protected readonly isLoading: WritableSignal<boolean> = signal<boolean>(true);
  protected products: Product[] = [];

  public ngOnInit(): void {
    this.products = this.productService.getAll();

    this.route.queryParams.subscribe((params: Params): void => {
      const categoryParam: string | undefined = params['category'];

      if(categoryParam && this.productService.getCategories().includes(categoryParam)) {
        this.selectedCategory = categoryParam;
      } else {
        this.selectedCategory = 'All';
      }
      this.currentPage = 1;
    });

    setTimeout((): void => {
      this.isLoading.set(false);
    }, 1000);
  }

  public onSearchChange(event: Event): void {
    const target: HTMLInputElement = event.target as HTMLInputElement;
    const value: string = target.value;

    if(this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }

    this.searchTimeout = setTimeout((): void => {
      this.debouncedSearchTerm.set(value.trim().toLowerCase());
      this.currentPage = 1;
    }, 300)
  }

  public clearSearch(): void {
    this.searchTerm = '';
    this.debouncedSearchTerm.set('');
    this.currentPage = 1;
  }

  protected get categories(): { name: string; count: number }[] {
    const cats: Map<string, number> = new Map<string, number>();
    this.products.forEach((p: Product): void => {
      cats.set(p.category, (cats.get(p.category) ?? 0) + 1);
    });
    return [{ name: 'All', count: this.products.length }, ...Array.from(cats, ([name, count]) => ({ name, count }))];
  }

  public selectCategory(category: string): void {
    this.selectedCategory = category;
    this.currentPage = 1;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: category === 'All' ? {} : { category },
    });
  }

  public toggleInStockOnly(): void {
    this.inStockOnly = !this.inStockOnly;
    this.currentPage = 1;
  }

  public onSortChange(): void {
    this.currentPage = 1;
  }

  public clearAllFilters(): void {
    this.searchTerm = '';
    this.debouncedSearchTerm.set('');
    this.selectedCategory = 'All';
    this.inStockOnly = false;
    this.selectedSort = 'price-asc';
    this.currentPage = 1;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {},
    });
  }

  protected get filteredProducts(): Product[] {
    const search: string = this.debouncedSearchTerm();

    const result: Product[] = this.products.filter((product: Product): boolean => {
      const matchesSearch: boolean = !search ||
        product.name.toLowerCase().includes(search) ||
        product.description.toLowerCase().includes(search);

      const matchesCategory: boolean = this.selectedCategory === 'All' || product.category === this.selectedCategory;
      const matchesStock: boolean = !this.inStockOnly || product.inStock;

      return matchesSearch && matchesCategory && matchesStock;
    });

    return result.sort((a: Product, b: Product): number => {
      const priceA: number = a.salePrice ?? a.price;
      const priceB: number = b.salePrice ?? b.price;

      switch (this.selectedSort) {
        case 'price-asc': return priceA - priceB;
        case 'price-desc': return priceB - priceA;
        case 'name-asc': return a.name.localeCompare(b.name);
        case 'name-desc': return b.name.localeCompare(a.name);
        case 'rating-desc': return b.rating - a.rating;
        default: return 0;
      }
    });
  }

  protected get totalPages(): number {
    return Math.ceil(this.filteredProducts.length / this.pageSize);
  }

  protected get paginatedProducts(): Product[] {
    const start: number = (this.currentPage - 1) * this.pageSize;
    return this.filteredProducts.slice(start, start + this.pageSize);
  }

  protected get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_: unknown, i: number): number => i + 1);
  }

  public goToPage(page: number): void {
    this.currentPage = page;
  }

  public handleAddToCart(product: Product): void {
    console.log(`${product.name} added to cart`);
  }
}
