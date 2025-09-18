import "server-only";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { responseError, throwIfMissing } from "@/@core/utils/serverHelpers";
import ServiceRepository from "@/repositories/ServiceRepository";
import { ResponseError } from "@/types/errors";
import handleUploadImage from "@/@core/utils/handleUploadImage";

export async function GET() {
  try {
    const serviceRepo = new ServiceRepository();
    const services = await serviceRepo.getAll();

    return NextResponse.json({
      message: "Services retrieved successfully",
      data: services
    });
  } catch (error) {
    if (error instanceof ResponseError) {
      return responseError(error);
    }

    return responseError(new ResponseError("Internal server error", 500));
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = formData.get("price") as string;
    const duration = formData.get("duration") as string;
    const category = formData.get("category") as string;
    const employeeCommission = formData.get("employeeCommission") as string;
    const imageFile = formData.get("image") as File | null;

    throwIfMissing(name, "Service name is required");
    throwIfMissing(price, "Service price is required");
    throwIfMissing(duration, "Service duration is required");
    throwIfMissing(category, "Service category is required");

    if (Number(price) <= 0) {
      throw new ResponseError("Service price must be greater than 0", 400);
    }

    if (Number(duration) <= 0) {
      throw new ResponseError("Service duration must be greater than 0", 400);
    }

    if (employeeCommission && Number(employeeCommission) < 0) {
      throw new ResponseError("Employee commission must be greater than or equal to 0", 400);
    }

    let imageUrl: string | undefined;

    if (imageFile && imageFile.size > 0) {
      imageUrl = await handleUploadImage({
        file: imageFile,
        directory: "services"
      });
    }

    const serviceRepo = new ServiceRepository();

    const service = await serviceRepo.create({
      name,
      description: description || undefined,
      price: Number(price),
      duration: Number(duration),
      category,
      employeeCommission: employeeCommission ? Number(employeeCommission) : undefined,
      image: imageUrl
    });

    return NextResponse.json(
      {
        message: "Service created successfully",
        data: service
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof ResponseError) {
      return responseError(error);
    }

    return responseError(new ResponseError("Internal server error", 500));
  }
}
