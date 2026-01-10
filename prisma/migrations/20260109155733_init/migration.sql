-- AlterTable
ALTER TABLE "Mfo" ADD COLUMN     "nbuCharacteristicsLink" TEXT,
ADD COLUMN     "nbuWarningLink" TEXT,
ALTER COLUMN "citizenship" SET DEFAULT 'Укр',
ALTER COLUMN "documents" SET DEFAULT 'Паспорт Укр';
