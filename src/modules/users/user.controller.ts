import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuth } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../auth/adm-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

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
  update(@Body() data: UpdateUserDto, @Param('id') id: string, @Req() req) {
    const currentUser = req.user;
    return this.userService.update(data, id, currentUser);
  }

  @Patch('upload/:id')
  @UseGuards(JwtAuth)
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'profile_image', maxCount: 1 }]),
  )
  upload(
    @UploadedFiles()
    files: {
      profile_image?: Express.Multer.File[];
    },
    @Param('id') id: string,
  ) {
    const { profile_image } = files;
    return this.userService.upload(profile_image[0], id);
  }

  @Delete(':id')
  @UseGuards(JwtAuth, AdminGuard)
  @HttpCode(204)
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
