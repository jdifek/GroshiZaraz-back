/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `NewsCategory` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `NewsCategory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "NewsCategory" ADD COLUMN     "slug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "NewsCategory_slug_key" ON "NewsCategory"("slug");
