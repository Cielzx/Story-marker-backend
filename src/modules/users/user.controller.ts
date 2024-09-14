import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Req,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuth } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../auth/adm-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { CreateFontDto } from './dto/create-font.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @Post('fonts')
  @UseGuards(JwtAuth, AdminGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './src/modules/users/uploads/fonts',
        filename: (req, file, cb) => {
          cb(null, file.originalname);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(otf|ttf)$/)) {
          return cb(
            new BadRequestException('Only font files are allowed!'),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  async uploadFont(
    @UploadedFile() file: Express.Multer.File,
    @Body() data: { name: string },
  ) {
    const font = await this.userService.createFont({
      name: data.name,
      fileUrl: `/uploads/fonts/${file.filename}`,
      format: file.mimetype,
    });

    return font;
  }

  @Get('fonts')
  async getAllFonts() {
    return this.userService.getAllFonts();
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

  @Delete('fonts/:id')
  @UseGuards(JwtAuth, AdminGuard)
  @HttpCode(204)
  removeFont(@Param('id') id: string) {
    return this.userService.removeFont(id);
  }
}
