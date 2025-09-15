-- CreateTable
CREATE TABLE "PayrollGeneration" (
    "id" SERIAL NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "generatedBy" INTEGER NOT NULL,
    "employeeCount" INTEGER NOT NULL,
    "totalAmount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'COMPLETED',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PayrollGeneration_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PayrollGeneration_month_year_key" ON "PayrollGeneration"("month", "year");

-- AddForeignKey
ALTER TABLE "PayrollGeneration" ADD CONSTRAINT "PayrollGeneration_generatedBy_fkey" FOREIGN KEY ("generatedBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Add generation reference to existing Payroll table
ALTER TABLE "Payroll" ADD COLUMN "generationId" INTEGER;

-- AddForeignKey
ALTER TABLE "Payroll" ADD CONSTRAINT "Payroll_generationId_fkey" FOREIGN KEY ("generationId") REFERENCES "PayrollGeneration"("id") ON DELETE SET NULL ON UPDATE CASCADE;
