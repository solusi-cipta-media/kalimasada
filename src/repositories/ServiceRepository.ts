import "server-only";
import database from "@/@libs/database";

export default class ServiceRepository {
  async getAll() {
    return await database.service.findMany({
      orderBy: [{ category: "asc" }, { name: "asc" }]
    });
  }

  async getById(id: number) {
    return await database.service.findUnique({
      where: { id }
    });
  }

  async getByCategory(category: string) {
    return await database.service.findMany({
      where: {
        category: category as any,
        isActive: true
      },
      orderBy: { name: "asc" }
    });
  }

  async getActive() {
    return await database.service.findMany({
      where: { isActive: true },
      orderBy: [{ category: "asc" }, { name: "asc" }]
    });
  }

  async create(data: { name: string; description?: string; price: number; duration: number; category: string }) {
    return await database.service.create({
      data: {
        ...data,
        price: data.price,
        category: data.category as any
      }
    });
  }

  async update(
    id: number,
    data: {
      name?: string;
      description?: string;
      price?: number;
      duration?: number;
      category?: string;
      isActive?: boolean;
    }
  ) {
    return await database.service.update({
      where: { id },
      data: {
        ...data,
        ...(data.category && { category: data.category as any })
      }
    });
  }

  async delete(id: number) {
    return await database.service.delete({
      where: { id }
    });
  }

  async toggleActive(id: number) {
    const service = await this.getById(id);
    if (!service) throw new Error("Service not found");

    return await database.service.update({
      where: { id },
      data: { isActive: !service.isActive }
    });
  }
}
