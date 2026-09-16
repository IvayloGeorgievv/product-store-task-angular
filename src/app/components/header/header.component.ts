import {Component,  signal, WritableSignal, Signal, inject} from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {CartService} from '../../services/cart.service';

@Component({
  imports: [
    RouterLink,
    RouterLinkActive
  ],
  selector: 'app-header',
  styleUrl: './header.component.css',
  templateUrl: './header.component.html',
})
export class HeaderComponent {

  private readonly cartService: CartService = inject(CartService);
  protected readonly cartCount: Signal<number> = this.cartService.totalItems;

  protected readonly isDarkMode: WritableSignal<boolean> = signal<boolean>(false);

  public toggleTheme(): void {
    this.isDarkMode.update((current: boolean) => !current);
    document.body.classList.toggle('dark-mode'); // Triggers css for dark mode
  }
}
