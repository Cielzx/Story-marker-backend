import { Injectable, NotFoundException } from '@nestjs/common';
import { FigureDto } from './dto/figures.dto';
import { UpdateFigureDto } from './dto/update-figure.dto';
import { v2 as cloud } from 'cloudinary';
import { FigureRepository } from './repositories/figures.repository';

@Injectable()
export class FigureServices {
  constructor(private figureRepository: FigureRepository) {}

  async create(data: FigureDto) {
    const figure = await this.figureRepository.create(data);

    return figure;
  }

  async findAll() {
    const allFigures = await this.figureRepository.findAll();
    return allFigures;
  }

  async findOne(id: string) {
    const figure = await this.figureRepository.findOne(id);

    if (!figure) {
      throw new NotFoundException('Figure not found!');
    }
    return figure;
  }

  async upload(figure_image: Express.Multer.File, id: string) {
    cloud.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.API_KEY,
      api_secret: process.env.API_SECRET,
    });

    const findFigure = await this.figureRepository.findOne(id);

    if (!findFigure) {
      throw new NotFoundException('Figure not found!');
    }

    const imageUpload = await cloud.uploader.upload(
      figure_image.path,
      { resource_type: 'image' },
      (error, result) => {
        return result;
      },
    );

    const update = await this.figureRepository.update(
      {
        figure_image: imageUpload.secure_url,
      },
      id,
    );

    return update;
  }

  async remove(id: string) {
    await this.figureRepository.delete(id);

    return;
  }
}
