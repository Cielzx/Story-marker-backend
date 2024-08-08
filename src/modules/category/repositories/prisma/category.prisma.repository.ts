import { Injectable, NotFoundException } from '@nestjs/common';
import { CategoryRepository } from '../category.repository';
import { PrismaService } from 'src/database/prisma.service';
// import { Category } from '@prisma/client';
import { CategoryDto } from '../../dto/category.dto';
import { Category } from '../../entities/category.entity';
import { plainToInstance } from 'class-transformer';
import { UpdateCategoryDto } from '../../dto/category.update.dto';

@Injectable()
export class CategoryPrismaRepo implements CategoryRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: CategoryDto): Promise<Category> {
    const category = new Category();
    Object.assign(category, {
      ...data,
    });

    const newCategory = await this.prisma.category.create({
      data: {
        id: category.id,
        category_name: data.category_name,
        cover_image: data.cover_image,
      },
    });

    return plainToInstance(Category, newCategory);
  }

  async findAll(): Promise<Category[]> {
    const allCategories = await this.prisma.category.findMany({
      select: {
        id: true,
        category_name: true,
        cover_image: true,
        categories: {
          select: {
            id: true,
            item_name: true,
            stickers: {
              select: {
                id: true,
                figure_image: true,
                subCategoryId: true,
              },
            },
          },
        },
      },
    });
    return allCategories;
  }

  async findOne(id: string): Promise<Category> {
    if (!id) {
      throw new NotFoundException('id must be provided!');
    }

    const category = await this.prisma.category.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        category_name: true,
        cover_image: true,
        categories: {
          select: {
            id: true,
            item_name: true,
            cover_image: true,
            stickers: {
              select: {
                id: true,
                figure_image: true,
                subCategoryId: true,
              },
            },
          },
        },
      },
    });

    return plainToInstance(Category, category);
  }

  async findByName(category_name: string): Promise<Category> {
    return await this.prisma.category.findFirst({
      where: {
        category_name,
      },
    });

    // return category
  }

  async update(data: UpdateCategoryDto, id: string): Promise<Category> {
    if (!id) {
      throw new NotFoundException('id must be provided!');
    }

    const updateCategory = await this.prisma.category.update({
      where: { id },
      data: { ...data },
    });

    return updateCategory;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.category.delete({
      where: {
        id,
      },
    });

    return;
  }
}
