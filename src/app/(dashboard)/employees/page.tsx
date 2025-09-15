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
  InputAdornment,
  Switch,
  FormControlLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar
} from "@mui/material";
import { Add, Edit, Delete, Person, Email, Phone } from "@mui/icons-material";

import { confirmDialog, successAlert, errorAlert } from "@/utils/sweetAlert";

interface Employee {
  id: number;
  name: string;
  email: string;
  phone?: string;
  position: string;
  salary: number;
  commission?: number;
  avatar?: string;
  isActive: boolean;
  hireDate: string;
}

export default function KaryawanPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    position: "",
    salary: "",
    commission: ""
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      // TODO: Implement API call to fetch employees
      // For now, using mock data
      setEmployees([
        {
          id: 1,
          name: "Sari Dewi",
          email: "sari.dewi@kalimasada.com",
          phone: "+62812345678901",
          position: "Senior Therapist",
          salary: 4500000,
          commission: 10,
          isActive: true,
          hireDate: "2023-01-15"
        },
        {
          id: 2,
          name: "Made Wirawan",
          email: "made.wirawan@kalimasada.com",
          phone: "+62812345678902",
          position: "Massage Therapist",
          salary: 3500000,
          commission: 8,
          isActive: true,
          hireDate: "2023-03-20"
        },
        {
          id: 3,
          name: "Kadek Ayu",
          email: "kadek.ayu@kalimasada.com",
          phone: "+62812345678903",
          position: "Facial Specialist",
          salary: 4000000,
          commission: 12,
          isActive: true,
          hireDate: "2023-02-10"
        }
      ]);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching employees:", error);
      setLoading(false);
    }
  };

  const handleOpenDialog = (employee?: Employee) => {
    if (employee) {
      setEditingEmployee(employee);
      setFormData({
        name: employee.name,
        email: employee.email,
        phone: employee.phone || "",
        position: employee.position,
        salary: employee.salary.toString(),
        commission: employee.commission?.toString() || ""
      });
    } else {
      setEditingEmployee(null);
      setFormData({
        name: "",
        email: "",
        phone: "",
        position: "",
        salary: "",
        commission: ""
      });
    }

    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingEmployee(null);
    setFormData({
      name: "",
      email: "",
      phone: "",
      position: "",
      salary: "",
      commission: ""
    });
  };

  const handleSubmit = async () => {
    try {
      // TODO: Implement API call to save employee
      console.log("Saving employee:", formData);
      await fetchEmployees();
      handleCloseDialog();

      // TODO: Show success toast
    } catch (error) {
      console.error("Error saving employee:", error);

      // TODO: Show error toast
    }
  };

  const handleToggleActive = async (employee: Employee) => {
    try {
      // TODO: Implement API call to toggle employee status
      console.log("Toggling employee status:", employee.id);
      await fetchEmployees();

      // TODO: Show success toast
    } catch (error) {
      console.error("Error toggling employee status:", error);
    }
  };

  const handleDelete = async (employee: Employee) => {
    const result = await Swal.fire(confirmDialog.delete(`karyawan "${employee.name}"`));

    if (result.isConfirmed) {
      try {
        // TODO: Implement API call to delete employee
        console.log("Deleting employee:", employee.id);
        await fetchEmployees();

        Swal.fire(successAlert.timer("Karyawan berhasil dihapus!"));
      } catch (error) {
        console.error("Error deleting employee:", error);
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

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric"
    }).format(new Date(dateString));
  };

  const getPositionColor = (position: string) => {
    const colors: { [key: string]: any } = {
      "Senior Therapist": "primary",
      "Massage Therapist": "secondary",
      "Facial Specialist": "success",
      Receptionist: "warning",
      "Nail Technician": "info",
      Manager: "error"
    };

    return colors[position] || "default";
  };

  if (loading) {
    return (
      <Box display='flex' justifyContent='center' alignItems='center' minHeight='400px'>
        <Typography>Loading karyawan...</Typography>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Box display='flex' justifyContent='space-between' alignItems='center' mb={3}>
        <Typography variant='h4' component='h1'>
          Manajemen Karyawan
        </Typography>
        <Button variant='contained' startIcon={<Add />} onClick={() => handleOpenDialog()}>
          Tambah Karyawan
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Karyawan</TableCell>
              <TableCell>Posisi</TableCell>
              <TableCell>Gaji Pokok</TableCell>
              <TableCell>Komisi</TableCell>
              <TableCell>Tanggal Masuk</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align='center'>Aksi</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {employees.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell>
                  <Box display='flex' alignItems='center' gap={2}>
                    <Avatar>
                      <Person />
                    </Avatar>
                    <Box>
                      <Typography variant='subtitle2'>{employee.name}</Typography>
                      <Typography variant='body2' color='textSecondary'>
                        <Email fontSize='small' /> {employee.email}
                      </Typography>
                      {employee.phone && (
                        <Typography variant='body2' color='textSecondary'>
                          <Phone fontSize='small' /> {employee.phone}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip label={employee.position} color={getPositionColor(employee.position)} size='small' />
                </TableCell>
                <TableCell>
                  <Typography variant='subtitle2'>{formatCurrency(employee.salary)}</Typography>
                </TableCell>
                <TableCell>{employee.commission ? `${employee.commission}%` : "-"}</TableCell>
                <TableCell>{formatDate(employee.hireDate)}</TableCell>
                <TableCell>
                  <FormControlLabel
                    control={
                      <Switch checked={employee.isActive} onChange={() => handleToggleActive(employee)} size='small' />
                    }
                    label={employee.isActive ? "Aktif" : "Nonaktif"}
                  />
                </TableCell>
                <TableCell align='center'>
                  <IconButton size='small' onClick={() => handleOpenDialog(employee)}>
                    <Edit />
                  </IconButton>
                  <IconButton size='small' color='error' onClick={() => handleDelete(employee)}>
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
        <DialogTitle>{editingEmployee ? "Edit Karyawan" : "Tambah Karyawan Baru"}</DialogTitle>
        <DialogContent>
          <Box display='flex' flexDirection='column' gap={3} pt={2}>
            <TextField
              label='Nama Lengkap'
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              fullWidth
              required
            />

            <TextField
              label='Email'
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              fullWidth
              required
              type='email'
            />

            <TextField
              label='Nomor Telepon'
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              fullWidth
            />

            <TextField
              label='Posisi'
              value={formData.position}
              onChange={(e) => setFormData({ ...formData, position: e.target.value })}
              fullWidth
              required
            />

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label='Gaji Pokok'
                  value={formData.salary}
                  onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                  fullWidth
                  required
                  type='number'
                  InputProps={{
                    startAdornment: <InputAdornment position='start'>Rp</InputAdornment>
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label='Komisi'
                  value={formData.commission}
                  onChange={(e) => setFormData({ ...formData, commission: e.target.value })}
                  fullWidth
                  type='number'
                  InputProps={{
                    endAdornment: <InputAdornment position='end'>%</InputAdornment>
                  }}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Batal</Button>
          <Button
            onClick={handleSubmit}
            variant='contained'
            disabled={!formData.name || !formData.email || !formData.position || !formData.salary}
          >
            {editingEmployee ? "Update" : "Simpan"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
