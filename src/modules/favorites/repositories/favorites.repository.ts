import { FavoritesDto } from '../dto/favorites.dto';
import { FavoriteEntity } from '../entities/favorites.entities';

export abstract class FavoriteRepository {
  abstract create(data: FavoritesDto): Promise<FavoriteEntity>;

  abstract findAll(): Promise<FavoriteEntity[]>;

  abstract findOne(id: string): Promise<FavoriteEntity>;

  abstract delete(id: string): Promise<void>;
}
