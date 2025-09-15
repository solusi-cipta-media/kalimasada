import "server-only";

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { responseError, throwIfMissing } from "@/@core/utils/serverHelpers";
import PayrollGenerationRepository from "@/repositories/PayrollGenerationRepository";

const repository = new PayrollGenerationRepository();

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const year = searchParams.get("year");
    const month = searchParams.get("month");

    if (year && month) {
      // Get specific generation
      const generation = await repository.getByPeriod(Number(year), Number(month));

      return NextResponse.json({
        message: "Payroll generation retrieved successfully",
        data: generation
      });
    } else {
      // Get all generations
      const generations = await repository.getAll();

      return NextResponse.json({
        message: "Payroll generations retrieved successfully",
        data: generations
      });
    }
  } catch (error: any) {
    return responseError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = req.headers.get("userId");

    throwIfMissing(userId, "User id is required.");

    const body = await req.json();
    const { month, year } = body;

    throwIfMissing(month, "Month is required.");
    throwIfMissing(year, "Year is required.");

    // Import PayrollRepository here to avoid circular imports
    const PayrollRepository = (await import("@/repositories/PayrollRepository")).default;
    const payrollRepository = new PayrollRepository();

    const result = await payrollRepository.generatePayroll(Number(year), Number(month), Number(userId));

    return NextResponse.json({
      message: "Payroll generation completed successfully",
      data: result
    });
  } catch (error: any) {
    return responseError(error);
  }
}
