-- DropForeignKey
ALTER TABLE "EventChoice" DROP CONSTRAINT "EventChoice_playerChoiceId_fkey";

-- CreateTable
CREATE TABLE "PlayerChoice" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlayerChoice_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PlayerChoice_name_key" ON "PlayerChoice"("name");

-- AddForeignKey
ALTER TABLE "EventChoice" ADD CONSTRAINT "EventChoice_playerChoiceId_fkey" FOREIGN KEY ("playerChoiceId") REFERENCES "PlayerChoice"("id") ON DELETE SET NULL ON UPDATE CASCADE;
