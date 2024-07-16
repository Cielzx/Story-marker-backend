import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuth } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../auth/adm-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @Post('')
  create(@Body() data: CreateUserDto) {
    return this.userService.create(data);
  }

  @Get('')
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuth)
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch('update/:id')
  @UseGuards(JwtAuth)
  update(@Body() data: UpdateUserDto, @Param('id') id: string) {
    return this.userService.update(data, id);
  }

  @Delete(':id')
  @UseGuards(JwtAuth, AdminGuard)
  @HttpCode(204)
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
