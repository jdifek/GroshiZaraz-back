/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Mfo` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Mfo" ADD COLUMN     "slug" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Mfo_slug_key" ON "Mfo"("slug");
