import { randomUUID } from 'crypto';

export class CategoriesEntity {
  readonly id: string;

  item_name: string;
  cover_image?: string;
  categoryId: string;

  constructor() {
    this.id = randomUUID();
  }
}
