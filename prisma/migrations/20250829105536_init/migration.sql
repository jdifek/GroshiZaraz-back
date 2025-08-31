-- AlterTable
ALTER TABLE "Mfo" ADD COLUMN     "application" TEXT,
ADD COLUMN     "collateral" TEXT,
ADD COLUMN     "commission" DOUBLE PRECISION,
ADD COLUMN     "dailyRate" DOUBLE PRECISION,
ADD COLUMN     "decisionType" TEXT;

-- CreateTable
CREATE TABLE "PromoCode" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "discount" TEXT NOT NULL,
    "condition" TEXT,
    "validTill" TIMESTAMP(3),
    "mfoId" INTEGER NOT NULL,

    CONSTRAINT "PromoCode_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PromoCode" ADD CONSTRAINT "PromoCode_mfoId_fkey" FOREIGN KEY ("mfoId") REFERENCES "Mfo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
