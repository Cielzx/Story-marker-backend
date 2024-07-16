import { Exclude } from 'class-transformer';
import { randomUUID } from 'crypto';

export class User {
  readonly id: string;
  name: string;
  email: string;
  is_admin: boolean;

  @Exclude()
  password: string;

  constructor() {
    this.id = randomUUID();
  }
}
