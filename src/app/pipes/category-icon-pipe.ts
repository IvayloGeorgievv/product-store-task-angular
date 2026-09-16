import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'categoryIcon',
})
export class CategoryIconPipe implements PipeTransform {
  private static readonly ICON_MAP: Record<string, string> = {
    audio: 'fa-headphones',
    electronics: 'fa-laptop',
    home: 'fa-couch',
    accessories: 'fa-plug',
  };

  public transform(category: string | undefined | null): string {
    if (!category) {
      return 'fa-box-open';
    }

    const key: string = category.trim().toLowerCase();
    return CategoryIconPipe.ICON_MAP[key] ?? 'fa-box-open';
  }
}
