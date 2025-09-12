import "server-only";
import database from "@/@libs/database";

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

  async generatePayroll(year: number, month: number) {
    const employees = await database.employee.findMany({
      where: { isActive: true }
    });

    const results = [];

    for (const employee of employees) {
      // Check if payroll already exists
      const existing = await this.getEmployeePayroll(employee.id, year, month);
      if (existing) {
        results.push({ employee, payroll: existing, status: "already_exists" });
        continue;
      }

      // Calculate commission from completed appointments
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);

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

      const totalRevenue = appointments.reduce((sum, apt) => sum + Number(apt.totalPrice), 0);

      const commissionAmount = (totalRevenue * Number(employee.commission || 0)) / 100;

      const totalSalary = Number(employee.salary) + commissionAmount;

      const payroll = await database.payroll.create({
        data: {
          employeeId: employee.id,
          month,
          year,
          baseSalary: employee.salary,
          commission: commissionAmount,
          bonus: 0,
          deduction: 0,
          totalSalary
        },
        include: {
          employee: true
        }
      });

      results.push({ employee, payroll, status: "created" });
    }

    return results;
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
    if (!payroll) throw new Error("Payroll not found");

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
