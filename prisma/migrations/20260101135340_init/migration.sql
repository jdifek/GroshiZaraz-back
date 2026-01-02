-- AlterTable
ALTER TABLE "Mfo" ADD COLUMN     "descriptionUk" TEXT,
ADD COLUMN     "loansIssued" INTEGER,
ADD COLUMN     "satisfiedClients" INTEGER;

-- CreateTable
CREATE TABLE "MfoFaq" (
    "id" SERIAL NOT NULL,
    "mfoId" INTEGER NOT NULL,
    "questionRu" TEXT NOT NULL,
    "questionUk" TEXT NOT NULL,
    "answerRu" TEXT NOT NULL,
    "answerUk" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MfoFaq_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MfoFaq" ADD CONSTRAINT "MfoFaq_mfoId_fkey" FOREIGN KEY ("mfoId") REFERENCES "Mfo"("id") ON DELETE CASCADE ON UPDATE CASCADE;
