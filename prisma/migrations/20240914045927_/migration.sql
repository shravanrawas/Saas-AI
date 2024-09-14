/*
  Warnings:

  - You are about to drop the `userSubscription` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "userSubscription";

-- CreateTable
CREATE TABLE "UserSubscription" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "subscriptionActive" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "UserSubscription_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserSubscription_userId_key" ON "UserSubscription"("userId");
