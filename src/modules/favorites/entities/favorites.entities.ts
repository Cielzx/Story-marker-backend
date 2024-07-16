import { randomUUID } from 'crypto';

export class FavoriteEntity {
  readonly id: string;

  userId: string;
  stickerId: string;

  constructor() {
    this.id = randomUUID();
  }
}
