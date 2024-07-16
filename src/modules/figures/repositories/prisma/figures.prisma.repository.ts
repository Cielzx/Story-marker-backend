import { Injectable } from '@nestjs/common';
import { FigureRepository } from '../figures.repository';
import { PrismaService } from 'src/database/prisma.service';
import { FigureDto } from '../../dto/figures.dto';
import { FigureEntity } from '../../entities/figures.entities';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class FigurePrismaRepo implements FigureRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: FigureDto): Promise<FigureEntity> {
    const figure = new FigureEntity();
    Object.assign(figure, {
      ...data,
    });

    const { subCategoryId } = data;

    const newFigure = await this.prisma.figures.create({
      data: {
        id: figure.id,
        figure_name: data.figure_name,
        figure_image: data.figure_image,
        subCategoryId,
      },
    });

    return plainToInstance(FigureEntity, newFigure);
  }

  async findAll(): Promise<FigureEntity[]> {
    const AllFigures = await this.prisma.figures.findMany();

    return AllFigures;
  }

  async findOne(id: string): Promise<FigureEntity> {
    const figure = await this.prisma.figures.findUnique({
      where: { id },
    });

    return plainToInstance(FigureEntity, figure);
  }

  async update(data: FigureDto, id: string): Promise<FigureEntity> {
    const updateFigure = await this.prisma.figures.update({
      where: { id },
      data: { ...data },
    });

    return updateFigure;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.figures.delete({
      where: {
        id,
      },
    });
    return;
  }
}
