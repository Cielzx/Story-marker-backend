import { Injectable } from '@nestjs/common';
import { FavoriteRepository } from '../favorites.repository';
import { PrismaService } from 'src/database/prisma.service';
import { FavoritesDto } from '../../dto/favorites.dto';
import { FavoriteEntity } from '../../entities/favorites.entities';
import { plainToInstance } from 'class-transformer';
import { FigureEntity } from 'src/modules/figures/entities/figures.entities';

@Injectable()
export class FavoritePrismaRepo implements FavoriteRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: FavoritesDto): Promise<FavoriteEntity> {
    const favorite = new FavoriteEntity();
    Object.assign(favorite, {
      ...data,
    });

    const newFavorite = await this.prisma.favorite.create({
      data: {
        id: favorite.id,
        userId: data.userId,
        stickerId: data.stickerId,
      },
    });

    return plainToInstance(FavoriteEntity, newFavorite);
  }

  async findAll(): Promise<FavoriteEntity[]> {
    const favorites = await this.prisma.favorite.findMany();

    return favorites;
  }

  async findOne(id: string): Promise<FavoriteEntity> {
    const favorite = await this.prisma.favorite.findUnique({
      where: {
        id,
      },
    });

    return favorite;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.favorite.delete({
      where: {
        id,
      },
    });

    return;
  }
}
