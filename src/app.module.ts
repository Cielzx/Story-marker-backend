import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { CategoryModule } from './modules/category/category.module';
import { FiguresModule } from './modules/figures/figures.module';
import { CategoriesModule } from './modules/categories/categories.module';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    CategoryModule,
    CategoriesModule,
    FiguresModule,
  ],
})
export class AppModule {}
