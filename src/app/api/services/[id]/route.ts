import "server-only";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { responseError, validateJsonBody } from "@/@core/utils/serverHelpers";
import ServiceRepository from "@/repositories/ServiceRepository";
import { ResponseError } from "@/types/errors";
import handleUploadImage from "@/@core/utils/handleUploadImage";

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

    // Check if this is a multipart request (with image) or JSON request (simple update)
    const contentType = req.headers.get("content-type");
    let updateData: any = {};

    if (contentType?.includes("multipart/form-data")) {
      // Handle multipart form data (with potential image upload)
      const formData = await req.formData();
      const name = formData.get("name") as string;
      const description = formData.get("description") as string;
      const price = formData.get("price") as string;
      const duration = formData.get("duration") as string;
      const category = formData.get("category") as string;
      const employeeCommission = formData.get("employeeCommission") as string;
      const imageFile = formData.get("image") as File | null;
      const existingImage = formData.get("existingImage") as string;

      // Prepare update data
      updateData = {
        ...(name && { name }),
        ...(description !== null && { description: description || undefined }),
        ...(price && { price: Number(price) }),
        ...(duration && { duration: Number(duration) }),
        ...(category && { category }),
        ...(employeeCommission && { employeeCommission: Number(employeeCommission) })
      };

      // Handle image upload
      if (imageFile && imageFile.size > 0) {
        const serviceRepo = new ServiceRepository();
        const currentService = await serviceRepo.getById(id);

        const imageUrl = await handleUploadImage({
          file: imageFile,
          oldImage: (currentService as any)?.image,
          directory: "services"
        });

        updateData.image = imageUrl;
      } else if (existingImage) {
        // Keep existing image if no new file is uploaded
        updateData.image = existingImage;
      }
    } else {
      // Handle JSON request (simple updates like isActive toggle)
      const json = await validateJsonBody(req);
      const { name, description, price, duration, category, employeeCommission, isActive } = json;

      updateData = {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(price !== undefined && { price: Number(price) }),
        ...(duration !== undefined && { duration: Number(duration) }),
        ...(category && { category }),
        ...(employeeCommission !== undefined && { employeeCommission: Number(employeeCommission) }),
        ...(isActive !== undefined && { isActive })
      };
    }

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
