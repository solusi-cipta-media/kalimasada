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
  Pagination
} from "@mui/material";
import { Add, Edit, Delete, Person, Phone, Email, Search, Refresh } from "@mui/icons-material";

import { confirmDialog, successAlert, errorAlert } from "@/utils/sweetAlert";

interface Customer {
  id: number;
  name: string;
  email?: string;
  phone: string;
  address?: string;
  birthDate?: string;
  gender?: "MALE" | "FEMALE";
  notes?: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    appointments: number;
  };
}

export default function CustomerPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    birthDate: "",
    gender: "",
    notes: ""
  });

  const fetchCustomers = useCallback(async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10"
      });

      if (searchTerm) {
        params.append("search", searchTerm);
      }

      const response = await fetch(`/api/customer?${params}`);
      const result = await response.json();

      if (result.success) {
        setCustomers(result.data);
        setTotal(result.total);
        setTotalPages(result.totalPages);
      } else {
        setCustomers([]);
        setTotal(0);
        setTotalPages(1);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching customers:", error);
      setCustomers([]);
      setLoading(false);
    }
  }, [page, searchTerm]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const handleOpenDialog = (customer?: Customer) => {
    if (customer) {
      setEditingCustomer(customer);
      setFormData({
        name: customer.name,
        email: customer.email || "",
        phone: customer.phone,
        address: customer.address || "",
        birthDate: customer.birthDate ? customer.birthDate.split("T")[0] : "",
        gender: customer.gender || "",
        notes: customer.notes || ""
      });
    } else {
      setEditingCustomer(null);
      setFormData({
        name: "",
        email: "",
        phone: "",
        address: "",
        birthDate: "",
        gender: "",
        notes: ""
      });
    }

    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingCustomer(null);
    setFormData({
      name: "",
      email: "",
      phone: "",
      address: "",
      birthDate: "",
      gender: "",
      notes: ""
    });
  };

  const handleSubmit = async () => {
    try {
      const customerData = {
        name: formData.name,
        phone: formData.phone,
        ...(formData.email && { email: formData.email }),
        ...(formData.address && { address: formData.address }),
        ...(formData.birthDate && { birthDate: formData.birthDate }),
        ...(formData.gender && { gender: formData.gender }),
        ...(formData.notes && { notes: formData.notes })
      };

      let response;

      if (editingCustomer) {
        // Update existing customer
        response = await fetch(`/api/customer/${editingCustomer.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(customerData)
        });
      } else {
        // Create new customer
        response = await fetch("/api/customer", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(customerData)
        });
      }

      const result = await response.json();

      if (result.success) {
        handleCloseDialog();
        await fetchCustomers();

        // Show success message
        await Swal.fire({
          title: "Berhasil!",
          text: editingCustomer ? "Customer berhasil diupdate" : "Customer berhasil dibuat",
          icon: "success",
          timer: 2000,
          showConfirmButton: false
        });
      } else {
        throw new Error(result.message || "Failed to save customer");
      }
    } catch (error) {
      console.error("Error saving customer:", error);

      // Show error message
      await Swal.fire({
        title: "Error!",
        text: "Terjadi kesalahan saat menyimpan customer",
        icon: "error"
      });
    }
  };

  const handleDelete = async (customer: Customer) => {
    const result = await Swal.fire(confirmDialog.delete(`customer "${customer.name}"`));

    if (result.isConfirmed) {
      try {
        const response = await fetch(`/api/customer/${customer.id}`, {
          method: "DELETE"
        });

        const deleteResult = await response.json();

        if (deleteResult.success) {
          await fetchCustomers();
          Swal.fire(successAlert.timer("Customer berhasil dihapus!"));
        } else {
          throw new Error(deleteResult.message || "Failed to delete customer");
        }
      } catch (error) {
        console.error("Error deleting customer:", error);
        Swal.fire(errorAlert.network());
      }
    }
  };

  const handleSearch = () => {
    setPage(1);
    fetchCustomers();
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID");
  };

  const getGenderLabel = (gender?: string) => {
    switch (gender) {
      case "MALE":
        return "Laki-laki";
      case "FEMALE":
        return "Perempuan";
      default:
        return "-";
    }
  };

  return (
    <Box p={3}>
      <Box display='flex' justifyContent='space-between' alignItems='center' mb={3}>
        <Typography variant='h4' component='h1'>
          Manajemen Customer
        </Typography>
        <Button variant='contained' startIcon={<Add />} onClick={() => handleOpenDialog()}>
          Tambah Customer
        </Button>
      </Box>

      {/* Search and Actions */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems='center'>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label='Cari customer...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                InputProps={{
                  startAdornment: <Search sx={{ mr: 1, color: "text.secondary" }} />
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Box display='flex' gap={1}>
                <Button variant='outlined' startIcon={<Search />} onClick={handleSearch}>
                  Cari
                </Button>
                <Button variant='outlined' startIcon={<Refresh />} onClick={fetchCustomers}>
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
                Total Customer
              </Typography>
              <Typography variant='h4'>{total}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Customer Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Customer</TableCell>
              <TableCell>Kontak</TableCell>
              <TableCell>Gender</TableCell>
              <TableCell>Tanggal Lahir</TableCell>
              <TableCell>Total Appointment</TableCell>
              <TableCell>Terdaftar</TableCell>
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
                    <Skeleton width={80} />
                  </TableCell>
                  <TableCell>
                    <Skeleton width={100} />
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
            ) : customers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align='center'>
                  <Typography variant='body2' color='textSecondary'>
                    Tidak ada data customer
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              customers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>
                    <Box display='flex' alignItems='center' gap={2}>
                      <Avatar>
                        <Person />
                      </Avatar>
                      <Box>
                        <Typography variant='subtitle2'>{customer.name}</Typography>
                        {customer.address && (
                          <Typography variant='body2' color='textSecondary'>
                            {customer.address}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Box display='flex' alignItems='center' gap={1}>
                        <Phone fontSize='small' />
                        <Typography variant='body2'>{customer.phone}</Typography>
                      </Box>
                      {customer.email && (
                        <Box display='flex' alignItems='center' gap={1}>
                          <Email fontSize='small' />
                          <Typography variant='body2'>{customer.email}</Typography>
                        </Box>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant='body2'>{getGenderLabel(customer.gender)}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant='body2'>{customer.birthDate ? formatDate(customer.birthDate) : "-"}</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip label={customer._count?.appointments || 0} color='primary' size='small' variant='outlined' />
                  </TableCell>
                  <TableCell>
                    <Typography variant='body2'>{formatDate(customer.createdAt)}</Typography>
                  </TableCell>
                  <TableCell align='center'>
                    <IconButton size='small' onClick={() => handleOpenDialog(customer)}>
                      <Edit />
                    </IconButton>
                    <IconButton size='small' color='error' onClick={() => handleDelete(customer)}>
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
        <DialogTitle>{editingCustomer ? "Edit Customer" : "Tambah Customer Baru"}</DialogTitle>
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
                  label='Nomor Telepon'
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  fullWidth
                  required
                />
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label='Email'
                  type='email'
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Gender</InputLabel>
                  <Select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    label='Gender'
                  >
                    <MenuItem value=''>-</MenuItem>
                    <MenuItem value='MALE'>Laki-laki</MenuItem>
                    <MenuItem value='FEMALE'>Perempuan</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label='Tanggal Lahir'
                  type='date'
                  value={formData.birthDate}
                  onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                  fullWidth
                  InputLabelProps={{
                    shrink: true
                  }}
                />
              </Grid>
            </Grid>

            <TextField
              label='Alamat'
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              fullWidth
              multiline
              rows={2}
            />

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
          <Button onClick={handleSubmit} variant='contained' disabled={!formData.name || !formData.phone}>
            {editingCustomer ? "Update" : "Simpan"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
