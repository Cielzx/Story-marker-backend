/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `figures` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "figures" ADD COLUMN     "userId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "figures_userId_key" ON "figures"("userId");

-- AddForeignKey
ALTER TABLE "figures" ADD CONSTRAINT "figures_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
