import "server-only";
import database from "@/@libs/database";

export default class EmployeeRepository {
  async getAll() {
    return await database.employee.findMany({
      orderBy: { name: "asc" }
    });
  }

  async getById(id: number) {
    return await database.employee.findUnique({
      where: { id },
      include: {
        appointments: {
          include: {
            customer: true,
            services: {
              include: {
                service: true
              }
            }
          }
        },
        payrolls: {
          orderBy: { createdAt: "desc" },
          take: 12 // Last 12 months
        }
      }
    });
  }

  async getActive() {
    return await database.employee.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" }
    });
  }

  async getByPosition(position: string) {
    return await database.employee.findMany({
      where: {
        position: position,
        isActive: true
      },
      orderBy: { name: "asc" }
    });
  }

  async create(data: {
    name: string;
    email: string;
    phone?: string;
    position: string;
    salary: number;
    commission?: number;
    avatar?: string;
    hireDate?: Date;
  }) {
    return await database.employee.create({
      data: {
        ...data,
        salary: data.salary,
        commission: data.commission || 0,
        hireDate: data.hireDate || new Date()
      }
    });
  }

  async update(
    id: number,
    data: {
      name?: string;
      email?: string;
      phone?: string;
      position?: string;
      salary?: number;
      commission?: number;
      avatar?: string;
      isActive?: boolean;
    }
  ) {
    return await database.employee.update({
      where: { id },
      data: {
        ...data,
        ...(data.salary && { salary: data.salary }),
        ...(data.commission !== undefined && { commission: data.commission })
      }
    });
  }

  async delete(id: number) {
    return await database.employee.delete({
      where: { id }
    });
  }

  async toggleActive(id: number) {
    const employee = await database.employee.findUnique({
      where: { id },
      select: { isActive: true }
    });

    if (!employee) throw new Error("Employee not found");

    return await database.employee.update({
      where: { id },
      data: { isActive: !employee.isActive }
    });
  }

  async getEmployeeStats(employeeId: number, year: number, month?: number) {
    const whereClause: any = {
      employeeId,
      date: {
        gte: new Date(year, month ? month - 1 : 0, 1),
        lt: new Date(year, month ? month : 12, 1)
      },
      status: "COMPLETED"
    };

    const appointments = await database.appointment.findMany({
      where: whereClause,
      include: {
        services: {
          include: {
            service: true
          }
        }
      }
    });

    const totalRevenue = appointments.reduce((sum, apt) => sum + Number(apt.totalPrice), 0);

    const totalAppointments = appointments.length;

    return {
      totalAppointments,
      totalRevenue,
      appointments
    };
  }
}
