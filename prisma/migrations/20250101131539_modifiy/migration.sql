/*
  Warnings:

  - A unique constraint covering the columns `[groupId,userId]` on the table `GroupBalance` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "GroupBalance_groupId_userId_key" ON "GroupBalance"("groupId", "userId");
