import "server-only";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { responseError } from "@/@core/utils/serverHelpers";
import database from "@/@libs/database";

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    // Update the payroll status to PAID
    const updatedPayroll = await database.payroll.update({
      where: {
        id: parseInt(id)
      },
      data: {
        status: "PAID",
        paidAt: new Date()
      },
      include: {
        employee: {
          select: {
            name: true
          }
        }
      }
    });

    return NextResponse.json({
      message: `Gaji karyawan ${updatedPayroll.employee.name} berhasil dibayar`,
      data: updatedPayroll
    });
  } catch (error: any) {
    console.error("Error paying individual payroll:", error);

    return responseError(error);
  }
}
