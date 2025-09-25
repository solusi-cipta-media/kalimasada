import { type NextRequest, NextResponse } from "next/server";

import AppointmentRepository from "@/repositories/AppointmentRepository";
import { responseError } from "@/@core/utils/serverHelpers";
import { ResponseError } from "@/types/errors";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return responseError(new ResponseError("Invalid appointment ID", 400));
    }

    const appointmentRepo = new AppointmentRepository();
    const appointment = await appointmentRepo.getById(id);

    if (!appointment) {
      return responseError(new ResponseError("Appointment not found", 404));
    }

    return NextResponse.json({
      success: true,
      data: appointment
    });
  } catch (error) {
    console.error("Error fetching appointment:", error);

    return responseError(new ResponseError("Failed to fetch appointment", 500));
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return responseError(new ResponseError("Invalid appointment ID", 400));
    }

    const body = await request.json();

    const {
      customerId,
      employeeId,
      serviceIds,
      date,
      startTime,
      endTime,
      status,
      notes,
      tipeLayanan,
      upahLembur,
      uangBensin,
      commissionAmount
    } = body;

    const appointmentRepo = new AppointmentRepository();

    // Check if appointment exists
    const existingAppointment = await appointmentRepo.getById(id);

    if (!existingAppointment) {
      return responseError(new ResponseError("Appointment not found", 404));
    }

    // Check therapist schedule availability if time/employee is being changed
    if ((employeeId || startTime || endTime || date)) {
      const targetEmployeeId = employeeId ? parseInt(employeeId) : existingAppointment.employeeId;
      const targetDate = date ? new Date(date) : existingAppointment.date;
      const targetStartTime = startTime ? new Date(startTime) : existingAppointment.startTime;
      const targetEndTime = endTime ? new Date(endTime) : existingAppointment.endTime;

      const isAvailable = await appointmentRepo.checkTimeSlotAvailability(
        targetEmployeeId,
        targetDate,
        targetStartTime,
        targetEndTime,
        id // Exclude current appointment from conflict check
      );

      if (!isAvailable) {
        return NextResponse.json({
          success: false,
          message: "Therapist sudah memiliki appointment pada waktu tersebut. Silakan pilih waktu lain."
        }, { status: 409 });
      }
    }

    const updateData = {
      ...(customerId && { customerId: parseInt(customerId) }),
      ...(employeeId && { employeeId: parseInt(employeeId) }),
      ...(serviceIds && Array.isArray(serviceIds) && { serviceIds: serviceIds.map((id: any) => parseInt(id)) }),
      ...(date && { date: new Date(date) }),
      ...(startTime && { startTime: new Date(startTime) }),
      ...(endTime && { endTime: new Date(endTime) }),
      ...(status && { status }),
      ...(notes !== undefined && { notes }),
      ...(tipeLayanan && { tipeLayanan }),
      ...(upahLembur !== undefined && { upahLembur: parseFloat(upahLembur) }),
      ...(uangBensin !== undefined && { uangBensin: parseFloat(uangBensin) }),
      ...(commissionAmount !== undefined && { commissionAmount: parseFloat(commissionAmount) })
    };

    const updatedAppointment = await appointmentRepo.update(id, updateData);

    return NextResponse.json({
      success: true,
      data: updatedAppointment,
      message: "Appointment updated successfully"
    });
  } catch (error) {
    console.error("Error updating appointment:", error);

    return responseError(new ResponseError("Failed to update appointment", 500));
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return responseError(new ResponseError("Invalid appointment ID", 400));
    }

    const appointmentRepo = new AppointmentRepository();

    // Check if appointment exists
    const existingAppointment = await appointmentRepo.getById(id);

    if (!existingAppointment) {
      return responseError(new ResponseError("Appointment not found", 404));
    }

    await appointmentRepo.delete(id);

    return NextResponse.json({
      success: true,
      message: "Appointment deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting appointment:", error);

    return responseError(new ResponseError("Failed to delete appointment", 500));
  }
}
