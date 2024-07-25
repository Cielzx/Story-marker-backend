import { BadRequestException, Module } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CategoriesController } from './categories.controller';
import { CategoriesServices } from './categories.service';
import { CategoriesRepository } from './repositories/categories.repository';
import { CategoriesPrismaRepo } from './repositories/prisma/categories.prisma.repository';
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
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
          return cb(null, true);
        } else {
          return cb(
            new BadRequestException('Only the jpeg and png allowed'),
            false,
          );
        }
      },
    }),
  ],
  controllers: [CategoriesController],
  providers: [
    CategoriesServices,
    PrismaService,
    {
      provide: CategoriesRepository,
      useClass: CategoriesPrismaRepo,
    },
  ],
  exports: [CategoriesServices],
})
export class CategoriesModule {}
