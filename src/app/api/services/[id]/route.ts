import "server-only";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { responseError, throwIfMissing, validateJsonBody } from "@/@core/utils/serverHelpers";
import ServiceRepository from "@/repositories/ServiceRepository";
import { ResponseError } from "@/types/errors";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      throw new ResponseError("Invalid service ID", 400);
    }

    const serviceRepo = new ServiceRepository();
    const service = await serviceRepo.getById(id);

    if (!service) {
      throw new ResponseError("Service not found", 404);
    }

    return NextResponse.json({
      message: "Service retrieved successfully",
      data: service
    });
  } catch (error) {
    if (error instanceof ResponseError) {
      return responseError(error);
    }
    return responseError(new ResponseError("Internal server error", 500));
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      throw new ResponseError("Invalid service ID", 400);
    }

    const json = await validateJsonBody(req);
    const { name, description, price, duration, category, isActive } = json;

    if (price !== undefined && price <= 0) {
      throw new ResponseError("Service price must be greater than 0", 400);
    }

    if (duration !== undefined && duration <= 0) {
      throw new ResponseError("Service duration must be greater than 0", 400);
    }

    const serviceRepo = new ServiceRepository();
    const service = await serviceRepo.update(id, {
      name,
      description,
      ...(price !== undefined && { price: Number(price) }),
      ...(duration !== undefined && { duration: Number(duration) }),
      category,
      isActive
    });

    return NextResponse.json({
      message: "Service updated successfully",
      data: service
    });
  } catch (error) {
    if (error instanceof ResponseError) {
      return responseError(error);
    }
    return responseError(new ResponseError("Internal server error", 500));
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      throw new ResponseError("Invalid service ID", 400);
    }

    const serviceRepo = new ServiceRepository();
    await serviceRepo.delete(id);

    return NextResponse.json({
      message: "Service deleted successfully"
    });
  } catch (error) {
    if (error instanceof ResponseError) {
      return responseError(error);
    }
    return responseError(new ResponseError("Internal server error", 500));
  }
}
