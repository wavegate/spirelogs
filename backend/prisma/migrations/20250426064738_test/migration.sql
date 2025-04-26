-- DropForeignKey
ALTER TABLE "BossRelicChoice" DROP CONSTRAINT "BossRelicChoice_runId_fkey";

-- DropForeignKey
ALTER TABLE "CampfireChoice" DROP CONSTRAINT "CampfireChoice_runId_fkey";

-- DropForeignKey
ALTER TABLE "CardChoice" DROP CONSTRAINT "CardChoice_runId_fkey";

-- DropForeignKey
ALTER TABLE "DamageTaken" DROP CONSTRAINT "DamageTaken_runId_fkey";

-- DropForeignKey
ALTER TABLE "EventChoice" DROP CONSTRAINT "EventChoice_runId_fkey";

-- DropForeignKey
ALTER TABLE "PotionObtained" DROP CONSTRAINT "PotionObtained_runId_fkey";

-- DropForeignKey
ALTER TABLE "RelicObtained" DROP CONSTRAINT "RelicObtained_runId_fkey";

-- AddForeignKey
ALTER TABLE "CardChoice" ADD CONSTRAINT "CardChoice_runId_fkey" FOREIGN KEY ("runId") REFERENCES "Run"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DamageTaken" ADD CONSTRAINT "DamageTaken_runId_fkey" FOREIGN KEY ("runId") REFERENCES "Run"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampfireChoice" ADD CONSTRAINT "CampfireChoice_runId_fkey" FOREIGN KEY ("runId") REFERENCES "Run"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PotionObtained" ADD CONSTRAINT "PotionObtained_runId_fkey" FOREIGN KEY ("runId") REFERENCES "Run"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RelicObtained" ADD CONSTRAINT "RelicObtained_runId_fkey" FOREIGN KEY ("runId") REFERENCES "Run"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BossRelicChoice" ADD CONSTRAINT "BossRelicChoice_runId_fkey" FOREIGN KEY ("runId") REFERENCES "Run"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventChoice" ADD CONSTRAINT "EventChoice_runId_fkey" FOREIGN KEY ("runId") REFERENCES "Run"("id") ON DELETE CASCADE ON UPDATE CASCADE;
