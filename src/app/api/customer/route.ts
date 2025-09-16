import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { Gender } from "@prisma/client";

import CustomerRepository from "@/repositories/CustomerRepository";
import { responseError, throwIfMissing } from "@/@core/utils/serverHelpers";
import { ResponseError } from "@/types/errors";

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");
    const search = url.searchParams.get("search") || undefined;

    const customerRepo = new CustomerRepository();

    if (search) {
      // If search parameter exists, search by name or phone
      const nameResults = await customerRepo.searchByName(search);
      const phoneResults = await customerRepo.searchByPhone(search);

      // Combine and deduplicate results
      const combinedResults = [...nameResults, ...phoneResults];

      const uniqueResults = combinedResults.filter(
        (customer, index, self) => index === self.findIndex((c) => c.id === customer.id)
      );

      return NextResponse.json({
        success: true,
        data: uniqueResults,
        total: uniqueResults.length,
        page: 1,
        limit: uniqueResults.length,
        totalPages: 1
      });
    }

    const customers = await customerRepo.getAll();

    // Manual pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedCustomers = customers.slice(startIndex, endIndex);

    return NextResponse.json({
      success: true,
      data: paginatedCustomers,
      total: customers.length,
      page,
      limit,
      totalPages: Math.ceil(customers.length / limit)
    });
  } catch (error) {
    console.error("Error fetching customers:", error);

    return responseError(new ResponseError("Failed to fetch customers", 500));
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { name, email, phone, address, birthDate, gender, notes, avatar } = body;

    throwIfMissing({ name, phone }, "Name and phone are required");

    // Validate gender if provided
    if (gender && !Object.values(Gender).includes(gender)) {
      return responseError(new ResponseError("Invalid gender value", 400));
    }

    const customerRepo = new CustomerRepository();

    // Check if email already exists (if provided)
    if (email) {
      const existingCustomerByEmail = await customerRepo.searchByName(email);

      if (existingCustomerByEmail.length > 0 && existingCustomerByEmail[0].email === email) {
        return responseError(new ResponseError("Customer with this email already exists", 400));
      }
    }

    const customerData = {
      name,
      phone,
      ...(email && { email }),
      ...(address && { address }),
      ...(birthDate && { birthDate: new Date(birthDate) }),
      ...(gender && { gender }),
      ...(notes && { notes }),
      ...(avatar && { avatar })
    };

    const customer = await customerRepo.create(customerData);

    return NextResponse.json({
      success: true,
      data: customer,
      message: "Customer created successfully"
    });
  } catch (error) {
    console.error("Error creating customer:", error);

    return responseError(new ResponseError("Failed to create customer", 500));
  }
}
