/*
  Warnings:

  - You are about to drop the column `amount` on the `Expense` table. All the data in the column will be lost.
  - Added the required column `splitType` to the `Expense` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalaAount` to the `Expense` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Expense" DROP COLUMN "amount",
ADD COLUMN     "splitType" TEXT NOT NULL,
ADD COLUMN     "totalaAount" DOUBLE PRECISION NOT NULL;
