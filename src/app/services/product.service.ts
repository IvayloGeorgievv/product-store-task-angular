import { Service } from '@angular/core';
import { Product } from '../models/product.model';
import { MOCK_PRODUCTS } from '../data/mock-products';

@Service()
export class ProductService {

  private readonly products: Product[] = MOCK_PRODUCTS;

  public getAll(): Product[] {
    return [...this.products];
  }

  public getById(id: number): Product | undefined {
    return this.products.find((p: Product): boolean => p.id === id);
  }

  public getByCategory(category: string): Product[] {
    return this.products.filter((p: Product): boolean => p.category.toLowerCase() === category.toLowerCase());
  }

  public getRelated(product: Product): Product[] {
    return this.products.filter((p: Product): boolean => product.relatedIds.includes(p.id));
  }

  public getCategories(): string[] {
    const uniqueCategories: Set<string> = new Set(this.products.map((p: Product): string => p.category));
    return Array.from(uniqueCategories);
  }

  public search(term: string): Product[] {
    const normalizedTerm: string = term.trim().toLowerCase();
    if(!normalizedTerm) {
      return this.getAll();
    }

    return this.products.filter((p: Product): boolean =>
      p.name.toLowerCase().includes(normalizedTerm) ||
      p.description.toLowerCase().includes(normalizedTerm)
    );
  }

  public getFeatured(): Product[] {
    return [...this.products]
      .sort((a: Product, b: Product): number => b.rating - a.rating || b.reviewCount - a.reviewCount)
      .slice(0, 4);
  }


}
