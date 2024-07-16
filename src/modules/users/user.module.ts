import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { PrismaService } from 'src/database/prisma.service';
import { UsersRepository } from './repositories/user.repository';
import { UsersPrismaRepo } from './repositories/prisma/user.prisma.repository';
import { UsersController } from './user.controller';

@Module({
  controllers: [UsersController],
  providers: [
    UserService,
    PrismaService,
    {
      provide: UsersRepository,
      useClass: UsersPrismaRepo,
    },
  ],
  exports: [UserService],
})
export class UsersModule {}
