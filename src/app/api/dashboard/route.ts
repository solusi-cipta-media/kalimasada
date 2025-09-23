import "server-only";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { responseError } from "@/@core/utils/serverHelpers";
import { ResponseError } from "@/types/errors";
import AppointmentRepository from "@/repositories/AppointmentRepository";
import CustomerRepository from "@/repositories/CustomerRepository";
import EmployeeRepository from "@/repositories/EmployeeRepository";

export async function GET(req: NextRequest) {
  try {
    // Get query parameters
    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date") || new Date().toISOString().split("T")[0];

    console.log("Dashboard data requested for date:", date);

    // Initialize repositories
    const appointmentRepo = new AppointmentRepository();
    const customerRepo = new CustomerRepository();
    const employeeRepo = new EmployeeRepository();

    // Get today's date range (same logic as jadwal page)
    const selectedDate = new Date(date);
    const startOfDay = new Date(selectedDate);

    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(selectedDate);

    endOfDay.setHours(23, 59, 59, 999);

    // Fetch real data from database
    const [todayAppointments, allAppointments, customers, employees] = await Promise.all([
      appointmentRepo.getByDate(selectedDate),
      appointmentRepo.getAll(),
      customerRepo.getAll(),
      employeeRepo.getAll()
    ]);

    // Calculate statistics using real data
    const todayAppointmentsCount = todayAppointments.length;

    // Calculate monthly revenue (current month)
    const currentMonth = selectedDate.getMonth();
    const currentYear = selectedDate.getFullYear();

    const monthlyAppointments = allAppointments.filter((apt) => {
      const aptDate = new Date(apt.date);

      return aptDate.getMonth() === currentMonth && aptDate.getFullYear() === currentYear && apt.status === "COMPLETED";
    });

    const monthlyRevenue = monthlyAppointments.reduce((sum, apt) => sum + Number(apt.totalPrice), 0);

    // Service distribution from completed appointments
    const completedAppointments = allAppointments.filter((apt) => apt.status === "COMPLETED");
    const serviceStats: Record<string, number> = {};

    completedAppointments.forEach((apt) => {
      apt.services.forEach((svc) => {
        const serviceName = svc.service.name;

        if (!serviceStats[serviceName]) {
          serviceStats[serviceName] = 0;
        }

        serviceStats[serviceName]++;
      });
    });

    // Convert to chart format
    const serviceDistribution = Object.entries(serviceStats).map(([name, count], index) => ({
      name,
      value: count,
      color: ["#8884d8", "#82ca9d", "#ffc658", "#ff7c7c", "#8dd1e1", "#d084d0"][index % 6]
    }));

    // Revenue chart for last 7 days
    const revenueChart = [];

    for (let i = 6; i >= 0; i--) {
      const chartDate = new Date(selectedDate);

      chartDate.setDate(chartDate.getDate() - i);
      const dayStart = new Date(chartDate);

      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(chartDate);

      dayEnd.setHours(23, 59, 59, 999);

      const dayAppointments = allAppointments.filter((apt) => {
        const aptDate = new Date(apt.date);

        return aptDate >= dayStart && aptDate <= dayEnd && apt.status === "COMPLETED";
      });

      const dayRevenue = dayAppointments.reduce((sum, apt) => sum + Number(apt.totalPrice), 0);

      revenueChart.push({
        date: chartDate.toISOString().split("T")[0],
        revenue: dayRevenue
      });
    }

    // Daily activity for last 7 days
    const days = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
    const dailyActivity = [];

    for (let i = 6; i >= 0; i--) {
      const activityDate = new Date(selectedDate);

      activityDate.setDate(activityDate.getDate() - i);
      const dayStart = new Date(activityDate);

      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(activityDate);

      dayEnd.setHours(23, 59, 59, 999);

      const dayAppointments = allAppointments.filter((apt) => {
        const aptDate = new Date(apt.date);

        return aptDate >= dayStart && aptDate <= dayEnd;
      });

      dailyActivity.push({
        day: days[activityDate.getDay()],
        appointments: dayAppointments.length
      });
    }

    // Top services by count and revenue
    const serviceRevenue: Record<string, { count: number; revenue: number }> = {};

    completedAppointments.forEach((apt) => {
      apt.services.forEach((svc) => {
        const serviceName = svc.service.name;

        if (!serviceRevenue[serviceName]) {
          serviceRevenue[serviceName] = { count: 0, revenue: 0 };
        }

        serviceRevenue[serviceName].count++;
        serviceRevenue[serviceName].revenue += Number(svc.price);
      });
    });

    const topServices = Object.entries(serviceRevenue)
      .map(([name, stats]) => ({
        name,
        count: stats.count,
        revenue: stats.revenue
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    // Top employees by appointments and revenue
    const employeeStats: Record<string, { appointments: number; revenue: number }> = {};

    completedAppointments.forEach((apt) => {
      const employeeName = apt.employee.name;

      if (!employeeStats[employeeName]) {
        employeeStats[employeeName] = { appointments: 0, revenue: 0 };
      }

      employeeStats[employeeName].appointments++;
      employeeStats[employeeName].revenue += Number(apt.totalPrice);
    });

    const topEmployees = Object.entries(employeeStats)
      .map(([name, stats]) => ({
        name,
        appointments: stats.appointments,
        revenue: stats.revenue
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    const dashboardData = {
      todayAppointments: todayAppointmentsCount,
      monthlyRevenue: monthlyRevenue,
      totalCustomers: customers.length,
      totalEmployees: employees.length,
      serviceDistribution,
      revenueChart,
      dailyActivity,
      topServices,
      topEmployees
    };

    return NextResponse.json(dashboardData);
  } catch (error) {
    console.error("Dashboard API error:", error);

    if (error instanceof ResponseError) {
      return responseError(error);
    }

    return responseError(new ResponseError("Internal server error", 500));
  }
}
