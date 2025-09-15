import "server-only";
import database from "@/@libs/database";

export default class PayrollGenerationRepository {
  async getAll() {
    return await database.payrollGeneration.findMany({
      include: {
        generatedByUser: {
          select: {
            id: true,
            fullName: true,
            email: true
          }
        },
        payrolls: {
          include: {
            employee: {
              select: {
                id: true,
                name: true,
                position: true
              }
            }
          }
        }
      },
      orderBy: [{ year: "desc" }, { month: "desc" }]
    });
  }

  async getById(id: number) {
    return await database.payrollGeneration.findUnique({
      where: { id },
      include: {
        generatedByUser: {
          select: {
            id: true,
            fullName: true,
            email: true
          }
        },
        payrolls: {
          include: {
            employee: {
              select: {
                id: true,
                name: true,
                position: true,
                avatar: true
              }
            }
          },
          orderBy: { employee: { name: "asc" } }
        }
      }
    });
  }

  async getByPeriod(year: number, month: number) {
    return await database.payrollGeneration.findUnique({
      where: {
        month_year: {
          month,
          year
        }
      },
      include: {
        generatedByUser: {
          select: {
            id: true,
            fullName: true,
            email: true
          }
        },
        payrolls: {
          include: {
            employee: true
          }
        }
      }
    });
  }

  async create(data: {
    month: number;
    year: number;
    generatedBy: number;
    employeeCount: number;
    totalAmount: number;
    notes?: string;
  }) {
    return await database.payrollGeneration.create({
      data,
      include: {
        generatedByUser: {
          select: {
            id: true,
            fullName: true,
            email: true
          }
        }
      }
    });
  }

  async update(
    id: number,
    data: {
      employeeCount?: number;
      totalAmount?: number;
      status?: string;
      notes?: string;
    }
  ) {
    return await database.payrollGeneration.update({
      where: { id },
      data,
      include: {
        generatedByUser: {
          select: {
            id: true,
            fullName: true,
            email: true
          }
        }
      }
    });
  }

  async delete(id: number) {
    // First, update all related payrolls to remove the generationId
    await database.payroll.updateMany({
      where: { generationId: id },
      data: { generationId: null }
    });

    // Then delete the generation record
    return await database.payrollGeneration.delete({
      where: { id }
    });
  }

  async getGenerationSummary() {
    const generations = await database.payrollGeneration.findMany({
      include: {
        generatedByUser: {
          select: {
            id: true,
            fullName: true
          }
        },
        _count: {
          select: {
            payrolls: true
          }
        }
      },
      orderBy: [{ year: "desc" }, { month: "desc" }]
    });

    const summary = {
      totalGenerations: generations.length,
      totalEmployeesProcessed: generations.reduce((sum, gen) => sum + gen.employeeCount, 0),
      totalAmountGenerated: generations.reduce((sum, gen) => sum + Number(gen.totalAmount), 0),
      recentGenerations: generations.slice(0, 5)
    };

    return summary;
  }
}
