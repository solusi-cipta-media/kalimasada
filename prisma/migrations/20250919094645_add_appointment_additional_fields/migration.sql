-- AlterTable
ALTER TABLE "public"."Appointment" ADD COLUMN     "tipeLayanan" TEXT DEFAULT 'DI_TEMPAT',
ADD COLUMN     "uangBensin" DECIMAL(10,2) DEFAULT 0,
ADD COLUMN     "upahLembur" DECIMAL(10,2) DEFAULT 0;
