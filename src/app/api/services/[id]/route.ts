import "server-only";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { responseError, validateJsonBody } from "@/@core/utils/serverHelpers";
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

    // Handle JSON request
    const json = await validateJsonBody(req);
    const { name, description, price, duration, category, employeeCommission, isActive } = json;

    const updateData = {
      ...(name && { name }),
      ...(description !== undefined && { description }),
      ...(price !== undefined && { price: Number(price) }),
      ...(duration !== undefined && { duration: Number(duration) }),
      ...(category && { category }),
      ...(employeeCommission !== undefined && { employeeCommission: Number(employeeCommission) }),
      ...(isActive !== undefined && { isActive })
    };

    // Validate data
    if (updateData.price !== undefined && updateData.price <= 0) {
      throw new ResponseError("Service price must be greater than 0", 400);
    }

    if (updateData.duration !== undefined && updateData.duration <= 0) {
      throw new ResponseError("Service duration must be greater than 0", 400);
    }

    if (updateData.employeeCommission !== undefined && updateData.employeeCommission < 0) {
      throw new ResponseError("Employee commission must be greater than or equal to 0", 400);
    }

    const serviceRepo = new ServiceRepository();

    const service = await serviceRepo.update(id, updateData);

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
