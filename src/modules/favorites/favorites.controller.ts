import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { FavoriteServices } from './favorites.service';
import { JwtAuth } from '../auth/jwt-auth.guard';
import { FavoritesDto } from './dto/favorites.dto';

@Controller('favorites')
export class FavoritesControllers {
  constructor(private readonly favoriteServices: FavoriteServices) {}

  @Post()
  @UseGuards(JwtAuth)
  create(@Body() data: FavoritesDto) {
    return this.favoriteServices.create(data);
  }

  @Get('')
  @UseGuards(JwtAuth)
  findAll() {
    return this.favoriteServices.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuth)
  findOne(@Param('id') id: string) {
    return this.favoriteServices.findOne(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuth)
  delete(@Param('id') id: string) {
    return this.favoriteServices.remove(id);
  }
}
