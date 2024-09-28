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
        created_at: true,
        stickers: {
          select: {
            id: true,
            figure_image: true,
            subCategoryId: true,
            created_at: true,
            is_favorited: true,
          },
          orderBy: {
            created_at: 'asc',
          },
        },
      },
      orderBy: { created_at: 'asc' },
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
        created_at: true,
        stickers: {
          select: {
            id: true,
            figure_image: true,
            subCategoryId: true,
            created_at: true,
            is_favorited: true,
          },
          orderBy: {
            created_at: 'asc',
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

  async delete(id: string): Promise<void> {
    await this.prisma.subCategorie.delete({
      where: {
        id,
      },
    });

    return;
  }
}
