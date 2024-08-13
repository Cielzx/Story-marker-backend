/*
  Warnings:

  - You are about to drop the column `subscriptionId` on the `Plan` table. All the data in the column will be lost.
  - Added the required column `planId` to the `subscriptions` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Plan" DROP CONSTRAINT "Plan_subscriptionId_fkey";

-- AlterTable
ALTER TABLE "Plan" DROP COLUMN "subscriptionId";

-- AlterTable
ALTER TABLE "subscriptions" ADD COLUMN     "planId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
