import { User } from '@prisma/client';
import { CreateUserDto } from '../dto/create-user.dto';

export abstract class UsersRepository {
  abstract create(data: CreateUserDto): Promise<User> | User;

  abstract findAll(): Promise<User[]> | User[];

  abstract findOne(id: string): Promise<User> | User;

  abstract findByEmail(email: string): Promise<User> | User;

  abstract delete(id: string): Promise<void> | void;
}
