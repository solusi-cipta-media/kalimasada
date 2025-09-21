import "server-only";
import database from "@/@libs/database";
import { ResponseError } from "@/types/errors";

export default class PayrollRepository {
  async getAll() {
    return await database.payroll.findMany({
      include: {
        employee: true
      },
      orderBy: [{ year: "desc" }, { month: "desc" }]
    });
  }

  async getById(id: number) {
    return await database.payroll.findUnique({
      where: { id },
      include: {
        employee: true
      }
    });
  }

  async getByEmployee(employeeId: number, year?: number) {
    const whereClause: any = { employeeId };

    if (year) {
      whereClause.year = year;
    }

    return await database.payroll.findMany({
      where: whereClause,
      include: {
        employee: true
      },
      orderBy: [{ year: "desc" }, { month: "desc" }]
    });
  }

  async getByPeriod(year: number, month: number) {
    return await database.payroll.findMany({
      where: {
        year,
        month
      },
      include: {
        employee: true
      },
      orderBy: { employee: { name: "asc" } }
    });
  }

  async getEmployeePayroll(employeeId: number, year: number, month: number) {
    return await database.payroll.findUnique({
      where: {
        employeeId_month_year: {
          employeeId,
          month,
          year
        }
      },
      include: {
        employee: true
      }
    });
  }

  async deleteExistingPayroll(year: number, month: number) {
    try {
      console.log("Deleting existing payroll for:", { year, month });

      const deletedCount = await database.payroll.deleteMany({
        where: {
          year,
          month
        }
      });

      console.log("Deleted payroll records:", deletedCount);

      return deletedCount;
    } catch (error) {
      console.error("Error deleting existing payroll:", error);
      throw new ResponseError("Gagal menghapus payroll yang ada: " + (error as Error).message, 500);
    }
  }

  async generatePayroll(year: number, month: number, generatedBy: number, employeeIds?: number[]) {
    console.log("Starting payroll generation:", { year, month, generatedBy, employeeIds });

    // Build employee filter - either specified IDs or all active employees
    const employeeFilter: any = { isActive: true };

    if (employeeIds && employeeIds.length > 0) {
      employeeFilter.id = { in: employeeIds };
    }

    const employees = await database.employee.findMany({
      where: employeeFilter
    });

    console.log("Found employees:", employees.length);

    // Check if generation already exists for this period
    const existingGeneration = await database.payrollGeneration.findUnique({
      where: {
        month_year: {
          month,
          year
        }
      }
    });

    if (existingGeneration) {
      console.log("Generation already exists:", existingGeneration);
      throw new ResponseError(`Payroll generation for ${month}/${year} already exists`, 400);
    }

    const results = [];
    let totalAmount = 0;

    // Create the generation record first
    const generation = await database.payrollGeneration.create({
      data: {
        month,
        year,
        generatedBy,
        employeeCount: 0, // Will update later
        totalAmount: 0, // Will update later
        status: "IN_PROGRESS"
      }
    });

    for (const employee of employees) {
      console.log("Processing employee:", employee.name, employee.id);

      // Check if payroll already exists for this employee
      const existingPayroll = await database.payroll.findUnique({
        where: {
          employeeId_month_year: {
            employeeId: employee.id,
            month,
            year
          }
        }
      });

      if (existingPayroll) {
        console.log("Payroll already exists for", employee.name, "- skipping");
        continue;
      }

      // Calculate commission from completed appointments
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);

      console.log("Date range:", { startDate, endDate });

      const appointments = await database.appointment.findMany({
        where: {
          employeeId: employee.id,
          date: {
            gte: startDate,
            lte: endDate
          },
          status: "COMPLETED"
        }
      });

      console.log("Found appointments for", employee.name, ":", appointments.length);

      // Sum up commission amounts from all completed appointments
      const commissionAmount = appointments.reduce((sum, apt) => {
        const commission = apt.commissionAmount ? Number(apt.commissionAmount) : 0;

        return sum + commission;
      }, 0);

      const totalSalary = Number(employee.salary) + commissionAmount;

      console.log("Salary calculation for", employee.name, ":", {
        baseSalary: Number(employee.salary),
        commissionAmount,
        totalSalary
      });

      try {
        const payroll = await database.payroll.create({
          data: {
            employeeId: employee.id,
            month,
            year,
            baseSalary: employee.salary,
            commission: commissionAmount,
            bonus: 0,
            deduction: 0,
            totalSalary,
            generationId: generation.id
          },
          include: {
            employee: true
          }
        });

        totalAmount += totalSalary;
        results.push({ employee, payroll, status: "created" });
        console.log("Successfully created payroll for", employee.name);
      } catch (error) {
        console.error("Error creating payroll for", employee.name, ":", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error";

        throw new ResponseError(`Failed to create payroll for ${employee.name}: ${errorMessage}`, 500);
      }
    } // Update the generation record with final counts

    await database.payrollGeneration.update({
      where: { id: generation.id },
      data: {
        employeeCount: results.length,
        totalAmount,
        status: "COMPLETED"
      }
    });

    return { generation, payrolls: results };
  }

