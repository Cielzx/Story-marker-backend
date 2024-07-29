import { BadRequestException, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { PrismaService } from 'src/database/prisma.service';
import { UsersRepository } from './repositories/user.repository';
import { UsersPrismaRepo } from './repositories/prisma/user.prisma.repository';
import { UsersController } from './user.controller';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: './temp',
        filename: (_, file, cb) => {
          cb(null, file.originalname);
        },
      }),
      fileFilter: (_, file, cb) => {
        if (
          file.mimetype === 'image/jpeg' ||
          file.mimetype === 'image/png' ||
          file.mimetype === 'image/heif'
        ) {
          return cb(null, true);
        } else {
          return cb(new BadRequestException('Only the jpeg allowed'), false);
        }
      },
    }),
  ],
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
