"use client";
import { useEffect, useState, useCallback } from "react";

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
  Skeleton,
  Pagination,
  Switch,
  FormControlLabel
} from "@mui/material";
import { Add, Edit, Delete, Person, Phone, Email, Search, Refresh, Work, AttachMoney } from "@mui/icons-material";

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
  createdAt: string;
  updatedAt: string;
  _count?: {
    appointments: number;
  };
}

const positions = [
  { value: "therapist", label: "Therapist" },
  { value: "receptionist", label: "Receptionist" },
  { value: "manager", label: "Manager" },
  { value: "supervisor", label: "Supervisor" },
  { value: "trainee", label: "Trainee" }
];

export default function EmployeePage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [filterPosition, setFilterPosition] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    position: "",
    salary: "",
    isActive: true,
    hireDate: ""
  });

  const fetchEmployees = useCallback(async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10"
      });

      if (searchTerm) {
        params.append("search", searchTerm);
      }

      if (filterPosition) {
        params.append("position", filterPosition);
      }

      const response = await fetch(`/api/employee?${params}`);
      const result = await response.json();

      if (result.success) {
        setEmployees(result.data);
        setTotal(result.total);
        setTotalPages(result.totalPages);
      } else {
        setEmployees([]);
        setTotal(0);
        setTotalPages(1);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching employees:", error);
      setEmployees([]);
      setLoading(false);
    }
  }, [page, searchTerm, filterPosition]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const handleOpenDialog = (employee?: Employee) => {
    if (employee) {
      setEditingEmployee(employee);
      setFormData({
        name: employee.name,
        email: employee.email,
        phone: employee.phone || "",
        position: employee.position,
        salary: employee.salary.toString(),
        isActive: employee.isActive,
        hireDate: employee.hireDate ? employee.hireDate.split("T")[0] : ""
      });
    } else {
      setEditingEmployee(null);
      setFormData({
        name: "",
        email: "",
        phone: "",
        position: "",
        salary: "",
        isActive: true,
        hireDate: new Date().toISOString().split("T")[0]
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
      isActive: true,
      hireDate: ""
    });
  };

  const handleSubmit = async () => {
    try {
      const employeeData = {
        name: formData.name,
        email: formData.email,
        position: formData.position,
        salary: parseFloat(formData.salary),
        isActive: formData.isActive,
        ...(formData.phone && { phone: formData.phone }),
        ...(formData.hireDate && { hireDate: formData.hireDate })
      };

      let response;

      if (editingEmployee) {
        // Update existing employee
        response = await fetch(`/api/employee/${editingEmployee.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(employeeData)
        });
      } else {
        // Create new employee
        response = await fetch("/api/employee", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(employeeData)
        });
      }

      const result = await response.json();

      if (result.success) {
        handleCloseDialog();
        await fetchEmployees();

        // Show success message
        await Swal.fire({
          title: "Berhasil!",
          text: editingEmployee ? "Employee berhasil diupdate" : "Employee berhasil dibuat",
          icon: "success",
          timer: 2000,
          showConfirmButton: false
        });
      } else {
        throw new Error(result.message || "Failed to save employee");
      }
    } catch (error) {
      console.error("Error saving employee:", error);

      // Show error message
      await Swal.fire({
        title: "Error!",
        text: "Terjadi kesalahan saat menyimpan employee",
        icon: "error"
      });
    }
  };

  const handleDelete = async (employee: Employee) => {
    const result = await Swal.fire(confirmDialog.delete(`employee "${employee.name}"`));

    if (result.isConfirmed) {
      try {
        const response = await fetch(`/api/employee/${employee.id}`, {
          method: "DELETE"
        });

        const deleteResult = await response.json();

        if (deleteResult.success) {
          await fetchEmployees();
          Swal.fire(successAlert.timer("Employee berhasil dihapus!"));
        } else {
          throw new Error(deleteResult.message || "Failed to delete employee");
        }
      } catch (error) {
        console.error("Error deleting employee:", error);
        Swal.fire(errorAlert.network());
      }
    }
  };

  const handleSearch = () => {
    setPage(1);
    fetchEmployees();
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID");
  };

  const getPositionLabel = (position: string) => {
    return positions.find((p) => p.value === position)?.label || position;
  };

  const activeEmployees = employees.filter((emp) => emp.isActive).length;

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

      {/* Search and Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems='center'>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label='Cari karyawan...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                InputProps={{
                  startAdornment: <Search sx={{ mr: 1, color: "text.secondary" }} />
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Filter Posisi</InputLabel>
                <Select
                  value={filterPosition}
                  onChange={(e) => setFilterPosition(e.target.value)}
                  label='Filter Posisi'
                >
                  <MenuItem value=''>Semua</MenuItem>
                  {positions.map((position) => (
                    <MenuItem key={position.value} value={position.value}>
                      {position.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={5}>
              <Box display='flex' gap={1}>
                <Button variant='outlined' startIcon={<Search />} onClick={handleSearch}>
                  Cari
                </Button>
                <Button variant='outlined' startIcon={<Refresh />} onClick={fetchEmployees}>
                  Refresh
                </Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant='h6' color='primary'>
                Total Karyawan
              </Typography>
              <Typography variant='h4'>{total}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant='h6' color='success.main'>
                Aktif
              </Typography>
              <Typography variant='h4'>{activeEmployees}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Employee Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Karyawan</TableCell>
              <TableCell>Kontak</TableCell>
              <TableCell>Posisi</TableCell>
              <TableCell>Gaji</TableCell>
              <TableCell>Komisi</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Bergabung</TableCell>
              <TableCell align='center'>Aksi</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              [...Array(5)].map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Box display='flex' alignItems='center' gap={2}>
                      <Skeleton variant='circular' width={40} height={40} />
                      <Skeleton width={120} />
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Skeleton width={150} />
                  </TableCell>
                  <TableCell>
                    <Skeleton width={100} />
                  </TableCell>
                  <TableCell>
                    <Skeleton width={120} />
                  </TableCell>
                  <TableCell>
                    <Skeleton width={80} />
                  </TableCell>
                  <TableCell>
                    <Skeleton width={60} />
                  </TableCell>
                  <TableCell>
                    <Skeleton width={100} />
                  </TableCell>
                  <TableCell>
                    <Skeleton width={100} />
                  </TableCell>
                </TableRow>
              ))
            ) : employees.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align='center'>
                  <Typography variant='body2' color='textSecondary'>
                    Tidak ada data karyawan
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              employees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell>
                    <Box display='flex' alignItems='center' gap={2}>
                      <Avatar>
                        <Person />
                      </Avatar>
                      <Box>
                        <Typography variant='subtitle2'>{employee.name}</Typography>
                        <Typography variant='body2' color='textSecondary'>
                          ID: {employee.id}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Box display='flex' alignItems='center' gap={1}>
                        <Email fontSize='small' />
                        <Typography variant='body2'>{employee.email}</Typography>
                      </Box>
                      {employee.phone && (
                        <Box display='flex' alignItems='center' gap={1}>
                          <Phone fontSize='small' />
                          <Typography variant='body2'>{employee.phone}</Typography>
                        </Box>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={getPositionLabel(employee.position)}
                      color='primary'
                      size='small'
                      variant='outlined'
                      icon={<Work />}
                    />
                  </TableCell>
                  <TableCell>
                    <Box display='flex' alignItems='center' gap={1}>
                      <AttachMoney fontSize='small' />
                      <Typography variant='body2'>{formatCurrency(employee.salary)}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={employee.isActive ? "Aktif" : "Tidak Aktif"}
                      color={employee.isActive ? "success" : "default"}
                      size='small'
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant='body2'>{formatDate(employee.hireDate)}</Typography>
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
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      {totalPages > 1 && (
        <Box display='flex' justifyContent='center' mt={3}>
          <Pagination count={totalPages} page={page} onChange={handlePageChange} color='primary' />
        </Box>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth='md' fullWidth>
        <DialogTitle>{editingEmployee ? "Edit Karyawan" : "Tambah Karyawan Baru"}</DialogTitle>
        <DialogContent>
          <Box display='flex' flexDirection='column' gap={3} pt={2}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label='Nama Lengkap'
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label='Email'
                  type='email'
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  fullWidth
                  required
                />
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label='Nomor Telepon'
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Posisi</InputLabel>
                  <Select
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    label='Posisi'
                  >
                    {positions.map((position) => (
                      <MenuItem key={position.value} value={position.value}>
                        {position.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label='Gaji Pokok'
                  type='number'
                  value={formData.salary}
                  onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                  fullWidth
                  required
                  InputProps={{
                    startAdornment: <Typography variant='body2'>Rp</Typography>
                  }}
                />
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label='Tanggal Bergabung'
                  type='date'
                  value={formData.hireDate}
                  onChange={(e) => setFormData({ ...formData, hireDate: e.target.value })}
                  fullWidth
                  InputLabelProps={{
                    shrink: true
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    />
                  }
                  label='Status Aktif'
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
