import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'discount',
})
export class DiscountPipe implements PipeTransform {
  transform(price: number, discountPercent: number = 0): number {
    return Math.round(price * (1 - discountPercent / 100) * 100) / 100;
  }
}
