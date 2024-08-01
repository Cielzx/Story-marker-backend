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
        const allowedMimeTypes = [
          'image/heif',
          'image/heic',
          'image/jpeg',
          'image/png',
        ];
        if (allowedMimeTypes.includes(file.mimetype)) {
          return cb(null, true);
        } else {
          return cb(new BadRequestException('Format not suported'), false);
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
  exports: [UserService, UsersRepository],
})
export class UsersModule {}
