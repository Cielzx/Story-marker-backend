import { BadRequestException, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { PrismaService } from 'src/database/prisma.service';
import { UsersRepository } from './repositories/user.repository';
import { UsersPrismaRepo } from './repositories/prisma/user.prisma.repository';
import { UsersController } from './user.controller';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: './temp',
        filename: (_, file, cb) => {
          const ext = path.extname(file.originalname);
          const fileName = `${path.basename(file.originalname, ext)}-${Date.now()}${ext}`;
          cb(null, fileName);
        },
      }),
      fileFilter: (_, file, cb) => {
        const allowedTypes = /jpg|jpeg|png|heif|heic/;
        const extName = allowedTypes.test(
          path.extname(file.originalname).toLowerCase(),
        );
        const mimeType = allowedTypes.test(file.mimetype);
        if (mimeType && extName) {
          return cb(null, true);
        } else {
          return cb(
            new BadRequestException(`Only the ${allowedTypes} allowed`),
            false,
          );
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
