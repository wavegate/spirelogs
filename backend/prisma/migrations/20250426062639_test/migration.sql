/*
  Warnings:

  - The primary key for the `Card` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `description` on the `Card` table. All the data in the column will be lost.
  - You are about to drop the column `imageLink` on the `Card` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Card" DROP CONSTRAINT "Card_pkey",
DROP COLUMN "description",
DROP COLUMN "imageLink",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Card_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Card_id_seq";

-- CreateTable
CREATE TABLE "Potion" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Potion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Enemy" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Enemy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CardChoice" (
    "id" TEXT NOT NULL,
    "floor" INTEGER NOT NULL,
    "pickedId" TEXT NOT NULL,
    "runId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CardChoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DamageTaken" (
    "id" TEXT NOT NULL,
    "damage" INTEGER NOT NULL,
    "floor" INTEGER NOT NULL,
    "turns" INTEGER NOT NULL,
    "enemyId" TEXT NOT NULL,
    "runId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DamageTaken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CampfireChoice" (
    "id" TEXT NOT NULL,
    "floor" INTEGER NOT NULL,
    "key" TEXT NOT NULL,
    "runId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "cardId" TEXT,

    CONSTRAINT "CampfireChoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PotionObtained" (
    "id" TEXT NOT NULL,
    "floor" INTEGER NOT NULL,
    "potionId" TEXT NOT NULL,
    "runId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PotionObtained_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Relic" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "bossRelicChoiceId" TEXT,

    CONSTRAINT "Relic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RelicObtained" (
    "id" TEXT NOT NULL,
    "floor" INTEGER NOT NULL,
    "relicId" TEXT NOT NULL,
    "runId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RelicObtained_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BossRelicChoice" (
    "id" TEXT NOT NULL,
    "pickedId" TEXT NOT NULL,
    "runId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BossRelicChoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventChoice" (
    "id" TEXT NOT NULL,
    "damageHealed" INTEGER,
    "goldGain" INTEGER,
    "playerChoiceId" TEXT,
    "damageTaken" INTEGER,
    "maxHpGain" INTEGER,
    "maxHpLoss" INTEGER,
    "eventId" TEXT NOT NULL,
    "floor" INTEGER,
    "goldLoss" INTEGER,
    "runId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EventChoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Run" (
    "id" TEXT NOT NULL,
    "playId" TEXT,
    "characterChosen" TEXT,
    "floorReached" INTEGER,
    "playtime" INTEGER,
    "score" INTEGER,
    "isVictory" BOOLEAN,
    "isAscensionMode" BOOLEAN,
    "isDaily" BOOLEAN,
    "isTrial" BOOLEAN,
    "isEndless" BOOLEAN,
    "isBeta" BOOLEAN,
    "ascensionLevel" INTEGER,
    "gold" INTEGER,
    "timestamp" TIMESTAMP(3),
    "localTime" TEXT,
    "seedPlayed" TEXT,
    "seedSourceTimestamp" BIGINT,
    "buildVersion" TEXT,
    "winRate" DOUBLE PRECISION,
    "playerExperience" INTEGER,
    "neowBonus" TEXT,
    "neowCost" TEXT,
    "circletCount" INTEGER,
    "purchasedPurges" INTEGER,
    "campfireRested" INTEGER,
    "campfireUpgraded" INTEGER,
    "pathTaken" TEXT[],
    "pathPerFloor" TEXT[],
    "currentHpPerFloor" INTEGER[],
    "maxHpPerFloor" INTEGER[],
    "goldPerFloor" INTEGER[],
    "potionsFloorSpawned" INTEGER[],
    "potionsFloorUsage" INTEGER[],
    "itemPurchaseFloors" INTEGER[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Run_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_NotPickedCards" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_NotPickedCards_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_EventRemovedCards" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_EventRemovedCards_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_ItemsPurged" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ItemsPurged_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_MasterDeck" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_MasterDeck_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_PurchasedInRuns" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_PurchasedInRuns_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_RelicToRun" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_RelicToRun_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_NotPickedBossRelics" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_NotPickedBossRelics_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Run_playId_key" ON "Run"("playId");

-- CreateIndex
CREATE INDEX "_NotPickedCards_B_index" ON "_NotPickedCards"("B");

-- CreateIndex
CREATE INDEX "_EventRemovedCards_B_index" ON "_EventRemovedCards"("B");

-- CreateIndex
CREATE INDEX "_ItemsPurged_B_index" ON "_ItemsPurged"("B");

-- CreateIndex
CREATE INDEX "_MasterDeck_B_index" ON "_MasterDeck"("B");

-- CreateIndex
CREATE INDEX "_PurchasedInRuns_B_index" ON "_PurchasedInRuns"("B");

-- CreateIndex
CREATE INDEX "_RelicToRun_B_index" ON "_RelicToRun"("B");

-- CreateIndex
CREATE INDEX "_NotPickedBossRelics_B_index" ON "_NotPickedBossRelics"("B");

-- AddForeignKey
ALTER TABLE "CardChoice" ADD CONSTRAINT "CardChoice_pickedId_fkey" FOREIGN KEY ("pickedId") REFERENCES "Card"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CardChoice" ADD CONSTRAINT "CardChoice_runId_fkey" FOREIGN KEY ("runId") REFERENCES "Run"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DamageTaken" ADD CONSTRAINT "DamageTaken_enemyId_fkey" FOREIGN KEY ("enemyId") REFERENCES "Enemy"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DamageTaken" ADD CONSTRAINT "DamageTaken_runId_fkey" FOREIGN KEY ("runId") REFERENCES "Run"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampfireChoice" ADD CONSTRAINT "CampfireChoice_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "Card"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampfireChoice" ADD CONSTRAINT "CampfireChoice_runId_fkey" FOREIGN KEY ("runId") REFERENCES "Run"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PotionObtained" ADD CONSTRAINT "PotionObtained_potionId_fkey" FOREIGN KEY ("potionId") REFERENCES "Potion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PotionObtained" ADD CONSTRAINT "PotionObtained_runId_fkey" FOREIGN KEY ("runId") REFERENCES "Run"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RelicObtained" ADD CONSTRAINT "RelicObtained_relicId_fkey" FOREIGN KEY ("relicId") REFERENCES "Relic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RelicObtained" ADD CONSTRAINT "RelicObtained_runId_fkey" FOREIGN KEY ("runId") REFERENCES "Run"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BossRelicChoice" ADD CONSTRAINT "BossRelicChoice_pickedId_fkey" FOREIGN KEY ("pickedId") REFERENCES "Relic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BossRelicChoice" ADD CONSTRAINT "BossRelicChoice_runId_fkey" FOREIGN KEY ("runId") REFERENCES "Run"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventChoice" ADD CONSTRAINT "EventChoice_playerChoiceId_fkey" FOREIGN KEY ("playerChoiceId") REFERENCES "Card"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventChoice" ADD CONSTRAINT "EventChoice_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventChoice" ADD CONSTRAINT "EventChoice_runId_fkey" FOREIGN KEY ("runId") REFERENCES "Run"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_NotPickedCards" ADD CONSTRAINT "_NotPickedCards_A_fkey" FOREIGN KEY ("A") REFERENCES "Card"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_NotPickedCards" ADD CONSTRAINT "_NotPickedCards_B_fkey" FOREIGN KEY ("B") REFERENCES "CardChoice"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EventRemovedCards" ADD CONSTRAINT "_EventRemovedCards_A_fkey" FOREIGN KEY ("A") REFERENCES "Card"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EventRemovedCards" ADD CONSTRAINT "_EventRemovedCards_B_fkey" FOREIGN KEY ("B") REFERENCES "EventChoice"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ItemsPurged" ADD CONSTRAINT "_ItemsPurged_A_fkey" FOREIGN KEY ("A") REFERENCES "Card"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ItemsPurged" ADD CONSTRAINT "_ItemsPurged_B_fkey" FOREIGN KEY ("B") REFERENCES "Run"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MasterDeck" ADD CONSTRAINT "_MasterDeck_A_fkey" FOREIGN KEY ("A") REFERENCES "Card"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MasterDeck" ADD CONSTRAINT "_MasterDeck_B_fkey" FOREIGN KEY ("B") REFERENCES "Run"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PurchasedInRuns" ADD CONSTRAINT "_PurchasedInRuns_A_fkey" FOREIGN KEY ("A") REFERENCES "Card"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PurchasedInRuns" ADD CONSTRAINT "_PurchasedInRuns_B_fkey" FOREIGN KEY ("B") REFERENCES "Run"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RelicToRun" ADD CONSTRAINT "_RelicToRun_A_fkey" FOREIGN KEY ("A") REFERENCES "Relic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RelicToRun" ADD CONSTRAINT "_RelicToRun_B_fkey" FOREIGN KEY ("B") REFERENCES "Run"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_NotPickedBossRelics" ADD CONSTRAINT "_NotPickedBossRelics_A_fkey" FOREIGN KEY ("A") REFERENCES "BossRelicChoice"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_NotPickedBossRelics" ADD CONSTRAINT "_NotPickedBossRelics_B_fkey" FOREIGN KEY ("B") REFERENCES "Relic"("id") ON DELETE CASCADE ON UPDATE CASCADE;
