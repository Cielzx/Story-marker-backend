import { Injectable, NotFoundException } from '@nestjs/common';
import { FavoriteRepository } from './repositories/favorites.repository';
import { FavoritesDto } from './dto/favorites.dto';
import { UsersRepository } from '../users/repositories/user.repository';
import { UserService } from '../users/user.service';

@Injectable()
export class FavoriteServices {
  constructor(
    private favoritesRepository: FavoriteRepository,
    private userService: UserService,
  ) {}

  async create(data: FavoritesDto) {
    const favorite = await this.favoritesRepository.create(data);

    const stickerId = await this.favoritesRepository.findOne(data.stickerId);

    const user = this.userService.findOne(data.userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (stickerId) {
      throw new Error('This is already in your favorites');
    }

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