  async update(
    id: number,
    data: {
      baseSalary?: number;
      commission?: number;
      bonus?: number;
      deduction?: number;
      status?: string;
      notes?: string;
      paidAt?: Date;
    }
  ) {
    const payroll = await this.getById(id);

    if (!payroll) throw new ResponseError("Payroll not found", 404);

    const updatedData: any = { ...data };

    // Recalculate total salary if financial fields change
    if (
      data.baseSalary !== undefined ||
      data.commission !== undefined ||
      data.bonus !== undefined ||
      data.deduction !== undefined
    ) {
      const baseSalary = data.baseSalary ?? Number(payroll.baseSalary);
      const commission = data.commission ?? Number(payroll.commission);
      const bonus = data.bonus ?? Number(payroll.bonus);
      const deduction = data.deduction ?? Number(payroll.deduction);

      updatedData.totalSalary = baseSalary + commission + bonus - deduction;
    }

    return await database.payroll.update({
      where: { id },
      data: {
        ...updatedData,
        ...(data.status && { status: data.status as any })
      },
      include: {
        employee: true
      }
    });
  }

  async markAsPaid(id: number) {
    return await database.payroll.update({
      where: { id },
      data: {
        status: "PAID",
        paidAt: new Date()
      },
      include: {
        employee: true
      }
    });
  }

  async delete(id: number) {
    return await database.payroll.delete({
      where: { id }
    });
  }

  async getPayrollSummary(year: number, month?: number) {
    const whereClause: any = { year };

    if (month) {
      whereClause.month = month;
    }

    const payrolls = await database.payroll.findMany({
      where: whereClause,
      include: {
        employee: true
      }
    });

    const summary = {
      totalEmployees: payrolls.length,
      totalBaseSalary: 0,
      totalCommission: 0,
      totalBonus: 0,
      totalDeduction: 0,
      totalPayroll: 0,
      paidCount: 0,
      pendingCount: 0
    };

    payrolls.forEach((payroll) => {
      summary.totalBaseSalary += Number(payroll.baseSalary);
      summary.totalCommission += Number(payroll.commission);
      summary.totalBonus += Number(payroll.bonus);
      summary.totalDeduction += Number(payroll.deduction);
      summary.totalPayroll += Number(payroll.totalSalary);

      if (payroll.status === "PAID") {
        summary.paidCount++;
      } else {
        summary.pendingCount++;
      }
    });

    return { summary, payrolls };
  }

  async getPayrollHistory(employeeId: number, limit: number = 12) {
    return await database.payroll.findMany({
      where: { employeeId },
      include: {
        employee: true
      },
      orderBy: [{ year: "desc" }, { month: "desc" }],
      take: limit
    });
  }
}
