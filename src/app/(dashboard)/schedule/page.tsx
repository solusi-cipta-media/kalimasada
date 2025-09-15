"use client";
import { useEffect, useState } from "react";

import Swal from "sweetalert2";

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
  CheckCircle,
  Cancel,
  Schedule as ScheduleIcon
} from "@mui/icons-material";

import { confirmDialog, successAlert, errorAlert } from "@/utils/sweetAlert";

interface Appointment {
  id: number;
  customerName: string;
  employeeName: string;
  services: string[];
  date: string;
  startTime: string;
  endTime: string;
  status: "SCHEDULED" | "CONFIRMED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED" | "NO_SHOW";
  totalPrice: number;
  notes?: string;
}

const appointmentStatuses = [
  { value: "SCHEDULED", label: "Terjadwal", color: "default" as const },
  { value: "CONFIRMED", label: "Terkonfirmasi", color: "primary" as const },
  { value: "IN_PROGRESS", label: "Sedang Berlangsung", color: "warning" as const },
  { value: "COMPLETED", label: "Selesai", color: "success" as const },
  { value: "CANCELLED", label: "Dibatalkan", color: "error" as const },
  { value: "NO_SHOW", label: "Tidak Hadir", color: "error" as const }
];

export default function JadwalPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [tabValue, setTabValue] = useState(0);

  const [formData, setFormData] = useState({
    customerId: "",
    employeeId: "",
    serviceIds: [] as string[],
    date: "",
    startTime: "",
    endTime: "",
    notes: ""
  });

  useEffect(() => {
    fetchAppointments();
  }, [selectedDate]);

  const fetchAppointments = async () => {
    try {
      // TODO: Implement API call to fetch appointments
      // For now, using mock data
      setAppointments([
        {
          id: 1,
          customerName: "Sarah Johnson",
          employeeName: "Sari Dewi",
          services: ["Balinese Massage"],
          date: "2024-09-09",
          startTime: "10:00",
          endTime: "11:30",
          status: "CONFIRMED",
          totalPrice: 350000,
          notes: "Customer preferensi musik klasik"
        },
        {
          id: 2,
          customerName: "Michael Chen",
          employeeName: "Kadek Ayu",
          services: ["Hydrating Facial"],
          date: "2024-09-09",
          startTime: "11:30",
          endTime: "12:45",
          status: "SCHEDULED",
          totalPrice: 250000
        },
        {
          id: 3,
          customerName: "Lisa Anderson",
          employeeName: "Ni Luh Putu",
          services: ["Manicure", "Pedicure"],
          date: "2024-09-09",
          startTime: "13:00",
          endTime: "14:00",
          status: "IN_PROGRESS",
          totalPrice: 150000
        },
        {
          id: 4,
          customerName: "David Wilson",
          employeeName: "Made Wirawan",
          services: ["Hot Stone Massage"],
          date: "2024-09-09",
          startTime: "14:30",
          endTime: "16:30",
          status: "SCHEDULED",
          totalPrice: 500000
        }
      ]);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      setLoading(false);
    }
  };

  const handleOpenDialog = (appointment?: Appointment) => {
    if (appointment) {
      setEditingAppointment(appointment);
      setFormData({
        customerId: "1", // TODO: Get actual customer ID
        employeeId: "1", // TODO: Get actual employee ID
        serviceIds: ["1"], // TODO: Get actual service IDs
        date: appointment.date,
        startTime: appointment.startTime,
        endTime: appointment.endTime,
        notes: appointment.notes || ""
      });
    } else {
      setEditingAppointment(null);
      setFormData({
        customerId: "",
        employeeId: "",
        serviceIds: [],
        date: selectedDate,
        startTime: "",
        endTime: "",
        notes: ""
      });
    }

    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingAppointment(null);
    setFormData({
      customerId: "",
      employeeId: "",
      serviceIds: [],
      date: "",
      startTime: "",
      endTime: "",
      notes: ""
    });
  };

  const handleSubmit = async () => {
    try {
      // TODO: Implement API call to save appointment
      console.log("Saving appointment:", formData);
      await fetchAppointments();
      handleCloseDialog();

      // TODO: Show success toast
    } catch (error) {
      console.error("Error saving appointment:", error);

      // TODO: Show error toast
    }
  };

  const handleStatusChange = async (appointment: Appointment, newStatus: string) => {
    try {
      // TODO: Implement API call to update appointment status
      console.log("Updating appointment status:", appointment.id, newStatus);
      await fetchAppointments();

      // TODO: Show success toast
    } catch (error) {
      console.error("Error updating appointment status:", error);
    }
  };

  const handleDelete = async (appointment: Appointment) => {
    const result = await Swal.fire(confirmDialog.delete(`appointment "${appointment.customerName}"`));

    if (result.isConfirmed) {
      try {
        // TODO: Implement API call to delete appointment
        console.log("Deleting appointment:", appointment.id);
        await fetchAppointments();

        Swal.fire(successAlert.timer("Appointment berhasil dihapus!"));
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

      {/* Date Selector */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display='flex' alignItems='center' gap={2}>
            <Typography variant='h6'>Pilih Tanggal:</Typography>
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
              <TableCell align='center'>Aksi</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {getCurrentAppointments().map((appointment) => (
              <TableRow key={appointment.id}>
                <TableCell>
                  <Box display='flex' alignItems='center' gap={1}>
                    <AccessTime />
                    <Box>
                      <Typography variant='subtitle2'>
                        {appointment.startTime} - {appointment.endTime}
                      </Typography>
                      <Typography variant='body2' color='textSecondary'>
                        {new Date(appointment.date).toLocaleDateString("id-ID")}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box display='flex' alignItems='center' gap={2}>
                    <Avatar>
                      <Person />
                    </Avatar>
                    <Typography variant='subtitle2'>{appointment.customerName}</Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box display='flex' alignItems='center' gap={2}>
                    <Avatar>
                      <Spa />
                    </Avatar>
                    <Typography variant='subtitle2'>{appointment.employeeName}</Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box>
                    {appointment.services.map((service, index) => (
                      <Chip key={index} label={service} size='small' sx={{ mr: 0.5, mb: 0.5 }} />
                    ))}
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant='subtitle2'>{formatCurrency(appointment.totalPrice)}</Typography>
                </TableCell>
                <TableCell>
                  <FormControl size='small' sx={{ minWidth: 120 }}>
                    <Select
                      value={appointment.status}
                      onChange={(e) => handleStatusChange(appointment, e.target.value)}
                    >
                      {appointmentStatuses.map((status) => (
                        <MenuItem key={status.value} value={status.value}>
                          <Chip label={status.label} color={status.color} size='small' />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </TableCell>
                <TableCell align='center'>
                  <IconButton size='small' onClick={() => handleOpenDialog(appointment)}>
                    <Edit />
                  </IconButton>
                  <IconButton size='small' color='error' onClick={() => handleDelete(appointment)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth='md' fullWidth>
        <DialogTitle>{editingAppointment ? "Edit Appointment" : "Buat Appointment Baru"}</DialogTitle>
        <DialogContent>
          <Box display='flex' flexDirection='column' gap={3} pt={2}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Customer</InputLabel>
                  <Select
                    value={formData.customerId}
                    onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                    label='Customer'
                  >
                    <MenuItem value='1'>Sarah Johnson</MenuItem>
                    <MenuItem value='2'>Michael Chen</MenuItem>
                    <MenuItem value='3'>Lisa Anderson</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Therapist</InputLabel>
                  <Select
                    value={formData.employeeId}
                    onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                    label='Therapist'
                  >
                    <MenuItem value='1'>Sari Dewi</MenuItem>
                    <MenuItem value='2'>Made Wirawan</MenuItem>
                    <MenuItem value='3'>Kadek Ayu</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <FormControl fullWidth required>
              <InputLabel>Layanan</InputLabel>
              <Select
                multiple
                value={formData.serviceIds}
                onChange={(e) => setFormData({ ...formData, serviceIds: e.target.value as string[] })}
                label='Layanan'
              >
                <MenuItem value='1'>Balinese Massage</MenuItem>
                <MenuItem value='2'>Deep Tissue Massage</MenuItem>
                <MenuItem value='3'>Hydrating Facial</MenuItem>
                <MenuItem value='4'>Anti-Aging Facial</MenuItem>
              </Select>
            </FormControl>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <TextField
                  label='Tanggal'
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  fullWidth
                  required
                  type='date'
                  InputLabelProps={{
                    shrink: true
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label='Jam Mulai'
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  fullWidth
                  required
                  type='time'
                  InputLabelProps={{
                    shrink: true
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label='Jam Selesai'
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  fullWidth
                  required
                  type='time'
                  InputLabelProps={{
                    shrink: true
                  }}
                />
              </Grid>
            </Grid>

            <TextField
              label='Catatan'
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              fullWidth
              multiline
              rows={3}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Batal</Button>
          <Button
            onClick={handleSubmit}
            variant='contained'
            disabled={
              !formData.customerId ||
              !formData.employeeId ||
              !formData.serviceIds.length ||
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
