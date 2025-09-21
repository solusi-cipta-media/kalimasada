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
  Avatar,
  CircularProgress,
  Autocomplete,
  FormControl,
  InputLabel,
  OutlinedInput
} from "@mui/material";
import { Add, Edit, Delete, Visibility, VisibilityOff, Person, Email, Phone } from "@mui/icons-material";

import { confirmDialog, successAlert, errorAlert } from "@/utils/sweetAlert";

interface Employee {
  id: number;
  name: string;
  email: string;
  phone?: string;
  position: string;
  salary: number;
  avatar?: string;
  isActive: boolean;
  hireDate: string;
}

export default function KaryawanPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [roles, setRoles] = useState<any[]>([]);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    position: "",
    salary: "",
    roleId: null as number | null,
    password: "",
    createUserAccount: true,
    userActive: true
  });

  useEffect(() => {
    fetchEmployees();
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const response = await fetch("/api/autocomplete/role");
      const result = await response.json();

      if (response.ok) {
        setRoles(result.data || []);
      } else {
        console.error("Error fetching roles:", result.message);
      }
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/employee");
      const result = await response.json();

      if (response.ok) {
        setEmployees(result.data || []);
      } else {
        console.error("Error fetching employees:", result.message);
        Swal.fire(errorAlert.simple(result.message || "Gagal memuat data karyawan"));
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
      Swal.fire(errorAlert.network());
    } finally {
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
        roleId: null, // Will be set from user data if exists
        password: "", // Password not shown when editing
        createUserAccount: false, // Editing mode
        userActive: true
      });
    } else {
      setEditingEmployee(null);
      setFormData({
        name: "",
        email: "",
        phone: "",
        position: "",
        salary: "",
        roleId: null,
        password: "",
        createUserAccount: true,
        userActive: true
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
      roleId: null,
      password: "",
      createUserAccount: true,
      userActive: true
    });
  };

  const handleSubmit = async () => {
    try {
      setSaving(true);

      const employeeData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        position: formData.position,
        salary: Number(formData.salary),
        isActive: true,

        // User creation data
        createUserAccount: formData.createUserAccount,
        roleId: formData.roleId,
        password: formData.password,
        userActive: formData.userActive
      };

      let response;
      let successMessage;

      if (editingEmployee) {
        // Update existing employee
        response = await fetch(`/api/employee/${editingEmployee.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(employeeData)
        });
        successMessage = "Karyawan berhasil diperbarui!";
      } else {
        // Create new employee
        response = await fetch("/api/employee", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(employeeData)
        });
        successMessage = "Karyawan berhasil ditambahkan!";
      }

      const result = await response.json();

      if (response.ok) {
        await fetchEmployees();
        handleCloseDialog();
        Swal.fire(successAlert.timer(successMessage));
      } else {
        Swal.fire(errorAlert.simple(result.message || "Terjadi kesalahan saat menyimpan data"));
      }
    } catch (error) {
      console.error("Error saving employee:", error);
      Swal.fire(errorAlert.network());
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (employee: Employee) => {
    try {
      const response = await fetch(`/api/employee/${employee.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: employee.name,
          email: employee.email,
          phone: employee.phone,
          position: employee.position,
          salary: employee.salary,
          isActive: !employee.isActive
        })
      });

      const result = await response.json();

      if (response.ok) {
        await fetchEmployees();
        const statusText = !employee.isActive ? "diaktifkan" : "dinonaktifkan";

        Swal.fire(successAlert.timer(`Karyawan berhasil ${statusText}!`));
      } else {
        Swal.fire(errorAlert.simple(result.message || "Terjadi kesalahan saat mengubah status"));
      }
    } catch (error) {
      console.error("Error toggling employee status:", error);
      Swal.fire(errorAlert.network());
    }
  };

  const handleDelete = async (employee: Employee) => {
    const result = await Swal.fire(confirmDialog.delete(`karyawan "${employee.name}"`));

    if (result.isConfirmed) {
      try {
        const response = await fetch(`/api/employee/${employee.id}`, {
          method: "DELETE"
        });

        const result = await response.json();

        if (response.ok) {
          await fetchEmployees();
          Swal.fire(successAlert.timer("Karyawan berhasil dihapus!"));
        } else {
          Swal.fire(errorAlert.simple(result.message || "Terjadi kesalahan saat menghapus data"));
        }
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
                <Autocomplete
                  options={roles}
                  getOptionLabel={(option) => option.label || option.name}
                  value={roles.find((role) => role.id === formData.roleId) || null}
                  onChange={(_, newValue) => setFormData({ ...formData, roleId: newValue?.id || null })}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label='Role Sistem'
                      required={formData.createUserAccount}
                      helperText='Role untuk akses sistem'
                    />
                  )}
                  fullWidth
                />
              </Grid>
            </Grid>

            {/* User Account Section */}
            <Box>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.createUserAccount}
                    onChange={(e) => setFormData({ ...formData, createUserAccount: e.target.checked })}
                  />
                }
                label='Buat Akun User Sistem'
              />
            </Box>

            {formData.createUserAccount && (
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required>
                    <InputLabel htmlFor='password-input'>Password</InputLabel>
                    <OutlinedInput
                      id='password-input'
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      endAdornment={
                        <InputAdornment position='end'>
                          <IconButton
                            aria-label='toggle password visibility'
                            onClick={() => setShowPassword(!showPassword)}
                            edge='end'
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      }
                      label='Password'
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.userActive}
                        onChange={(e) => setFormData({ ...formData, userActive: e.target.checked })}
                      />
                    }
                    label='User Aktif'
                  />
                </Grid>
              </Grid>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Batal</Button>
          <Button
            onClick={handleSubmit}
            variant='contained'
            disabled={
              saving ||
              !formData.name ||
              !formData.email ||
              !formData.position ||
              !formData.salary ||
              (formData.createUserAccount && (!formData.roleId || !formData.password))
            }
          >
            {saving ? <CircularProgress size={20} color='inherit' /> : editingEmployee ? "Update" : "Simpan"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
