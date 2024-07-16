import { PrismaService } from 'src/database/prisma.service';
import { CategoryController } from './category.controller';
import { CategoryServices } from './category.service';
import { CategoryRepository } from './repositories/category.repository';
import { CategoryPrismaRepo } from './repositories/prisma/category.prisma.repository';
import { Module } from '@nestjs/common';

@Module({
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
