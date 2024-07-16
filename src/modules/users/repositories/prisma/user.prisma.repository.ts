import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../user.repository';
import { PrismaService } from 'src/database/prisma.service';
import { CreateUserDto } from '../../dto/create-user.dto';
import { User } from '../../entities/user.entity';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UsersPrismaRepo implements UsersRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateUserDto): Promise<User> {
    const user = new User();
    Object.assign(user, {
      ...data,
    });

    if (!data.is_admin) {
      data.is_admin = false;
    }

    const newUser = await this.prisma.user.create({
      data: {
        id: user.id,
        name: data.name,
        email: data.email,
        password: data.password,
        is_admin: data.is_admin,
      },
    });

    return plainToInstance(User, newUser);
  }

  async findAll(): Promise<User[]> {
    const users = this.prisma.user.findMany();
    return users;
  }

  async findOne(id: string): Promise<User> {
    const user = this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    return plainToInstance(User, user);
  }

  async findByEmail(email: string): Promise<User> {
    const user = this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    return user;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({
      where: {
        id,
      },
    });
  }
}
