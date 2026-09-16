import { Routes } from '@angular/router';
import { HomePage } from './pages/home/home.page';
import { ProductListPage } from './pages/product-list/product-list.page';
import { ProductDetailPage } from './pages/product-detail/product-detail.page';
import { CartPage } from './pages/cart/cart.page';
import { NotFoundPage } from './pages/not-found/not-found.page'
import { AboutPage } from './pages/about/about.page';
import {ProductSpecsComponent} from './pages/product-detail/components/product-specs/product-specs.component';
import {ProductReviewsComponent} from './pages/product-detail/components/product-reviews/product-reviews.component';
import {cartNotEmptyGuard} from './guards/cart-not-empty-guard';
import {CheckoutPlaceholder} from './pages/checkout-placeholder/checkout-placeholder';

export const routes: Routes = [
  {
    path: '',
    component: HomePage,
    title: 'HomePage — ProductStore',
  },
  {
    path: 'products',
    component: ProductListPage,
    title: 'Products — ProductStore',
  },
  {
    path: 'products/:id',
    component: ProductDetailPage,
    title: 'Product Details — ProductStore',
    children: [
      { path: '', redirectTo: 'specs', pathMatch: 'full' },
      { path: 'specs', component: ProductSpecsComponent },
      { path: 'reviews', component: ProductReviewsComponent },
    ],
  },
  {
    path: 'cart',
    component: CartPage,
    title: 'Shopping Cart — ProductStore',
  },
  {
    path: 'checkout',
    component: CheckoutPlaceholder,
    canActivate: [cartNotEmptyGuard],
    title: 'Checkout — ProductStore',
  },
  {
    path: 'about',
    loadComponent: () => import('./pages/about/about.page').then((m) => m.AboutPage),
    title: 'About Us — ProductStore'
  },
  {
    path: '**',
    component: NotFoundPage,
    title: '404 Not Found — ProductStore',
  },
];
