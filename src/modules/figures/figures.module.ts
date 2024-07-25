import { BadRequestException, Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { figureControllers } from './figures.controlle';
import { FigureServices } from './figures.service';
import { PrismaService } from 'src/database/prisma.service';
import { FigureRepository } from './repositories/figures.repository';
import { FigurePrismaRepo } from './repositories/prisma/figures.prisma.repository';

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
  controllers: [figureControllers],
  providers: [
    FigureServices,
    PrismaService,
    {
      provide: FigureRepository,
      useClass: FigurePrismaRepo,
    },
  ],
  exports: [FigureServices],
})
export class FiguresModule {}
