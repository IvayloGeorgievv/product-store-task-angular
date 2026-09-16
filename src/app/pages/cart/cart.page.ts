import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../models/cart-item.model';

@Component({
  imports: [
    RouterLink
  ],
  selector: 'app-cart',
  styleUrl: './cart.page.css',
  templateUrl: './cart.page.html',
})
export class CartPage {
  protected readonly cartService: CartService = inject(CartService);

  public updateQuantity(productId: number, newQuantity: number): void {
    this.cartService.updateQuantity(productId, newQuantity);
  }

  public removeItem(productId: number): void {
    this.cartService.removeItem(productId);
  }

  public clearCart(): void {
    this.cartService.clearCart();
  }

  public getLineTotal(item: CartItem): number {
    const unitPrice: number = item.product.salePrice ?? item.product.price;
    return unitPrice * item.quantity;
  }
}
