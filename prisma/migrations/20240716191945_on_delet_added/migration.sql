-- DropForeignKey
ALTER TABLE "Favorite" DROP CONSTRAINT "Favorite_stickerId_fkey";

-- DropForeignKey
ALTER TABLE "categories" DROP CONSTRAINT "categories_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "figures" DROP CONSTRAINT "figures_subCategoryId_fkey";

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "figures" ADD CONSTRAINT "figures_subCategoryId_fkey" FOREIGN KEY ("subCategoryId") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_stickerId_fkey" FOREIGN KEY ("stickerId") REFERENCES "figures"("id") ON DELETE CASCADE ON UPDATE CASCADE;
