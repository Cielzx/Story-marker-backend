import { randomUUID } from 'crypto';

export class Category {
  readonly id: string;

  category_name: string;
  cover_image?: string;

  constructor() {
    this.id = randomUUID();
  }
}
