import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from '../entities/user.entity';

export abstract class UsersRepository {
  abstract create(data: CreateUserDto): Promise<User> | User;

  abstract findAll(): Promise<User[]> | User[];

  abstract findOne(id: string): Promise<User> | User;

  abstract findByEmail(email: string): Promise<User> | User;

  abstract update(
    data: UpdateUserDto,
    id: string,
    currentUser: any,
  ): Promise<User>;

  abstract delete(id: string): Promise<void> | void;
}
