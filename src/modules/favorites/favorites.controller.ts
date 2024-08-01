import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { FavoriteServices } from './favorites.service';
import { JwtAuth } from '../auth/jwt-auth.guard';
import { FavoritesDto } from './dto/favorites.dto';
import { UserService } from '../users/user.service';

@Controller('favorites')
export class FavoritesControllers {
  constructor(
    private readonly favoriteServices: FavoriteServices,
    private readonly userService: UserService,
  ) {}

  @Post()
  @UseGuards(JwtAuth)
  create(@Body() data: FavoritesDto) {
    const user = this.userService.findOne(data.userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
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
