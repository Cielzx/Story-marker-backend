import { Module } from '@nestjs/common';
import { FavoritesControllers } from './favorites.controller';
import { FavoriteServices } from './favorites.service';
import { PrismaService } from 'src/database/prisma.service';
import { FavoriteRepository } from './repositories/favorites.repository';
import { FavoritePrismaRepo } from './repositories/prisma/favorites.prisma.repository';
import { UsersModule } from '../users/user.module';

@Module({
  controllers: [FavoritesControllers],
  imports: [UsersModule],
  providers: [
    FavoriteServices,
    PrismaService,
    {
      provide: FavoriteRepository,
      useClass: FavoritePrismaRepo,
    },
  ],
  exports: [FavoriteServices],
})
export class FavoritesModule {}
