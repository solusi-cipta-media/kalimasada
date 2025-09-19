/*
  Warnings:

  - You are about to drop the column `commission` on the `Employee` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Appointment" ADD COLUMN     "commissionAmount" DECIMAL(10,2) NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "public"."Employee" DROP COLUMN "commission";
