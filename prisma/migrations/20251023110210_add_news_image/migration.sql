-- AlterTable
ALTER TABLE "MfoSatellite" ADD COLUMN     "seoContentRu" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "seoContentUk" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "MfoSatelliteKey" ADD COLUMN     "seoContentRu" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "seoContentUk" TEXT NOT NULL DEFAULT '';
