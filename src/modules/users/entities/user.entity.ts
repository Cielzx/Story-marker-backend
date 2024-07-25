import { Exclude } from 'class-transformer';
import { randomUUID } from 'crypto';

export class User {
  readonly id: string;
  name: string;
  email: string;
  is_admin: boolean;

  passwordResetToken?: string;
  passwordResetExpires?: Date;

  profile_image?: string;

  @Exclude()
  password: string;

  constructor() {
    this.id = randomUUID();
  }
}
