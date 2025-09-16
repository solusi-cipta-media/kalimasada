import { type NextRequest, NextResponse } from "next/server";

import EmployeeRepository from "@/repositories/EmployeeRepository";
import { responseError, throwIfMissing } from "@/@core/utils/serverHelpers";
import { ResponseError } from "@/types/errors";

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");
    const search = url.searchParams.get("search") || undefined;
    const position = url.searchParams.get("position") || undefined;
    const isActive = url.searchParams.get("isActive");

    const employeeRepo = new EmployeeRepository();

    let employees;

    if (position) {
      employees = await employeeRepo.getByPosition(position);
    } else if (isActive === "true") {
      employees = await employeeRepo.getActive();
    } else {
      employees = await employeeRepo.getAll();
    }

    // Apply search filter if provided
    if (search) {
      employees = employees.filter(
        (employee) =>
          employee.name.toLowerCase().includes(search.toLowerCase()) ||
          employee.email.toLowerCase().includes(search.toLowerCase()) ||
          employee.position.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Manual pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedEmployees = employees.slice(startIndex, endIndex);

    return NextResponse.json({
      success: true,
      data: paginatedEmployees,
      total: employees.length,
      page,
      limit,
      totalPages: Math.ceil(employees.length / limit)
    });
  } catch (error) {
    console.error("Error fetching employees:", error);

    return responseError(new ResponseError("Failed to fetch employees", 500));
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { name, email, phone, position, salary, commission, avatar, isActive, hireDate } = body;

    throwIfMissing({ name, email, position, salary }, "Name, email, position, and salary are required");

    const employeeRepo = new EmployeeRepository();

    // Get all employees to check for existing email
    const allEmployees = await employeeRepo.getAll();
    const existingEmployee = allEmployees.find((emp) => emp.email === email);

    if (existingEmployee) {
      return responseError(new ResponseError("Employee with this email already exists", 400));
    }

    const employeeData = {
      name,
      email,
      position,
      salary: parseFloat(salary),
      ...(phone && { phone }),
      ...(commission && { commission: parseFloat(commission) }),
      ...(avatar && { avatar }),
      ...(isActive !== undefined && { isActive: Boolean(isActive) }),
      ...(hireDate && { hireDate: new Date(hireDate) })
    };

    const employee = await employeeRepo.create(employeeData);

    return NextResponse.json({
      success: true,
      data: employee,
      message: "Employee created successfully"
    });
  } catch (error) {
    console.error("Error creating employee:", error);

    return responseError(new ResponseError("Failed to create employee", 500));
  }
}
