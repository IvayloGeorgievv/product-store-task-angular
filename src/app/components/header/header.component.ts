import {Component, input, signal, WritableSignal, InputSignal} from '@angular/core';

@Component({
  imports: [],
  selector: 'app-header',
  styleUrl: './header.component.css',
  templateUrl: './header.component.html',
})
export class HeaderComponent {

  public readonly cartCount: InputSignal<number> = input<number>(0);

  protected readonly isDarkMode: WritableSignal<boolean> = signal<boolean>(false);

  public toggleTheme(): void {
    this.isDarkMode.update((current: boolean) => !current);
    document.body.classList.toggle('dark-mode'); // Triggers css for dark mode
  }
}
