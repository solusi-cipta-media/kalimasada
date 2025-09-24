import { type NextRequest, NextResponse } from "next/server";

import { hash } from "bcrypt";

import EmployeeRepository from "@/repositories/EmployeeRepository";
import { responseError, throwIfMissing } from "@/@core/utils/serverHelpers";
import { ResponseError } from "@/types/errors";
import database from "@/@libs/database";

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

    const { name, email, phone, position, salary, avatar, isActive, hireDate, createUserAccount, roleId, password } =
      body;

    throwIfMissing({ name, email, position, salary }, "Name, email, position, and salary are required");

    // If creating user account, validate user-specific fields
    if (createUserAccount) {
      throwIfMissing({ roleId, password }, "Role and password are required for user account creation");
    }

    const employeeRepo = new EmployeeRepository();

    // Get all employees to check for existing email
    const allEmployees = await employeeRepo.getAll();
    const existingEmployee = allEmployees.find((emp) => emp.email === email);

    if (existingEmployee) {
      return responseError(new ResponseError("Employee with this email already exists", 400));
    }

    // Check if user with email already exists (if creating user account)
    if (createUserAccount) {
      const existingUser = await database.user.findUnique({ where: { email } });

      if (existingUser) {
        return responseError(new ResponseError("User with this email already exists", 400));
      }
    }

    const employeeData = {
      name,
      email,
      position,
      salary: parseFloat(salary),
      ...(phone && { phone }),
      ...(avatar && { avatar }),
      ...(isActive !== undefined && { isActive: Boolean(isActive) }),
      ...(hireDate && { hireDate: new Date(hireDate) })
    };

    let employee;
    let user = null;

    if (createUserAccount) {
      // Use database transaction to create both employee and user
      const result = await database.$transaction(async (prisma) => {
        // Create employee first
        const newEmployee = await prisma.employee.create({
          data: employeeData
        });

        // Hash password and create user
        const hashedPassword = await hash(password, 12);

        const newUser = await prisma.user.create({
          data: {
            fullName: name,
            email,
            password: hashedPassword,
            roleId: parseInt(roleId),
            avatar
          }
        });

        return { employee: newEmployee, user: newUser };
      });

      employee = result.employee;
      user = result.user;
    } else {
      // Create only employee
      employee = await employeeRepo.create(employeeData);
    }

    return NextResponse.json({
      success: true,
      data: { employee, user },
      message: createUserAccount ? "Employee and user account created successfully" : "Employee created successfully"
    });
  } catch (error) {
    console.error("Error creating employee:", error);

    return responseError(new ResponseError("Failed to create employee", 500));
  }
}
