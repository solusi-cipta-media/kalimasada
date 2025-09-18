"use client";
import { useEffect, useState, useCallback } from "react";

import Swal from "sweetalert2";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import moment from "moment";

import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Tabs,
  Tab
} from "@mui/material";
import {
  Add,
  Edit,
  Delete,
  AccessTime,
  Person,
  Spa,
  Schedule as ScheduleIcon,
  Payment,
  EventAvailable,
  CheckCircle,
  Cancel
} from "@mui/icons-material";

import { confirmDialog, successAlert, errorAlert } from "@/utils/sweetAlert";

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
}

interface Employee {
  id: number;
  name: string;
  email: string;
  position: string;
}

interface Service {
  id: number;
  name: string;
  price: number;
  duration: number;
}

interface Appointment {
  id: number;
  customerId: number;
  employeeId: number;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
  notes?: string;
  totalPrice: number;
  customer?: Customer;
  employee?: Employee;
  services?: { service: Service }[];
}

interface FormData {
  customerId: string;
  employeeId: string;
  serviceId: string;
  date: string;
  startTime: moment.Moment | null;
  endTime: moment.Moment | null;
  notes: string;
}

const appointmentStatuses = [
  { value: "SCHEDULED", label: "Terjadwal", color: "primary" as const },
  { value: "CONFIRMED", label: "Dikonfirmasi", color: "info" as const },
  { value: "IN_PROGRESS", label: "Sedang Berlangsung", color: "warning" as const },
  { value: "COMPLETED", label: "Selesai", color: "success" as const },
  { value: "CANCELLED", label: "Dibatalkan", color: "error" as const },
  { value: "NO_SHOW", label: "Tidak Hadir", color: "error" as const }
];

