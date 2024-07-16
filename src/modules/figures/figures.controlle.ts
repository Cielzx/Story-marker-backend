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
  UseInterceptors,
} from '@nestjs/common';
import { FigureServices } from './figures.service';
import { FigureDto } from './dto/figures.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

@Controller('stickers')
export class figureControllers {
  constructor(private readonly figureService: FigureServices) {}

  @Post('')
  create(@Body() data: FigureDto) {
    return this.figureService.create(data);
  }

  @Get('')
  findAll() {
    return this.figureService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.figureService.findOne(id);
  }

  @Patch('upload/:id')
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
  delete(@Param() id: string) {
    return this.figureService.remove(id);
  }
}
