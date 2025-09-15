import "server-only";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { responseError } from "@/@core/utils/serverHelpers";
import database from "@/@libs/database";

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    // Update all payrolls in the generation to PAID
    const result = await database.payroll.updateMany({
      where: {
        generationId: parseInt(id),
        status: "PENDING"
      },
      data: {
        status: "PAID",
        paidAt: new Date()
      }
    });

    // Get the updated generation data
    const generation = await database.payrollGeneration.findUnique({
      where: {
        id: parseInt(id)
      },
      include: {
        payrolls: {
          include: {
            employee: {
              select: {
                name: true
              }
            }
          }
        }
      }
    });

    return NextResponse.json({
      message: `Berhasil membayar ${result.count} gaji karyawan`,
      data: generation
    });
  } catch (error: any) {
    console.error("Error paying all payrolls:", error);

    return responseError(error);
  }
}
