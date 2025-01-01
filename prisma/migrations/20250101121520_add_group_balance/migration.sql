-- CreateTable
CREATE TABLE "GroupBalance" (
    "id" SERIAL NOT NULL,
    "groupId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "balance" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "GroupBalance_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "GroupBalance" ADD CONSTRAINT "GroupBalance_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupBalance" ADD CONSTRAINT "GroupBalance_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
