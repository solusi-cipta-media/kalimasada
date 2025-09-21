import { type NextRequest, NextResponse } from "next/server";

import EmployeeRepository from "@/repositories/EmployeeRepository";
import { responseError } from "@/@core/utils/serverHelpers";
import { ResponseError } from "@/types/errors";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return responseError(new ResponseError("Invalid employee ID", 400));
    }

    const employeeRepo = new EmployeeRepository();
    const employee = await employeeRepo.getById(id);

    if (!employee) {
      return responseError(new ResponseError("Employee not found", 404));
    }

    return NextResponse.json({
      success: true,
      data: employee
    });
  } catch (error) {
    console.error("Error fetching employee:", error);

    return responseError(new ResponseError("Failed to fetch employee", 500));
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return responseError(new ResponseError("Invalid employee ID", 400));
    }

    const body = await request.json();
    const { name, email, phone, position, salary, avatar, isActive } = body;

    const employeeRepo = new EmployeeRepository();

    // Check if employee exists
    const existingEmployee = await employeeRepo.getById(id);

    if (!existingEmployee) {
      return responseError(new ResponseError("Employee not found", 404));
    }

    // Check if email already exists (if provided and different from current)
    if (email && email !== existingEmployee.email) {
      const allEmployees = await employeeRepo.getAll();
      const emailExists = allEmployees.find((emp) => emp.email === email && emp.id !== id);

      if (emailExists) {
        return responseError(new ResponseError("Employee with this email already exists", 400));
      }
    }

    const updateData = {
      ...(name && { name }),
      ...(email && { email }),
      ...(phone !== undefined && { phone }),
      ...(position && { position }),
      ...(salary && { salary: parseFloat(salary) }),
      ...(avatar !== undefined && { avatar }),
      ...(isActive !== undefined && { isActive: Boolean(isActive) })
    };

    const updatedEmployee = await employeeRepo.update(id, updateData);

    return NextResponse.json({
      success: true,
      data: updatedEmployee,
      message: "Employee updated successfully"
    });
  } catch (error) {
    console.error("Error updating employee:", error);

    return responseError(new ResponseError("Failed to update employee", 500));
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return responseError(new ResponseError("Invalid employee ID", 400));
    }

    const employeeRepo = new EmployeeRepository();

    // Check if employee exists
    const existingEmployee = await employeeRepo.getById(id);

    if (!existingEmployee) {
      return responseError(new ResponseError("Employee not found", 404));
    }

    await employeeRepo.delete(id);

    return NextResponse.json({
      success: true,
      message: "Employee deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting employee:", error);

    return responseError(new ResponseError("Failed to delete employee", 500));
  }
}
