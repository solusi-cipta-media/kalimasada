import { NextResponse, type NextRequest } from "next/server";

import { Prisma } from "@prisma/client";

import MyResponse from "@/@core/utils/MyResponse";
import database from "@/@libs/database";

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await database.user.delete({
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
    const user = await database.user.findUnique({
      where: { id: parseInt(params.id) },
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true
      }
    });

    if (!user) {
      return MyResponse.json404({ message: "User not found" });
    }

    return MyResponse.json200({ data: user });
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

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { fullName, email, roleId } = await req.json();

  try {
    const emailExist = await database.user.findUnique({
      where: { email }
    });

    if (emailExist && emailExist.id !== parseInt(params.id)) {
      return MyResponse.json400({ message: "Email already used" });
    }

    await database.user.update({
      where: { id: parseInt(params.id) },
      data: {
        fullName,
        email,
        roleId,
        updatedAt: new Date()
      }
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
