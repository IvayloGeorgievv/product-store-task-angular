import {Component, input, output, InputSignal, OutputEmitterRef} from '@angular/core';

@Component({
  imports: [],
  selector: 'app-hero-banner',
  styleUrl: './hero-banner.component.css',
  templateUrl: './hero-banner.component.html',
})
export class HeroBannerComponent {

  public readonly announcement: InputSignal<string> = input<string>('');

  protected readonly headline: string = 'Summer Drop';
  protected readonly subHeadline: string = 'Discover our latest gear and gadgets.'

  public readonly ctaClicked: OutputEmitterRef<string> = output<string>();

  public onPrimaryClick(): void {
    this.ctaClicked.emit('Message');
  }
}
