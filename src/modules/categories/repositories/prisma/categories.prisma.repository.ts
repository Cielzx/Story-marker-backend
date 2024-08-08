import { Injectable, NotFoundException } from '@nestjs/common';
import { CategoriesRepository } from '../categories.repository';
import { PrismaService } from 'src/database/prisma.service';
import { CategoriesDto } from '../../dto/categories.dto';
import { CategoriesEntity } from '../../entities/categories.entities';
import { plainToInstance } from 'class-transformer';
import { UpdateCategoriesDto } from '../../dto/update.categories.dto';

@Injectable()
export class CategoriesPrismaRepo implements CategoriesRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: CategoriesDto): Promise<CategoriesEntity> {
    const categories = new CategoriesEntity();
    Object.assign(categories, {
      ...data,
    });

    const { categoryId } = data;

    const newCategorie = await this.prisma.subCategorie.create({
      data: {
        id: categories.id,
        item_name: data.item_name,
        categoryId,
      },
    });

    return plainToInstance(CategoriesEntity, newCategorie);
  }

  async findAll(): Promise<CategoriesEntity[]> {
    const categories = await this.prisma.subCategorie.findMany({
      select: {
        id: true,
        item_name: true,
        cover_image: true,
        categoryId: true,
        stickers: {
          select: {
            id: true,
            figure_image: true,
          },
        },
      },
    });
    return categories;
  }

  async findOne(id: string): Promise<CategoriesEntity> {
    if (!id) {
      throw new NotFoundException('id must be provided!');
    }

    const subCategorie = await this.prisma.subCategorie.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        item_name: true,
        cover_image: true,
        categoryId: true,
        stickers: {
          select: {
            id: true,
            figure_image: true,
            subCategoryId: true,
          },
        },
      },
    });

    return plainToInstance(CategoriesEntity, subCategorie);
  }

  async update(
    data: UpdateCategoriesDto,
    id: string,
  ): Promise<CategoriesEntity> {
    if (!id) {
      throw new NotFoundException('id must be provided!');
    }

    const updateSubCategories = await this.prisma.subCategorie.update({
      where: { id },
      data: { ...data },
    });

    return updateSubCategories;
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
    await this.prisma.subCategorie.delete({
      where: {
        id,
      },
    });

    return;
  }
}
