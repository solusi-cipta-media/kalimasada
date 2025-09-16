import { type NextRequest, NextResponse } from "next/server";

import { Gender } from "@prisma/client";

import CustomerRepository from "@/repositories/CustomerRepository";
import { responseError } from "@/@core/utils/serverHelpers";
import { ResponseError } from "@/types/errors";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return responseError(new ResponseError("Invalid customer ID", 400));
    }

    const customerRepo = new CustomerRepository();
    const customer = await customerRepo.getById(id);

    if (!customer) {
      return responseError(new ResponseError("Customer not found", 404));
    }

    return NextResponse.json({
      success: true,
      data: customer
    });
  } catch (error) {
    console.error("Error fetching customer:", error);

    return responseError(new ResponseError("Failed to fetch customer", 500));
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return responseError(new ResponseError("Invalid customer ID", 400));
    }

    const body = await request.json();
    const { name, email, phone, address, birthDate, gender, notes, avatar } = body;

    // Validate gender if provided
    if (gender && !Object.values(Gender).includes(gender)) {
      return responseError(new ResponseError("Invalid gender value", 400));
    }

    const customerRepo = new CustomerRepository();

    // Check if customer exists
    const existingCustomer = await customerRepo.getById(id);

    if (!existingCustomer) {
      return responseError(new ResponseError("Customer not found", 404));
    }

    // Check if email already exists (if provided and different from current)
    if (email && email !== existingCustomer.email) {
      const existingCustomerByEmail = await customerRepo.searchByName(email);

      if (existingCustomerByEmail.length > 0 && existingCustomerByEmail[0].email === email) {
        return responseError(new ResponseError("Customer with this email already exists", 400));
      }
    }

    const updateData = {
      ...(name && { name }),
      ...(email !== undefined && { email }),
      ...(phone && { phone }),
      ...(address !== undefined && { address }),
      ...(birthDate && { birthDate: new Date(birthDate) }),
      ...(gender && { gender }),
      ...(notes !== undefined && { notes }),
      ...(avatar !== undefined && { avatar })
    };

    const updatedCustomer = await customerRepo.update(id, updateData);

    return NextResponse.json({
      success: true,
      data: updatedCustomer,
      message: "Customer updated successfully"
    });
  } catch (error) {
    console.error("Error updating customer:", error);

    return responseError(new ResponseError("Failed to update customer", 500));
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return responseError(new ResponseError("Invalid customer ID", 400));
    }

    const customerRepo = new CustomerRepository();

    // Check if customer exists
    const existingCustomer = await customerRepo.getById(id);

    if (!existingCustomer) {
      return responseError(new ResponseError("Customer not found", 404));
    }

    await customerRepo.delete(id);

    return NextResponse.json({
      success: true,
      message: "Customer deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting customer:", error);

    return responseError(new ResponseError("Failed to delete customer", 500));
  }
}
