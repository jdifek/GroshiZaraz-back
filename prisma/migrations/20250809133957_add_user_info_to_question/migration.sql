-- CreateTable
CREATE TABLE "MfoSatelliteKey" (
    "id" SERIAL NOT NULL,
    "keyUk" TEXT NOT NULL,
    "keyRu" TEXT NOT NULL,
    "slugUk" TEXT NOT NULL,
    "slugRu" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MfoSatelliteKey_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MfoSatellite" (
    "id" SERIAL NOT NULL,
    "keyId" INTEGER NOT NULL,
    "metaTitleUk" TEXT NOT NULL,
    "metaTitleRu" TEXT NOT NULL,
    "metaDescUk" TEXT NOT NULL,
    "metaDescRu" TEXT NOT NULL,
    "titleUk" TEXT NOT NULL,
    "titleRu" TEXT NOT NULL,
    "descriptionUk" TEXT NOT NULL,
    "descriptionRu" TEXT NOT NULL,
    "slugUk" TEXT NOT NULL,
    "slugRu" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MfoSatellite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MfoSatelliteMfo" (
    "id" SERIAL NOT NULL,
    "satelliteId" INTEGER NOT NULL,
    "mfoId" INTEGER NOT NULL,

    CONSTRAINT "MfoSatelliteMfo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MfoSatelliteKey_slugUk_key" ON "MfoSatelliteKey"("slugUk");

-- CreateIndex
CREATE UNIQUE INDEX "MfoSatelliteKey_slugRu_key" ON "MfoSatelliteKey"("slugRu");

-- CreateIndex
CREATE UNIQUE INDEX "MfoSatellite_slugUk_key" ON "MfoSatellite"("slugUk");

-- CreateIndex
CREATE UNIQUE INDEX "MfoSatellite_slugRu_key" ON "MfoSatellite"("slugRu");

-- CreateIndex
CREATE UNIQUE INDEX "MfoSatelliteMfo_satelliteId_mfoId_key" ON "MfoSatelliteMfo"("satelliteId", "mfoId");

-- AddForeignKey
ALTER TABLE "MfoSatellite" ADD CONSTRAINT "MfoSatellite_keyId_fkey" FOREIGN KEY ("keyId") REFERENCES "MfoSatelliteKey"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MfoSatelliteMfo" ADD CONSTRAINT "MfoSatelliteMfo_satelliteId_fkey" FOREIGN KEY ("satelliteId") REFERENCES "MfoSatellite"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MfoSatelliteMfo" ADD CONSTRAINT "MfoSatelliteMfo_mfoId_fkey" FOREIGN KEY ("mfoId") REFERENCES "Mfo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
