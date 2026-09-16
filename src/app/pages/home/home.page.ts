import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { HeroBannerComponent } from '../../components/hero-banner/hero-banner.component';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import {CategoryIconPipe} from '../../pipes/category-icon-pipe';

interface CategoryCard {
  name: string;
  count: number;
}

@Component({
  imports: [RouterLink, HeroBannerComponent, ProductCardComponent, CategoryIconPipe],
  selector: 'app-home',
  styleUrl: './home.page.css',
  templateUrl: './home.page.html',
})
export class HomePage implements OnInit {
  private readonly productService: ProductService = inject(ProductService);
  private readonly router: Router = inject(Router);

  protected featuredProducts: Product[] = [];
  protected categoryCards: CategoryCard[] = [];

  public ngOnInit(): void {
    this.featuredProducts = this.productService.getFeatured();

    const allProducts: Product[] = this.productService.getAll();
    const categories: string[] = this.productService.getCategories();

    this.categoryCards = categories.map((cat: string): CategoryCard => ({
      name: cat,
      count: allProducts.filter((p: Product): boolean => p.category === cat).length,
    }));
  }

  public onHeroCtaClick(message: string): void {
    console.log('Hero CTA', message);
    this.router.navigate(['/products']);
  }

  public handleAddToCart(product: Product): void {
    console.log(`${product.name} added to cart`);
  }
}
