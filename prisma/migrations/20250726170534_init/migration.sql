/*
  Warnings:

  - Added the required column `nameUk` to the `NewsCategory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "NewsCategory" ADD COLUMN     "nameUk" TEXT NOT NULL;
