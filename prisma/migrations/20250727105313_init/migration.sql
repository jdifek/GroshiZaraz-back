/*
  Warnings:

  - You are about to drop the `Tag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_NewsTags` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[slugUk]` on the table `News` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `bodyUk` to the `News` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slugUk` to the `News` table without a default value. This is not possible if the table is not empty.
  - Added the required column `titleUk` to the `News` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_NewsTags" DROP CONSTRAINT "_NewsTags_A_fkey";

-- DropForeignKey
ALTER TABLE "_NewsTags" DROP CONSTRAINT "_NewsTags_B_fkey";

-- AlterTable
ALTER TABLE "News" ADD COLUMN     "bodyUk" TEXT NOT NULL,
ADD COLUMN     "slugUk" TEXT NOT NULL,
ADD COLUMN     "titleUk" TEXT NOT NULL;

-- DropTable
DROP TABLE "Tag";

-- DropTable
DROP TABLE "_NewsTags";

-- CreateIndex
CREATE UNIQUE INDEX "News_slugUk_key" ON "News"("slugUk");
