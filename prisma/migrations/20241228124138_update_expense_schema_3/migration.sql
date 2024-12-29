/*
  Warnings:

  - You are about to drop the column `totalaAount` on the `Expense` table. All the data in the column will be lost.
  - Added the required column `totalAmount` to the `Expense` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Expense" DROP COLUMN "totalaAount",
ADD COLUMN     "totalAmount" DOUBLE PRECISION NOT NULL;
