-- AlterTable
ALTER TABLE "Author" ADD COLUMN     "metaDescriptionRu" TEXT,
ADD COLUMN     "metaDescriptionUk" TEXT,
ADD COLUMN     "metaKeywordsRu" TEXT,
ADD COLUMN     "metaKeywordsUk" TEXT,
ADD COLUMN     "metaTitleRu" TEXT,
ADD COLUMN     "metaTitleUk" TEXT;

-- AlterTable
ALTER TABLE "Mfo" ALTER COLUMN "reviews" DROP NOT NULL;

-- AlterTable
ALTER TABLE "News" ADD COLUMN     "metaDescriptionRu" TEXT,
ADD COLUMN     "metaDescriptionUk" TEXT,
ADD COLUMN     "metaKeywordsRu" TEXT,
ADD COLUMN     "metaKeywordsUk" TEXT,
ADD COLUMN     "metaTitleRu" TEXT,
ADD COLUMN     "metaTitleUk" TEXT,
ADD COLUMN     "ogImageRu" TEXT,
ADD COLUMN     "ogImageUk" TEXT;

-- AlterTable
ALTER TABLE "NewsCategory" ADD COLUMN     "metaDescriptionRu" TEXT,
ADD COLUMN     "metaDescriptionUk" TEXT,
ADD COLUMN     "metaKeywordsRu" TEXT,
ADD COLUMN     "metaKeywordsUk" TEXT,
ADD COLUMN     "metaTitleRu" TEXT,
ADD COLUMN     "metaTitleUk" TEXT;
