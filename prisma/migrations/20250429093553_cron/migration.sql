/*
  Warnings:

  - Added the required column `companyId` to the `Hour` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Hour" ADD COLUMN     "companyId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Hour" ADD CONSTRAINT "Hour_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
