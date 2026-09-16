import { Service, computed, signal, Signal, WritableSignal } from '@angular/core';
import { Product } from '../models/product.model';
import { CartItem } from '../models/cart-item.model';

@Service()
export class CartService {
  private readonly items: WritableSignal<CartItem[]> = signal<CartItem[]>([]);

  public readonly cartItems: Signal<CartItem[]> = this.items.asReadonly();

  public readonly totalItems: Signal<number> = computed((): number =>
    this.items().reduce((sum: number, item: CartItem): number => sum + item.quantity, 0)
  );

  public readonly totalPrice: Signal<number> = computed((): number =>
    this.items().reduce((sum: number, item: CartItem): number => {
      const price: number = item.product.salePrice ?? item.product.price;
      return sum + price * item.quantity;
    }, 0)
  );

  public addItem(product: Product, quantity: number = 1): void  {
    if(quantity <= 0) {
      return;
    }

    this.items.update((currentItems: CartItem[]): CartItem[] => {
      const existingItemIndex: number = currentItems.findIndex(
        (item: CartItem): boolean => item.product.id === product.id
      );

      if(existingItemIndex > -1) {
        return currentItems.map((item: CartItem, index: number): CartItem =>
          index === existingItemIndex
          ? { ...item, quantity: Math.min(10, item.quantity + quantity)}
          : item
        );
      }

      return [...currentItems, { product, quantity: Math.min(10, quantity)}];
    });
  }

  public removeItem(productId: number): void  {
    this.items.update((currentItems: CartItem[]): CartItem[] =>
      currentItems.filter((item: CartItem): boolean => item.product.id !== productId)
    );
  }

  public updateQuantity(productId: number, quantity: number): void {
    if(quantity <= 0) {
      this.removeItem(productId);
      return;
    }

    const boundedQuantity: number = Math.min(10, Math.max(1, quantity));

    this.items.update((currentItems: CartItem[]): CartItem[] =>
      currentItems.map((item: CartItem): CartItem =>
        item.product.id === productId ? { ...item, quantity: boundedQuantity} : item
      )
    );
  }

  public clearCart(): void {
    this.items.set([]);
  }

  public isInCart(productId: number): boolean {
    return this.items().some((item: CartItem): boolean => item.product.id === productId);
  }
}