export default function JadwalPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [tabValue, setTabValue] = useState(0);

  // Statistics state
  const [statistics, setStatistics] = useState({
    menungguPembayaran: 0,
    terjadwal: 0,
    selesai: 0,
    dibatalkan: 0
  });

  const [formData, setFormData] = useState<FormData>({
    customerId: "",
    employeeId: "",
    serviceId: "",
    date: new Date().toISOString().split("T")[0],
    startTime: null,
    endTime: null,
    notes: ""
  });

  const fetchCustomers = async () => {
    try {
      const response = await fetch("/api/customer");
      const result = await response.json();

      if (result.success) {
        setCustomers(result.data);
      }
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await fetch("/api/employee");
      const result = await response.json();

      if (result.success) {
        setEmployees(result.data);
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const fetchServices = async () => {
    try {
      const response = await fetch("/api/service");
      const result = await response.json();

      if (result.success) {
        setServices(result.data);
      }
    } catch (error) {
      console.error("Error fetching services:", error);

      // Mock data for services if API is not available
      setServices([
        { id: 1, name: "Massage Relaksasi", price: 150000, duration: 60 },
        { id: 2, name: "Facial Treatment", price: 200000, duration: 90 },
        { id: 3, name: "Body Scrub", price: 180000, duration: 75 }
      ]);
    }
  };

  const fetchAppointments = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/appointment");
      const result = await response.json();

      if (result.success) {
        setAppointments(result.data || []);
        calculateStatistics(result.data || []);
      } else {
        console.error("Failed to fetch appointments:", result.message);
        setAppointments([]);
        calculateStatistics([]);
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
      setAppointments([]);
      calculateStatistics([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Calculate appointment statistics
  const calculateStatistics = (appointmentsData: Appointment[]) => {
    const stats = {
      menungguPembayaran: appointmentsData.filter((apt) => apt.status === "CONFIRMED").length,
      terjadwal: appointmentsData.filter((apt) => apt.status === "SCHEDULED").length,
      selesai: appointmentsData.filter((apt) => apt.status === "COMPLETED").length,
      dibatalkan: appointmentsData.filter((apt) => apt.status === "CANCELLED" || apt.status === "NO_SHOW").length
    };

    setStatistics(stats);
  };

  useEffect(() => {
    fetchCustomers();
    fetchEmployees();
    fetchServices();
    fetchAppointments();
  }, [fetchAppointments]);

  const handleOpenDialog = (appointment?: Appointment) => {
    if (appointment) {
      setEditingAppointment(appointment);
      setFormData({
        customerId: appointment.customerId.toString(),
        employeeId: appointment.employeeId.toString(),
        serviceId: appointment.services?.[0]?.service?.id?.toString() || "",
        date: appointment.date,
        startTime: moment(appointment.startTime, "HH:mm"),
        endTime: moment(appointment.endTime, "HH:mm"),
        notes: appointment.notes || ""
      });
    } else {
      setEditingAppointment(null);
      setFormData({
        customerId: "",
        employeeId: "",
        serviceId: "",
        date: selectedDate,
        startTime: null,
        endTime: null,
        notes: ""
      });
    }

    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingAppointment(null);
  };

  const handleFormChange = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));

    // Auto-calculate end time based on service duration
    if (field === "serviceId" && value) {
      const selectedService = services.find((s) => s.id.toString() === value);

      if (selectedService && formData.startTime) {
        const endTime = moment(formData.startTime).add(selectedService.duration, "minutes");

        setFormData((prev) => ({
          ...prev,
          endTime: endTime
        }));
      }
    }

    if (field === "startTime" && value && formData.serviceId) {
      const selectedService = services.find((s) => s.id.toString() === formData.serviceId);

      if (selectedService) {
        const endTime = moment(value).add(selectedService.duration, "minutes");

        setFormData((prev) => ({
          ...prev,
          endTime: endTime
        }));
      }
    }
  };

  const handleSubmit = async () => {
    try {
      // Validate required fields
      if (
        !formData.customerId ||
        !formData.employeeId ||
        !formData.serviceId ||
        !formData.date ||
        !formData.startTime ||
        !formData.endTime
      ) {
        await Swal.fire({
          title: "Error!",
          text: "Semua field wajib diisi",
          icon: "error"
        });

        return;
      }

      const selectedService = services.find((s) => s.id.toString() === formData.serviceId);

      const appointmentData = {
        customerId: parseInt(formData.customerId),
        employeeId: parseInt(formData.employeeId),
        serviceIds: [parseInt(formData.serviceId)],
        date: formData.date,
        startTime: formData.startTime.format("HH:mm"),
        endTime: formData.endTime.format("HH:mm"),
        status: "SCHEDULED",
        notes: formData.notes,
        totalPrice: selectedService?.price || 0
      };

      const url = editingAppointment ? `/api/appointment/${editingAppointment.id}` : "/api/appointment";
      const method = editingAppointment ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(appointmentData)
      });

      const result = await response.json();

      if (result.success) {
        await fetchAppointments();
        handleCloseDialog();
        Swal.fire(
          successAlert.timer(editingAppointment ? "Appointment berhasil diupdate!" : "Appointment berhasil dibuat!")
        );
      } else {
        throw new Error(result.message || "Failed to save appointment");
      }
    } catch (error) {
      console.error("Error saving appointment:", error);
      await Swal.fire({
        title: "Error!",
        text: "Terjadi kesalahan saat menyimpan appointment",
        icon: "error"
      });
    }
  };

  const handleStatusChange = async (appointment: Appointment, newStatus: string) => {
    try {
      const response = await fetch(`/api/appointment/${appointment.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...appointment,
          status: newStatus
        })
      });

      const result = await response.json();

      if (result.success) {
        await fetchAppointments();
        Swal.fire(successAlert.timer("Status appointment berhasil diupdate!"));
      } else {
        throw new Error(result.message || "Failed to update appointment status");
      }
    } catch (error) {
      console.error("Error updating appointment status:", error);

      await Swal.fire({
        title: "Error!",
        text: "Terjadi kesalahan saat mengupdate status appointment",
        icon: "error"
      });
    }
  };

  const handleDelete = async (appointment: Appointment) => {
    const customerName = appointment.customer?.name || "Unknown Customer";
    const result = await Swal.fire(confirmDialog.delete(`appointment "${customerName}"`));

    if (result.isConfirmed) {
      try {
        const response = await fetch(`/api/appointment/${appointment.id}`, {
          method: "DELETE"
        });

        const deleteResult = await response.json();

        if (deleteResult.success) {
          await fetchAppointments();
          Swal.fire(successAlert.timer("Appointment berhasil dihapus!"));
        } else {
          throw new Error(deleteResult.message || "Failed to delete appointment");
        }
      } catch (error) {
        console.error("Error deleting appointment:", error);
        Swal.fire(errorAlert.network());
      }
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStatusInfo = (status: string) => {
    return appointmentStatuses.find((s) => s.value === status) || appointmentStatuses[0];
  };

  const getTodayAppointments = () => {
    const today = new Date().toISOString().split("T")[0];

    return appointments.filter((apt) => apt.date === today);
  };

  const getUpcomingAppointments = () => {
    const today = new Date().toISOString().split("T")[0];

    return appointments.filter((apt) => apt.date > today);
  };

  const getCurrentAppointments = () => {
    switch (tabValue) {
      case 0:
        return getTodayAppointments();
      case 1:
        return getUpcomingAppointments();
      default:
        return appointments;
    }
  };

  if (loading) {
    return (
      <Box display='flex' justifyContent='center' alignItems='center' minHeight='400px'>
        <Typography>Loading jadwal...</Typography>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Box display='flex' justifyContent='space-between' alignItems='center' mb={3}>
        <Typography variant='h4' component='h1'>
          Manajemen Jadwal
        </Typography>
        <Button variant='contained' startIcon={<Add />} onClick={() => handleOpenDialog()}>
          Buat Appointment
        </Button>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display='flex' alignItems='center' gap={2}>
                <Payment color='warning' sx={{ fontSize: 40 }} />
                <Box>
                  <Typography variant='h4' component='div' color='warning.main'>
                    {statistics.menungguPembayaran}
                  </Typography>
                  <Typography variant='body2' color='text.secondary'>
                    Menunggu Pembayaran
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display='flex' alignItems='center' gap={2}>
                <EventAvailable color='primary' sx={{ fontSize: 40 }} />
                <Box>
                  <Typography variant='h4' component='div' color='primary.main'>
                    {statistics.terjadwal}
                  </Typography>
                  <Typography variant='body2' color='text.secondary'>
                    Terjadwal
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display='flex' alignItems='center' gap={2}>
                <CheckCircle color='success' sx={{ fontSize: 40 }} />
                <Box>
                  <Typography variant='h4' component='div' color='success.main'>
                    {statistics.selesai}
                  </Typography>
                  <Typography variant='body2' color='text.secondary'>
                    Selesai
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display='flex' alignItems='center' gap={2}>
                <Cancel color='error' sx={{ fontSize: 40 }} />
                <Box>
                  <Typography variant='h4' component='div' color='error.main'>
                    {statistics.dibatalkan}
                  </Typography>
                  <Typography variant='body2' color='text.secondary'>
                    Dibatalkan
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Date Selector */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display='flex' alignItems='center' gap={2}>
            <ScheduleIcon color='primary' />
            <Typography variant='h6'>Filter Tanggal</Typography>
            <TextField
              type='date'
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              size='small'
            />
          </Box>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
        <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
          <Tab label={`Hari Ini (${getTodayAppointments().length})`} />
          <Tab label={`Mendatang (${getUpcomingAppointments().length})`} />
          <Tab label={`Semua (${appointments.length})`} />
        </Tabs>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Waktu</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Therapist</TableCell>
              <TableCell>Layanan</TableCell>
              <TableCell>Harga</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Aksi</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {getCurrentAppointments().length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align='center'>
                  <Typography color='textSecondary'>Tidak ada appointment ditemukan</Typography>
                </TableCell>
              </TableRow>
            ) : (
              getCurrentAppointments().map((appointment) => {
                const statusInfo = getStatusInfo(appointment.status);

                return (
                  <TableRow key={appointment.id}>
                    <TableCell>
                      <Box display='flex' alignItems='center' gap={1}>
                        <AccessTime fontSize='small' color='action' />
                        <Box>
                          <Typography variant='body2' fontWeight='medium'>
                            {appointment.startTime} - {appointment.endTime}
                          </Typography>
                          <Typography variant='caption' color='textSecondary'>
                            {new Date(appointment.date).toLocaleDateString("id-ID")}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box display='flex' alignItems='center' gap={2}>
                        <Avatar sx={{ width: 32, height: 32, bgcolor: "primary.main" }}>
                          <Person fontSize='small' />
                        </Avatar>
                        <Box>
                          <Typography variant='body2' fontWeight='medium'>
                            {appointment.customer?.name || "Unknown Customer"}
                          </Typography>
                          <Typography variant='caption' color='textSecondary'>
                            {appointment.customer?.email || "No email"}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box display='flex' alignItems='center' gap={2}>
                        <Avatar sx={{ width: 32, height: 32, bgcolor: "secondary.main" }}>
                          <Spa fontSize='small' />
                        </Avatar>
                        <Box>
                          <Typography variant='body2' fontWeight='medium'>
                            {appointment.employee?.name || "Unknown Employee"}
                          </Typography>
                          <Typography variant='caption' color='textSecondary'>
                            {appointment.employee?.position || "Staff"}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant='body2'>
                        {appointment.services?.[0]?.service?.name || "Unknown Service"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant='body2' fontWeight='medium' color='primary'>
                        {formatCurrency(appointment.totalPrice)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <FormControl size='small' sx={{ minWidth: 120 }}>
                        <Select
                          value={appointment.status}
                          onChange={(e) => handleStatusChange(appointment, e.target.value)}
                        >
                          {appointmentStatuses.map((status) => (
                            <MenuItem key={status.value} value={status.value}>
                              <Chip label={status.label} color={status.color} size='small' variant='outlined' />
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </TableCell>
                    <TableCell>
                      <Box display='flex' gap={1}>
                        <IconButton size='small' color='primary' onClick={() => handleOpenDialog(appointment)}>
                          <Edit fontSize='small' />
                        </IconButton>
                        <IconButton size='small' color='error' onClick={() => handleDelete(appointment)}>
                          <Delete fontSize='small' />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth='sm' fullWidth>
        <DialogTitle>{editingAppointment ? "Edit Appointment" : "Buat Appointment Baru"}</DialogTitle>
        <DialogContent>
          <LocalizationProvider dateAdapter={AdapterMoment}>
            <Box sx={{ pt: 2 }}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Customer</InputLabel>
                    <Select
                      value={formData.customerId}
                      label='Customer'
                      onChange={(e) => handleFormChange("customerId", e.target.value)}
                    >
                      {customers.map((customer) => (
                        <MenuItem key={customer.id} value={customer.id.toString()}>
                          {customer.name} - {customer.email}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Therapist</InputLabel>
                    <Select
                      value={formData.employeeId}
                      label='Therapist'
                      onChange={(e) => handleFormChange("employeeId", e.target.value)}
                    >
                      {employees.map((employee) => (
                        <MenuItem key={employee.id} value={employee.id.toString()}>
                          {employee.name} - {employee.position}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Layanan</InputLabel>
                    <Select
                      value={formData.serviceId}
                      label='Layanan'
                      onChange={(e) => handleFormChange("serviceId", e.target.value)}
                    >
                      {services.map((service) => (
                        <MenuItem key={service.id} value={service.id.toString()}>
                          {service.name} - {formatCurrency(service.price)} ({service.duration} menit)
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label='Tanggal'
                    type='date'
                    value={formData.date}
                    onChange={(e) => handleFormChange("date", e.target.value)}
                    InputLabelProps={{
                      shrink: true
                    }}
                  />
                </Grid>

                <Grid item xs={6}>
                  <TimePicker
                    label='Jam Mulai'
                    value={formData.startTime}
                    onChange={(value) => handleFormChange("startTime", value)}
                    slots={{
                      textField: TextField
                    }}
                    slotProps={{
                      textField: {
                        fullWidth: true
                      }
                    }}
                  />
                </Grid>

                <Grid item xs={6}>
                  <TimePicker
                    label='Jam Selesai'
                    value={formData.endTime}
                    onChange={(value) => handleFormChange("endTime", value)}
                    slots={{
                      textField: TextField
                    }}
                    slotProps={{
                      textField: {
                        fullWidth: true
                      }
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label='Catatan'
                    multiline
                    rows={3}
                    value={formData.notes}
                    onChange={(e) => handleFormChange("notes", e.target.value)}
                    placeholder='Catatan tambahan untuk appointment ini...'
                  />
                </Grid>
              </Grid>
            </Box>
          </LocalizationProvider>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Batal</Button>
          <Button
            variant='contained'
            onClick={handleSubmit}
            disabled={
              !formData.customerId ||
              !formData.employeeId ||
              !formData.serviceId ||
              !formData.date ||
              !formData.startTime ||
              !formData.endTime
            }
          >
            {editingAppointment ? "Update" : "Simpan"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
