import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FigureServices } from './figures.service';
import { FigureDto, UserStickerDto } from './dto/figures.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { JwtAuth } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../auth/adm-auth.guard';
import { UpdateFigureDto } from './dto/update-figure.dto';

@Controller('stickers')
export class figureControllers {
  constructor(private readonly figureService: FigureServices) {}

  @Post('')
  @UseGuards(JwtAuth, AdminGuard)
  create(@Body() data: FigureDto) {
    return this.figureService.create(data);
  }

  @Post('user-sticker/:id')
  @UseGuards(JwtAuth)
  userStickercreate(@Body() data: UserStickerDto, @Param('id') userId: string) {
    return this.figureService.userStickerCreate(userId, data);
  }

  @Get('')
  findAll() {
    return this.figureService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.figureService.findOne(id);
  }

  @Patch('update/:id')
  @UseGuards(JwtAuth, AdminGuard)
  update(@Body() data: UpdateFigureDto, @Param('id') id: string) {
    return this.figureService.update(data, id);
  }

  @Patch('upload-to-png/:id')
  @UseGuards(JwtAuth)
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'figure_image', maxCount: 1 }]),
  )
  uploadPng(
    @UploadedFiles()
    files: {
      figure_image?: Express.Multer.File[];
    },
    @Param('id') id: string,
  ) {
    const { figure_image } = files;
    return this.figureService.uploadPng(figure_image[0], id);
  }

  @Patch('upload-to-svg/:id')
  @UseGuards(JwtAuth)
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'figure_image', maxCount: 1 }]),
  )
  upload(
    @UploadedFiles()
    files: {
      figure_image?: Express.Multer.File[];
    },
    @Param('id') id: string,
  ) {
    const { figure_image } = files;
    return this.figureService.upload(figure_image[0], id);
  }

  @Delete(':id')
  @HttpCode(204)
  @UseGuards(JwtAuth, AdminGuard)
  delete(@Param('id') id: string) {
    return this.figureService.remove(id);
  }
  @Delete('user-sticker/:id/:userId')
  @HttpCode(204)
  @UseGuards(JwtAuth, AdminGuard)
  userStickerdelete(@Param('id') id: string, @Param('userId') userId: string) {
    return this.figureService.userStickerRemove(id, userId);
  }
}
