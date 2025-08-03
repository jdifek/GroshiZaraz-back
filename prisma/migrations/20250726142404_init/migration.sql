/*
  Warnings:

  - You are about to drop the column `avatarUrl` on the `Author` table. All the data in the column will be lost.
  - Added the required column `avatar` to the `Author` table without a default value. This is not possible if the table is not empty.
  - Added the required column `experience` to the `Author` table without a default value. This is not possible if the table is not empty.
  - Added the required column `position` to the `Author` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `Author` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Author" DROP COLUMN "avatarUrl",
ADD COLUMN     "achievements" TEXT[],
ADD COLUMN     "avatar" TEXT NOT NULL,
ADD COLUMN     "color" TEXT,
ADD COLUMN     "email" TEXT,
ADD COLUMN     "experience" TEXT NOT NULL,
ADD COLUMN     "expertise" TEXT[],
ADD COLUMN     "followers" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "linkedin" TEXT,
ADD COLUMN     "position" TEXT NOT NULL,
ADD COLUMN     "slug" TEXT NOT NULL,
ADD COLUMN     "telegram" TEXT,
ADD COLUMN     "twitter" TEXT;
