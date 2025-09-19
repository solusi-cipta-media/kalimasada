import "server-only";
import database from "@/@libs/database";

export default class AppointmentRepository {
  async getAll() {
    return await database.appointment.findMany({
      include: {
        customer: true,
        employee: true,
        services: {
          include: {
            service: true
          }
        }
      },
      orderBy: { date: "desc" }
    });
  }

  async getById(id: number) {
    return await database.appointment.findUnique({
      where: { id },
      include: {
        customer: true,
        employee: true,
        services: {
          include: {
            service: true
          }
        }
      }
    });
  }

  async getByDate(date: Date) {
    const startOfDay = new Date(date);

    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);

    endOfDay.setHours(23, 59, 59, 999);

    return await database.appointment.findMany({
      where: {
        date: {
          gte: startOfDay,
          lte: endOfDay
        }
      },
      include: {
        customer: true,
        employee: true,
        services: {
          include: {
            service: true
          }
        }
      },
      orderBy: { startTime: "asc" }
    });
  }

  async getByDateRange(startDate: Date, endDate: Date) {
    return await database.appointment.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate
        }
      },
      include: {
        customer: true,
        employee: true,
        services: {
          include: {
            service: true
          }
        }
      },
      orderBy: { date: "asc" }
    });
  }

  async getByEmployee(employeeId: number, date?: Date) {
    const whereClause: any = { employeeId };

    if (date) {
      const startOfDay = new Date(date);

      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(date);

      endOfDay.setHours(23, 59, 59, 999);

      whereClause.date = {
        gte: startOfDay,
        lte: endOfDay
      };
    }

    return await database.appointment.findMany({
      where: whereClause,
      include: {
        customer: true,
        employee: true,
        services: {
          include: {
            service: true
          }
        }
      },
      orderBy: { startTime: "asc" }
    });
  }

  async getByCustomer(customerId: number) {
    return await database.appointment.findMany({
      where: { customerId },
      include: {
        customer: true,
        employee: true,
        services: {
          include: {
            service: true
          }
        }
      },
      orderBy: { date: "desc" }
    });
  }

  async create(data: {
    customerId: number;
    employeeId: number;
    date: Date;
    startTime: Date;
    endTime: Date;
    serviceIds: number[];
    notes?: string;
    tipeLayanan?: string;
    upahLembur?: number;
    uangBensin?: number;
    commissionAmount?: number;
  }) {
    const { serviceIds, ...appointmentData } = data;

    // Get services to calculate total price
    const services = await database.service.findMany({
      where: {
        id: {
          in: serviceIds
        }
      }
    });

    const totalPrice = services.reduce((sum, service) => sum + Number(service.price), 0);

    return await database.appointment.create({
      data: {
        ...appointmentData,
        totalPrice,
        services: {
          create: services.map((service) => ({
            serviceId: service.id,
            price: service.price
          }))
        }
      },
      include: {
        customer: true,
        employee: true,
        services: {
          include: {
            service: true
          }
        }
      }
    });
  }

  async update(
    id: number,
    data: {
      customerId?: number;
      employeeId?: number;
      date?: Date;
      startTime?: Date;
      endTime?: Date;
      status?: string;
      notes?: string;
      serviceIds?: number[];
      tipeLayanan?: string;
      upahLembur?: number;
      uangBensin?: number;
      commissionAmount?: number;
    }
  ) {
    const { serviceIds, ...updateData } = data;

    if (serviceIds) {
      // Delete existing services
      await database.appointmentService.deleteMany({
        where: { appointmentId: id }
      });

      // Get new services
      const services = await database.service.findMany({
        where: {
          id: {
            in: serviceIds
          }
        }
      });

      const totalPrice = services.reduce((sum, service) => sum + Number(service.price), 0);

      return await database.appointment.update({
        where: { id },
        data: {
          ...updateData,
          ...(updateData.status && { status: updateData.status as any }),
          totalPrice,
          services: {
            create: services.map((service) => ({
              serviceId: service.id,
              price: service.price
            }))
          }
        },
        include: {
          customer: true,
          employee: true,
          services: {
            include: {
              service: true
            }
          }
        }
      });
    }

    return await database.appointment.update({
      where: { id },
      data: {
        ...updateData,
        ...(updateData.status && { status: updateData.status as any })
      },
      include: {
        customer: true,
        employee: true,
        services: {
          include: {
            service: true
          }
        }
      }
    });
  }

  async updateStatus(id: number, status: string) {
    return await database.appointment.update({
      where: { id },
      data: { status: status as any },
      include: {
        customer: true,
        employee: true,
        services: {
          include: {
            service: true
          }
        }
      }
    });
  }

  async delete(id: number) {
    return await database.appointment.delete({
      where: { id }
    });
  }

  async checkTimeSlotAvailability(
    employeeId: number,
    date: Date,
    startTime: Date,
    endTime: Date,
    excludeAppointmentId?: number
  ) {
    const whereClause: any = {
      employeeId,
      date,
      OR: [
        {
          AND: [{ startTime: { lte: startTime } }, { endTime: { gt: startTime } }]
        },
        {
          AND: [{ startTime: { lt: endTime } }, { endTime: { gte: endTime } }]
        },
        {
          AND: [{ startTime: { gte: startTime } }, { endTime: { lte: endTime } }]
        }
      ],
      status: {
        not: "CANCELLED"
      }
    };

    if (excludeAppointmentId) {
      whereClause.id = {
        not: excludeAppointmentId
      };
    }

    const conflicting = await database.appointment.findFirst({
      where: whereClause
    });

    return !conflicting;
  }

  async getDashboardStats() {
    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);

    tomorrow.setDate(tomorrow.getDate() + 1);

    const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);

    // Today's appointments
    const todayAppointments = await database.appointment.count({
      where: {
        date: {
          gte: today,
          lt: tomorrow
        }
      }
    });

    // This month's revenue
    const monthlyRevenue = await database.appointment.aggregate({
      where: {
        date: {
          gte: thisMonth,
          lt: nextMonth
        },
        status: "COMPLETED"
      },
      _sum: {
        totalPrice: true
      }
    });

    // Upcoming appointments (next 7 days)
    const nextWeek = new Date(today);

    nextWeek.setDate(nextWeek.getDate() + 7);

    const upcomingAppointments = await database.appointment.findMany({
      where: {
        date: {
          gte: today,
          lte: nextWeek
        },
        status: {
          in: ["SCHEDULED", "CONFIRMED"]
        }
      },
      include: {
        customer: true,
        employee: true
      },
      orderBy: { date: "asc" },
      take: 10
    });

    return {
      todayAppointments,
      monthlyRevenue: Number(monthlyRevenue._sum.totalPrice) || 0,
      upcomingAppointments
    };
  }
}
