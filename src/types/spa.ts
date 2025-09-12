export interface Employee {
  id: number;
  name: string;
  email: string;
  phone?: string;
  position: string;
  salary: number;
  commission?: number;
  avatar?: string;
  isActive: boolean;
  hireDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Service {
  id: number;
  name: string;
  description?: string;
  price: number;
  duration: number;
  category: ServiceCategory;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Customer {
  id: number;
  name: string;
  email?: string;
  phone: string;
  address?: string;
  birthDate?: Date;
  gender?: Gender;
  notes?: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Appointment {
  id: number;
  customerId: number;
  employeeId: number;
  date: Date;
  startTime: Date;
  endTime: Date;
  status: AppointmentStatus;
  totalPrice: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  customer?: Customer;
  employee?: Employee;
  services?: AppointmentService[];
}

export interface AppointmentService {
  id: number;
  appointmentId: number;
  serviceId: number;
  price: number;
  service?: Service;
}

export interface Payroll {
  id: number;
  employeeId: number;
  month: number;
  year: number;
  baseSalary: number;
  commission: number;
  bonus: number;
  deduction: number;
  totalSalary: number;
  paidAt?: Date;
  status: PayrollStatus;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  employee?: Employee;
}

export enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE"
}

export enum ServiceCategory {
  FACIAL = "FACIAL",
  MASSAGE = "MASSAGE",
  BODY_TREATMENT = "BODY_TREATMENT",
  HAIR_TREATMENT = "HAIR_TREATMENT",
  NAIL_CARE = "NAIL_CARE",
  MAKEUP = "MAKEUP",
  WAXING = "WAXING",
  OTHER = "OTHER"
}

export enum AppointmentStatus {
  SCHEDULED = "SCHEDULED",
  CONFIRMED = "CONFIRMED",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
  NO_SHOW = "NO_SHOW"
}

export enum PayrollStatus {
  PENDING = "PENDING",
  PAID = "PAID",
  CANCELLED = "CANCELLED"
}

// Form Types
export interface ServiceFormData {
  name: string;
  description?: string;
  price: number;
  duration: number;
  category: ServiceCategory;
}

export interface EmployeeFormData {
  name: string;
  email: string;
  phone?: string;
  position: string;
  salary: number;
  commission?: number;
  avatar?: string;
  hireDate?: Date;
}

export interface CustomerFormData {
  name: string;
  email?: string;
  phone: string;
  address?: string;
  birthDate?: Date;
  gender?: Gender;
  notes?: string;
  avatar?: string;
}

export interface AppointmentFormData {
  customerId: number;
  employeeId: number;
  date: Date;
  startTime: Date;
  endTime: Date;
  serviceIds: number[];
  notes?: string;
}

export interface PayrollFormData {
  employeeId: number;
  month: number;
  year: number;
  baseSalary: number;
  commission?: number;
  bonus?: number;
  deduction?: number;
  notes?: string;
}

// Dashboard Stats Types
export interface DashboardStats {
  todayAppointments: number;
  monthlyRevenue: number;
  totalCustomers: number;
  totalEmployees: number;
  upcomingAppointments: Appointment[];
  recentCustomers: Customer[];
  topServices: Array<{
    service: Service;
    count: number;
    revenue: number;
  }>;
}

export interface EmployeeStats {
  totalAppointments: number;
  totalRevenue: number;
  monthlyStats: Array<{
    month: string;
    appointments: number;
    revenue: number;
  }>;
}

export interface CustomerStats {
  totalAppointments: number;
  completedAppointments: number;
  totalSpent: number;
  lastVisit?: Date;
  favoriteServices: Array<{
    service: Service;
    count: number;
  }>;
}

// Utility Types
export interface DateRange {
  startDate: Date;
  endDate: Date;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface SortParams {
  field: string;
  direction: "asc" | "desc";
}

export interface FilterParams {
  search?: string;
  category?: ServiceCategory;
  status?: AppointmentStatus | PayrollStatus;
  dateRange?: DateRange;
  employeeId?: number;
  customerId?: number;
}
