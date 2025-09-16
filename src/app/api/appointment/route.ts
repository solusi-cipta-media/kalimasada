import { type NextRequest, NextResponse } from "next/server";

import AppointmentRepository from "@/repositories/AppointmentRepository";
import { responseError, throwIfMissing } from "@/@core/utils/serverHelpers";
import { ResponseError } from "@/types/errors";

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");
    const date = url.searchParams.get("date");
    const customerId = url.searchParams.get("customerId");
    const employeeId = url.searchParams.get("employeeId");

    const appointmentRepo = new AppointmentRepository();

    let appointments;

    if (date) {
      appointments = await appointmentRepo.getByDate(new Date(date));
    } else if (customerId) {
      appointments = await appointmentRepo.getByCustomer(parseInt(customerId));
    } else if (employeeId) {
      appointments = await appointmentRepo.getByEmployee(parseInt(employeeId));
    } else {
      appointments = await appointmentRepo.getAll();
    }

    // Manual pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedAppointments = appointments.slice(startIndex, endIndex);

    return NextResponse.json({
      success: true,
      data: paginatedAppointments,
      total: appointments.length,
      page,
      limit,
      totalPages: Math.ceil(appointments.length / limit)
    });
  } catch (error) {
    console.error("Error fetching appointments:", error);

    return responseError(new ResponseError("Failed to fetch appointments", 500));
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { customerId, employeeId, date, startTime, endTime, serviceIds, notes } = body;

    throwIfMissing(
      { customerId, employeeId, date, startTime, endTime, serviceIds },
      "Customer ID, Employee ID, date, start time, end time, and service IDs are required"
    );

    const appointmentRepo = new AppointmentRepository();

    const appointmentData = {
      customerId: parseInt(customerId),
      employeeId: parseInt(employeeId),
      date: new Date(date),
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      serviceIds: Array.isArray(serviceIds) ? serviceIds.map(Number) : [parseInt(serviceIds)],
      ...(notes && { notes })
    };

    const appointment = await appointmentRepo.create(appointmentData);

    return NextResponse.json({
      success: true,
      data: appointment,
      message: "Appointment created successfully"
    });
  } catch (error) {
    console.error("Error creating appointment:", error);

    return responseError(new ResponseError("Failed to create appointment", 500));
  }
}
