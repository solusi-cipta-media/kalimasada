import "server-only";

import { NextResponse, type NextRequest } from "next/server";

import { Prisma } from "@prisma/client";

import MyResponse from "@/@core/utils/MyResponse";
import database from "@/@libs/database";
import RoleRepository from "@/repositories/RoleRepository";

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await database.role.delete({
      where: { id: parseInt(params.id) }
    });

    return MyResponse.ok();
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json({ message: error.message }, { status: 400, statusText: "Bad request" });
    }

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500, statusText: "Internal server error" }
    );
  }
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const repository = new RoleRepository(database);

    const data = await repository.getById(parseInt(params.id), true);

    return MyResponse.json200({ data });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json({ message: error.message }, { status: 404, statusText: "Role not found" });
    }

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500, statusText: "Internal server error" }
    );
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { name, description, byPassAllFeatures, accessIds } = await req.json();
  const id = parseInt(params.id);

  try {
    await database.role.update({
      where: { id },
      data: {
        name,
        description,
        byPassAllFeatures,
        updatedAt: new Date()
      }
    });

    await database.$transaction([
      database.rolePermission.deleteMany({
        where: { roleId: id }
      }),
      database.rolePermission.createMany({
        data: accessIds?.map((menuId: number) => ({
          roleId: id,
          permissionId: menuId
        }))
      })
    ]);

    return MyResponse.ok();
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json({ message: error.message }, { status: 400, statusText: "Bad request" });
    }

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500, statusText: "Internal server error" }
    );
  }
}
