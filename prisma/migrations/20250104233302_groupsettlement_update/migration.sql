/*
  Warnings:

  - A unique constraint covering the columns `[payerId,payeeId,groupId]` on the table `GroupSettlement` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "GroupSettlement_payerId_payeeId_groupId_key" ON "GroupSettlement"("payerId", "payeeId", "groupId");
