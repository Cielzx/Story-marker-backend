import { Injectable } from '@nestjs/common';
import { CategoriesRepository } from '../categories.repository';
import { PrismaService } from 'src/database/prisma.service';
import { CategoriesDto } from '../../dto/categories.dto';
import { CategoriesEntity } from '../../entities/categories.entities';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class CategoriesPrismaRepo implements CategoriesRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: CategoriesDto): Promise<CategoriesEntity> {
    const categories = new CategoriesEntity();
    Object.assign(categories, {
      ...data,
    });

    const { categoryId } = data;

    const newCategorie = await this.prisma.categorie.create({
      data: {
        id: categories.id,
        item_name: data.item_name,
        categoryId,
      },
    });

    return plainToInstance(CategoriesEntity, newCategorie);
  }

  async findAll(): Promise<CategoriesEntity[]> {
    const categories = await this.prisma.categorie.findMany({
      select: {
        id: true,
        item_name: true,
        categoryId: true,
        figures: {
          select: {
            id: true,
            figure_name: true,
            figure_image: true,
          },
        },
      },
    });
    return categories;
  }

  // async findByName(item_name:string): Promise<CategoriesEntity> {
  //   const categorie = await this.prisma.categories.findUnique({
  //       where:{
  //           item_name
  //       }
  //   });
  //   return categorie;
  // }

  async delete(id: string): Promise<void> {
    await this.prisma.categorie.delete({
      where: {
        id,
      },
    });

    return;
  }
}
