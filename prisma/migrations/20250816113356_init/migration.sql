-- AlterTable
ALTER TABLE "Question" ALTER COLUMN "email" DROP NOT NULL,
ALTER COLUMN "name" DROP NOT NULL;

-- AlterTable
ALTER TABLE "QuestionAnswer" ADD COLUMN     "authorEmail" TEXT,
ADD COLUMN     "authorName" TEXT,
ADD COLUMN     "expertId" INTEGER;

-- CreateTable
CREATE TABLE "Expert" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "nameUk" TEXT,
    "slug" TEXT NOT NULL,
    "avatar" TEXT,
    "bio" TEXT,
    "bioUk" TEXT,
    "position" TEXT NOT NULL,
    "positionUk" TEXT,
    "experience" TEXT NOT NULL,
    "experienceUk" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "color" TEXT,
    "totalAnswers" INTEGER NOT NULL DEFAULT 0,
    "expertise" TEXT[],
    "expertiseUk" TEXT[],
    "achievements" TEXT[],
    "achievementsUk" TEXT[],
    "telegram" TEXT,
    "linkedin" TEXT,
    "twitter" TEXT,
    "email" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Expert_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReviewAnswer" (
    "id" SERIAL NOT NULL,
    "reviewId" INTEGER NOT NULL,
    "textOriginal" TEXT NOT NULL,
    "textUk" TEXT,
    "textRu" TEXT,
    "isModerated" BOOLEAN NOT NULL DEFAULT false,
    "authorName" TEXT,
    "authorEmail" TEXT,
    "expertId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReviewAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Expert_slug_key" ON "Expert"("slug");

-- AddForeignKey
ALTER TABLE "QuestionAnswer" ADD CONSTRAINT "QuestionAnswer_expertId_fkey" FOREIGN KEY ("expertId") REFERENCES "Expert"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReviewAnswer" ADD CONSTRAINT "ReviewAnswer_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "Review"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReviewAnswer" ADD CONSTRAINT "ReviewAnswer_expertId_fkey" FOREIGN KEY ("expertId") REFERENCES "Expert"("id") ON DELETE SET NULL ON UPDATE CASCADE;
