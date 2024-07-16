import { Module } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CategoriesController } from './categories.controller';
import { CategoriesServices } from './categories.service';
import { CategoriesRepository } from './repositories/categories.repository';
import { CategoriesPrismaRepo } from './repositories/prisma/categories.prisma.repository';

@Module({
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
