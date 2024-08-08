import { randomUUID } from 'crypto';

export class FigureEntity {
  readonly id: string;

  figure_image: string;
  subCategoryId: string;

  constructor() {
    this.id = randomUUID();
  }
}
