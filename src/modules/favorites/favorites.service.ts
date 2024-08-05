import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FavoriteRepository } from './repositories/favorites.repository';
import { FavoritesDto } from './dto/favorites.dto';
import { UsersRepository } from '../users/repositories/user.repository';
import { UserService } from '../users/user.service';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class FavoriteServices {
  constructor(
    private favoritesRepository: FavoriteRepository,
    private userService: UserService,
    private prismaService: PrismaService,
  ) {}

  async create(data: FavoritesDto) {
    const { userId, stickerId } = data;

    const existingFavorite = await this.prismaService.favorite.findUnique({
      where: {
        userId_stickerId: { userId, stickerId },
      },
    });

    if (existingFavorite) {
      throw new ConflictException('Favorite already exists');
    }

    const user = this.userService.findOne(data.userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const favorite = await this.favoritesRepository.create(data);

    return favorite;
  }

  async findAll() {
    const allFavorites = await this.favoritesRepository.findAll();

    return allFavorites;
  }

  async findOne(id: string) {
    const favorite = await this.favoritesRepository.findOne(id);

    if (!favorite) {
      throw new NotFoundException('User not found');
    }

    return favorite;
  }

  async remove(id: string) {
    await this.favoritesRepository.delete(id);

    return;
  }
}
