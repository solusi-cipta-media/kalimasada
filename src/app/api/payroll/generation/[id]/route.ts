import "server-only";

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { responseError, throwIfMissing } from "@/@core/utils/serverHelpers";
import PayrollGenerationRepository from "@/repositories/PayrollGenerationRepository";

const repository = new PayrollGenerationRepository();

export async function GET(req: NextRequest, context: { params: { id: string } }) {
  try {
    const { id } = context.params;

    throwIfMissing(id, "Generation ID is required.");

    const generation = await repository.getById(Number(id));

    if (!generation) {
      return NextResponse.json({ message: "Payroll generation not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Payroll generation details retrieved successfully",
      data: generation
    });
  } catch (error: any) {
    return responseError(error);
  }
}

export async function DELETE(req: NextRequest, context: { params: { id: string } }) {
  try {
    const { id } = context.params;

    throwIfMissing(id, "Generation ID is required.");

    await repository.delete(Number(id));

    return NextResponse.json({
      message: "Payroll generation deleted successfully"
    });
  } catch (error: any) {
    return responseError(error);
  }
}
