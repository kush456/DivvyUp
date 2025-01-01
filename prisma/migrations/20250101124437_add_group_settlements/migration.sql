-- CreateTable
CREATE TABLE "GroupSettlement" (
    "id" SERIAL NOT NULL,
    "groupId" INTEGER NOT NULL,
    "payerId" INTEGER NOT NULL,
    "payeeId" INTEGER NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GroupSettlement_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "GroupSettlement" ADD CONSTRAINT "GroupSettlement_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupSettlement" ADD CONSTRAINT "GroupSettlement_payerId_fkey" FOREIGN KEY ("payerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupSettlement" ADD CONSTRAINT "GroupSettlement_payeeId_fkey" FOREIGN KEY ("payeeId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
