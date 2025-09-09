import "server-only";

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { hash } from "bcrypt";

import { responseError, throwIfMissing } from "@/@core/utils/serverHelpers";
import database from "@/@libs/database";
import MyResponse from "@/@core/utils/MyResponse";
import handleUploadImage from "@/@core/utils/handleUploadImage";

type UpdatedUserData = {
  fullName?: string;
  email?: string;
  password?: string;
  avatar?: string;
};

export async function GET(req: NextRequest) {
  try {
    const id = req.headers.get("userId");

    throwIfMissing(id, "User id is required.");

    const user = await database.user.findUnique({
      where: {
        id: Number(id)
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        avatar: true,
        createdAt: true,
        updatedAt: true
      }
    });

    throwIfMissing(user, "User not found!", 404);

    const response = NextResponse.json({
      message: "ok",
      data: user
    });

    return response;
  } catch (error: any) {
    return responseError(error);
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const id = req.headers.get("userId");

    throwIfMissing(id, "User id is required.");

    const formData = await req.formData();
    const body = Object.fromEntries(formData);
    const file = body.avatar as File | null;

    const fullName = body.fullName as string | undefined;
    const email = body.email as string | undefined;
    const password = body.password as string | undefined;

    const user = await database.user.findUnique({
      where: { id: Number(id) },
      select: {
        id: true,
        fullName: true,
        email: true,
        avatar: true,
        createdAt: true,
        updatedAt: true
      }
    });

    throwIfMissing(user, "User not found!", 404);

    if (email && email !== user?.email) {
      const existingUser = await database.user.findUnique({ where: { email: email } });

      if (existingUser) {
        return MyResponse.json400({ message: "Email is already used." });
      }
    }

    const updatedData: UpdatedUserData = {};

    if (fullName) updatedData.fullName = fullName;
    if (email) updatedData.email = email;
    if (password) updatedData.password = await hash(password, 10);

    // Jika ada file yang di-upload, simpan ke AVATAR_UPLOAD_DIR
    if (file) {
      updatedData.avatar = await handleUploadImage({ file, oldImage: user?.avatar, directory: "avatar" });
    }

    const updatedUser = await database.user.update({
      where: { id: Number(id) },
      data: updatedData
    });

    return NextResponse.json({
      message: "ok",
      data: updatedUser
    });
  } catch (error: any) {
    return responseError(error);
  }
}
