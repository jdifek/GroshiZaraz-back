/*
  Warnings:

  - Added the required column `descriptionRu` to the `MfoSatelliteKey` table without a default value. This is not possible if the table is not empty.
  - Added the required column `descriptionUk` to the `MfoSatelliteKey` table without a default value. This is not possible if the table is not empty.
  - Added the required column `metaDescRu` to the `MfoSatelliteKey` table without a default value. This is not possible if the table is not empty.
  - Added the required column `metaDescUk` to the `MfoSatelliteKey` table without a default value. This is not possible if the table is not empty.
  - Added the required column `metaTitleRu` to the `MfoSatelliteKey` table without a default value. This is not possible if the table is not empty.
  - Added the required column `metaTitleUk` to the `MfoSatelliteKey` table without a default value. This is not possible if the table is not empty.
  - Added the required column `titleRu` to the `MfoSatelliteKey` table without a default value. This is not possible if the table is not empty.
  - Added the required column `titleUk` to the `MfoSatelliteKey` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MfoSatelliteKey" ADD COLUMN     "descriptionRu" TEXT NOT NULL,
ADD COLUMN     "descriptionUk" TEXT NOT NULL,
ADD COLUMN     "metaDescRu" TEXT NOT NULL,
ADD COLUMN     "metaDescUk" TEXT NOT NULL,
ADD COLUMN     "metaTitleRu" TEXT NOT NULL,
ADD COLUMN     "metaTitleUk" TEXT NOT NULL,
ADD COLUMN     "titleRu" TEXT NOT NULL,
ADD COLUMN     "titleUk" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "MfoSatelliteKeyMfo" (
    "id" SERIAL NOT NULL,
    "keyId" INTEGER NOT NULL,
    "mfoId" INTEGER NOT NULL,

    CONSTRAINT "MfoSatelliteKeyMfo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MfoSatelliteKeyMfo_keyId_mfoId_key" ON "MfoSatelliteKeyMfo"("keyId", "mfoId");

-- AddForeignKey
ALTER TABLE "MfoSatelliteKeyMfo" ADD CONSTRAINT "MfoSatelliteKeyMfo_keyId_fkey" FOREIGN KEY ("keyId") REFERENCES "MfoSatelliteKey"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MfoSatelliteKeyMfo" ADD CONSTRAINT "MfoSatelliteKeyMfo_mfoId_fkey" FOREIGN KEY ("mfoId") REFERENCES "Mfo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
