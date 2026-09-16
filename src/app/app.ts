import { Component, signal, WritableSignal} from '@angular/core';
import { HeaderComponent } from './components/header/header.component';
import { HeroBannerComponent } from './components/hero-banner/hero-banner.component';
import { ProductCardComponent } from './components/product-card/product-card.component';
import { FooterComponent } from './components/footer/footer.component';
import { ProductModel } from './models/product.model';
import { FormsModule } from '@angular/forms';

@Component({
  imports: [HeaderComponent, HeroBannerComponent, ProductCardComponent, FooterComponent, FormsModule],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected totalCartItems: number = 0;

  protected searchTerm: string = '';
  protected readonly debouncedSearchTerm: WritableSignal<string> = signal<string>('');
  private searchTimeout: ReturnType<typeof setTimeout> | null = null;

  protected selectedCategory: string = 'All';
  protected inStockOnly: boolean = false;

  protected selectedSort: string = 'price-asc';

  protected currentPage: number = 1;
  protected readonly pageSize: number = 4;

  protected readonly isLoading: WritableSignal<boolean> = signal<boolean>(true);

  constructor() {
    setTimeout(() => {
      this.isLoading.set(false);
    }, 1000);
  }

  protected readonly products: ProductModel[] = [
    {
      id: 1,
      name: 'Wireless Noise-Canceling Headphones',
      category: 'Audio',
      price: 299,
      salePrice: 199,
      inStock: true,
      description: 'Premium sound with active noise cancellation.',
      rating: 5,
      reviewCount: 128,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // Before 2 days
    },
    {
      id: 2,
      name: 'Mechanical Gaming Keyboard',
      category: 'Electronics',
      price: 129,
      inStock: true,
      description: 'Tactile switches with customizable RGB lighting.',
      rating: 4,
      reviewCount: 85,
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000) // Before 4 hours
    },
    {
      id: 3,
      name: 'Smart Ergonomic Desk Lamp',
      category: 'Home',
      price: 89,
      inStock: false,
      description: 'Dimmable LED with wireless smartphone charging base.',
      rating: 4,
      reviewCount: 42,
      createdAt: new Date(Date.now() - 20 * 60 * 1000) // Before 20 minutes
    },
    {
      id: 4,
      name: 'Ultra-Slim Smartwatch',
      category: 'Electronics',
      price: 249,
      salePrice: 189,
      inStock: true,
      description: 'Fitness tracking, heart-rate monitor, and long battery life.',
      rating: 4,
      reviewCount: 94,
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // Before 5 days
    },
    {
      id: 5,
      name: 'Studio Monitor Speakers',
      category: 'Audio',
      price: 349,
      inStock: false,
      description: 'High-fidelity audio monitors for music production.',
      rating: 5,
      reviewCount: 31,
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) // Before 10 days
    },
    {
      id: 6,
      name: 'Minimalist Ceramic Coffee Mug',
      category: 'Home',
      price: 24,
      inStock: true,
      description: 'Handcrafted ceramic mug with heat retention design.',
      rating: 3,
      reviewCount: 19,
      createdAt: new Date(Date.now() - 30 * 1000) // Before 30 seconds
    },
    {
      id: 7,
      name: 'Fast Wireless Charging Pad',
      category: 'Accessories',
      price: 39,
      inStock: true,
      description: '15W high-speed wireless charging for phones and earbuds.',
      rating: 4,
      reviewCount: 63,
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000) // Before 1 day
    },
    {
      id: 8,
      name: 'Braided USB-C Cable (2m)',
      category: 'Accessories',
      price: 19,
      inStock: true,
      description: 'Durable braided cable supporting 100W PD charging.',
      rating: 5,
      reviewCount: 150,
      createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000) // Before 6 days
    }
  ];

  // Debounce logic with 300ms latency
  public onSearchChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const value: string = target.value;

    if(this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }

    this.searchTimeout = setTimeout((): void => {
      this.debouncedSearchTerm.set(value.trim().toLowerCase());
      this.currentPage = 1; // Reset to 1st page on search
    }, 300);
  }

  public clearSearch(): void {
    this.searchTerm = '';
    this.debouncedSearchTerm.set('');
    this.currentPage = 1;
  }

  // Dynamic categories with counters
  protected get categories(): { name: string; count: number }[] {
    const cats = new Map<string, number>();
    this.products.forEach((p: ProductModel): void => {
      cats.set(p.category, (cats.get(p.category) ?? 0) + 1);
    })

    return [{ name: 'All', count: this.products.length }, ...Array.from(cats, ([name, count]) => ({ name, count }))];
  }

  public selectCategory(category: string): void {
    this.selectedCategory = category;
    this.currentPage = 1;
  }

  public toggleInStockOnly(): void {
    this.inStockOnly = !this.inStockOnly;
    this.currentPage = 1;
  }

  public onSortChange(): void {
    this.currentPage = 1;
  }

  // Clear all filters
  public clearAllFilters(): void {
    this.searchTerm = '';
    this.debouncedSearchTerm.set('');
    this.selectedCategory = 'All';
    this.inStockOnly = false;
    this.selectedSort = 'price-asc';
    this.currentPage = 1;
  }

  // Combined filtering and sorting
  protected get filteredProducts(): ProductModel[] {

    const result: ProductModel[] = this.products.filter((product: ProductModel): boolean => {
      const matchesSearch: boolean = !this.debouncedSearchTerm() ||
        product.name.toLowerCase().includes(this.debouncedSearchTerm().toLowerCase()) ||
        product.description.toLowerCase().includes(this.debouncedSearchTerm().toLowerCase());

      const matchesCategory: boolean = this.selectedCategory === 'All' || product.category === this.selectedCategory;
      const matchesStock: boolean = !this.inStockOnly || product.inStock;

      return matchesSearch && matchesCategory && matchesStock;
    })

    return result.sort((a: ProductModel, b: ProductModel): number => {
      const priceA: number = a.salePrice ?? a.price;
      const priceB: number = b.salePrice ?? b.price;

      switch(this.selectedSort) {
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

  protected get paginatedProducts(): ProductModel[] {
    const start: number = (this.currentPage - 1) * this.pageSize;
    return this.filteredProducts.slice(start, start + this.pageSize);
  }

  protected get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_: unknown, i: number): number => i + 1);
  }

  public goToPage(page: number): void {
    this.currentPage = page;
  }

  public onHeroCta(message: string): void {
    console.log('Hero CTA triggered with message:', message);
  }

  public handleAddToCart(product: ProductModel): void {
    this.totalCartItems += 1;
    console.log(`Added to cart: ${product.name}`);
  }
}
