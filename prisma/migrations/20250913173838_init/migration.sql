/*
  Warnings:

  - Made the column `slug` on table `Mfo` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Mfo" ALTER COLUMN "slug" SET NOT NULL;
