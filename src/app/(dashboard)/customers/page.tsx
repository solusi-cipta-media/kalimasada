"use client";
import { useEffect, useState } from "react";

import Swal from "sweetalert2";
import axios from "axios";

import {
  Box,
  Typography,
  Button,
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
  Avatar
} from "@mui/material";
import { Add, Edit, Delete, Person, Email, Phone, LocationOn } from "@mui/icons-material";

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
  totalVisits: number;
  lastVisit?: string;
}

export default function CustomerPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    gender: "",
    notes: ""
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/customer");

      setCustomers(response.data.data || []);
    } catch (error) {
      console.error("Error fetching customers:", error);
      Swal.fire(errorAlert.network());
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (customer?: Customer) => {
    if (customer) {
      setEditingCustomer(customer);
      setFormData({
        name: customer.name,
        email: customer.email || "",
        phone: customer.phone,
        address: customer.address || "",
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
      gender: "",
      notes: ""
    });
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);

      const customerData = {
        name: formData.name,
        email: formData.email || null,
        phone: formData.phone,
        address: formData.address || null,
        gender: formData.gender || null,
        notes: formData.notes || null
      };

      if (editingCustomer) {
        await axios.put(`/api/customer/${editingCustomer.id}`, customerData);
        Swal.fire(successAlert.timer("Customer berhasil diperbarui!"));
      } else {
        await axios.post("/api/customer", customerData);
        Swal.fire(successAlert.timer("Customer berhasil ditambahkan!"));
      }

      await fetchCustomers();
      handleCloseDialog();
    } catch (error) {
      console.error("Error saving customer:", error);
      Swal.fire(errorAlert.network());
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (customer: Customer) => {
    const result = await Swal.fire(confirmDialog.delete(`customer "${customer.name}"`));

    if (result.isConfirmed) {
      try {
        await axios.delete(`/api/customer/${customer.id}`);
        await fetchCustomers();
        Swal.fire(successAlert.timer("Customer berhasil dihapus!"));
      } catch (error) {
        console.error("Error deleting customer:", error);
        Swal.fire(errorAlert.network());
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric"
    }).format(new Date(dateString));
  };

  const getGenderColor = (gender: string) => {
    return gender === "FEMALE" ? "secondary" : "primary";
  };

  const getGenderLabel = (gender: string) => {
    return gender === "FEMALE" ? "Perempuan" : "Laki-laki";
  };

  if (loading) {
    return (
      <Box display='flex' justifyContent='center' alignItems='center' minHeight='400px'>
        <Typography>Loading customer...</Typography>
      </Box>
    );
  }

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

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Customer</TableCell>
              <TableCell>Kontak</TableCell>
              <TableCell>Alamat</TableCell>
              <TableCell>Gender</TableCell>
              <TableCell>Total Kunjungan</TableCell>
              <TableCell>Kunjungan Terakhir</TableCell>
              <TableCell align='center'>Aksi</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {customers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell>
                  <Box display='flex' alignItems='center' gap={2}>
                    <Avatar>
                      <Person />
                    </Avatar>
                    <Box>
                      <Typography variant='subtitle2'>{customer.name}</Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box>
                    {customer.email && (
                      <Typography variant='body2' color='textSecondary'>
                        <Email fontSize='small' /> {customer.email}
                      </Typography>
                    )}
                    <Typography variant='body2' color='textSecondary'>
                      <Phone fontSize='small' /> {customer.phone}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  {customer.address && (
                    <Typography variant='body2' color='textSecondary'>
                      <LocationOn fontSize='small' /> {customer.address}
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  <Box>
                    {customer.gender && (
                      <Chip
                        label={getGenderLabel(customer.gender)}
                        color={getGenderColor(customer.gender)}
                        size='small'
                      />
                    )}
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip label={`${customer.totalVisits} kali`} color='info' size='small' />
                </TableCell>
                <TableCell>{customer.lastVisit ? formatDate(customer.lastVisit) : "-"}</TableCell>
                <TableCell align='center'>
                  <IconButton size='small' onClick={() => handleOpenDialog(customer)}>
                    <Edit />
                  </IconButton>
                  <IconButton size='small' color='error' onClick={() => handleDelete(customer)}>
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
        <DialogTitle>{editingCustomer ? "Edit Customer" : "Tambah Customer Baru"}</DialogTitle>
        <DialogContent>
          <Box display='flex' flexDirection='column' gap={3} pt={2}>
            <TextField
              label='Nama Lengkap'
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              fullWidth
              required
            />

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label='Email'
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  fullWidth
                  type='email'
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

            <TextField
              label='Alamat'
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              fullWidth
              multiline
              rows={2}
            />

            <FormControl fullWidth>
              <InputLabel>Gender</InputLabel>
              <Select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                label='Gender'
              >
                <MenuItem value='MALE'>Laki-laki</MenuItem>
                <MenuItem value='FEMALE'>Perempuan</MenuItem>
              </Select>
            </FormControl>

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
          <Button onClick={handleSubmit} variant='contained' disabled={!formData.name || !formData.phone || submitting}>
            {submitting ? "Menyimpan..." : editingCustomer ? "Update" : "Simpan"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
