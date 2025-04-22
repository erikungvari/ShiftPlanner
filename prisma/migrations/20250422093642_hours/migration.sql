/*
  Warnings:

  - Added the required column `date` to the `Hour` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Hour" ADD COLUMN     "date" TIMESTAMP(3) NOT NULL;
