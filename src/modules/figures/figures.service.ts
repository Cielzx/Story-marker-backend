import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { FigureDto } from './dto/figures.dto';
import { UpdateFigureDto } from './dto/update-figure.dto';
import { v2 as cloud } from 'cloudinary';
import * as sharp from 'sharp';
import * as potrace from 'potrace';
import { promisify } from 'util';
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

  async update(data: UpdateFigureDto, id: string) {
    const stickerUpdate = await this.figureRepository.update(data, id);

    if (!id) {
      throw new NotFoundException('Sticker not found');
    }

    return stickerUpdate;
  }

  async uploadPng(figure_image: Express.Multer.File, id: string) {
    cloud.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.API_KEY,
      api_secret: process.env.API_SECRET,
    });

    const findFigure = await this.figureRepository.findOne(id);

    if (!findFigure) {
      throw new NotFoundException('Sticker not found!');
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

  async upload(figure_image: Express.Multer.File, id: string) {
    cloud.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.API_KEY,
      api_secret: process.env.API_SECRET,
    });

    const findFigure = await this.figureRepository.findOne(id);
    if (!findFigure) {
      throw new NotFoundException('Sticker not found!');
    }

    try {
      const svgContent = await this.convertPngToSvg(figure_image.path);

      if (!svgContent || svgContent.trim().length === 0) {
        throw new InternalServerErrorException(
          'SVG conversion failed: empty content',
        );
      }

      const svgUpload = await cloud.uploader.upload(
        `data:image/svg+xml;base64,${Buffer.from(svgContent).toString('base64')}`,
        { resource_type: 'image', format: 'svg' },
      );

      if (!svgUpload || !svgUpload.secure_url) {
        throw new InternalServerErrorException(
          'SVG upload failed: no URL returned',
        );
      }

      if (!svgUpload.secure_url.endsWith('.svg')) {
        throw new InternalServerErrorException('Uploaded file is not an SVG');
      }

      const update = await this.figureRepository.update(
        {
          figure_image: svgUpload.secure_url,
        },
        id,
      );

      return update;
    } catch (error) {
      console.error('Error during image processing:', error);
      throw new InternalServerErrorException(
        'An error occurred during image processing',
      );
    }
  }

  async convertPngToSvg(imagePath: string): Promise<string> {
    try {
      const grayScaleBuffer = await sharp(imagePath).greyscale().toBuffer();

      const trace = promisify(potrace.trace);
      const svgString = await trace(grayScaleBuffer);

      if (!svgString || svgString.trim().length === 0) {
        throw new InternalServerErrorException(
          'Conversion to SVG failed: empty SVG content',
        );
      }

      return svgString;
    } catch (error) {
      console.error('Error during PNG to SVG conversion:', error);
      throw new InternalServerErrorException(
        'An error occurred during PNG to SVG conversion',
      );
    }
  }

  async remove(id: string) {
    if (!id) {
      throw new NotFoundException('Figure not found!');
    }
    await this.figureRepository.delete(id);

    return;
  }
}
