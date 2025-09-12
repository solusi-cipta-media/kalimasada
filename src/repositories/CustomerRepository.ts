import "server-only";
import database from "@/@libs/database";

export default class CustomerRepository {
  async getAll() {
    return await database.customer.findMany({
      orderBy: { name: "asc" }
    });
  }

  async getById(id: number) {
    return await database.customer.findUnique({
      where: { id },
      include: {
        appointments: {
          include: {
            employee: true,
            services: {
              include: {
                service: true
              }
            }
          },
          orderBy: { date: "desc" }
        }
      }
    });
  }

  async searchByName(name: string) {
    return await database.customer.findMany({
      where: {
        name: {
          contains: name,
          mode: "insensitive"
        }
      },
      orderBy: { name: "asc" }
    });
  }

  async searchByPhone(phone: string) {
    return await database.customer.findMany({
      where: {
        phone: {
          contains: phone
        }
      },
      orderBy: { name: "asc" }
    });
  }

  async create(data: {
    name: string;
    email?: string;
    phone: string;
    address?: string;
    birthDate?: Date;
    gender?: string;
    notes?: string;
    avatar?: string;
  }) {
    return await database.customer.create({
      data: {
        ...data,
        ...(data.gender && { gender: data.gender as any })
      }
    });
  }

  async update(
    id: number,
    data: {
      name?: string;
      email?: string;
      phone?: string;
      address?: string;
      birthDate?: Date;
      gender?: string;
      notes?: string;
      avatar?: string;
    }
  ) {
    return await database.customer.update({
      where: { id },
      data: {
        ...data,
        ...(data.gender && { gender: data.gender as any })
      }
    });
  }

  async delete(id: number) {
    return await database.customer.delete({
      where: { id }
    });
  }

  async getCustomerStats(customerId: number) {
    const customer = await this.getById(customerId);
    if (!customer) return null;

    const totalAppointments = customer.appointments.length;
    const completedAppointments = customer.appointments.filter((apt) => apt.status === "COMPLETED").length;

    const totalSpent = customer.appointments
      .filter((apt) => apt.status === "COMPLETED")
      .reduce((sum, apt) => sum + Number(apt.totalPrice), 0);

    const lastVisit = customer.appointments[0]?.date;

    return {
      customer,
      totalAppointments,
      completedAppointments,
      totalSpent,
      lastVisit
    };
  }

  async getBirthdayCustomers(month: number) {
    return await database.customer
      .findMany({
        where: {
          birthDate: {
            not: null
          }
        }
      })
      .then((customers) =>
        customers.filter((customer) => customer.birthDate && customer.birthDate.getMonth() === month - 1)
      );
  }

  async getFrequentCustomers(limit: number = 10) {
    const customers = await database.customer.findMany({
      include: {
        appointments: {
          where: {
            status: "COMPLETED"
          }
        }
      }
    });

    return customers
      .map((customer) => ({
        ...customer,
        appointmentCount: customer.appointments.length,
        totalSpent: customer.appointments.reduce((sum, apt) => sum + Number(apt.totalPrice), 0)
      }))
      .sort((a, b) => b.appointmentCount - a.appointmentCount)
      .slice(0, limit);
  }
}
