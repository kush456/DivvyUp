/*
  Warnings:

  - You are about to drop the column `payerId` on the `Expense` table. All the data in the column will be lost.
  - Added the required column `paidAmount` to the `Participant` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Expense" DROP CONSTRAINT "Expense_payerId_fkey";

-- AlterTable
ALTER TABLE "Expense" DROP COLUMN "payerId";

-- AlterTable
ALTER TABLE "Participant" ADD COLUMN     "paidAmount" DOUBLE PRECISION NOT NULL;
