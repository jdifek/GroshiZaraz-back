/*
  Warnings:

  - Made the column `slug` on table `Question` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Question" ALTER COLUMN "slug" SET NOT NULL;
