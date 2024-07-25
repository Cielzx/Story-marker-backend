import { PrismaService } from 'src/database/prisma.service';
import { CategoryController } from './category.controller';
import { CategoryServices } from './category.service';
import { CategoryRepository } from './repositories/category.repository';
import { CategoryPrismaRepo } from './repositories/prisma/category.prisma.repository';
import { BadRequestException, Module } from '@nestjs/common';
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
  controllers: [CategoryController],
  providers: [
    CategoryServices,
    PrismaService,
    {
      provide: CategoryRepository,
      useClass: CategoryPrismaRepo,
    },
  ],
  exports: [CategoryServices],
})
export class CategoryModule {}
