"use client";
import { useEffect, useState } from "react";
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
  Avatar
} from "@mui/material";
import { Add, Edit, Delete, Person, Email, Phone, LocationOn, Cake } from "@mui/icons-material";

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
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    birthDate: "",
    gender: "",
    notes: ""
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      // TODO: Implement API call to fetch customers
      // For now, using mock data
      setCustomers([
        {
          id: 1,
          name: "Sarah Johnson",
          email: "sarah.johnson@email.com",
          phone: "+62812345671001",
          address: "Jl. Sunset Road No. 123, Seminyak",
          birthDate: "1985-06-15",
          gender: "FEMALE",
          totalVisits: 12,
          lastVisit: "2024-09-05"
        },
        {
          id: 2,
          name: "Michael Chen",
          email: "michael.chen@email.com",
          phone: "+62812345671002",
          address: "Jl. Monkey Forest Road No. 45, Ubud",
          birthDate: "1978-11-22",
          gender: "MALE",
          totalVisits: 8,
          lastVisit: "2024-09-03"
        },
        {
          id: 3,
          name: "Lisa Anderson",
          email: "lisa.anderson@email.com",
          phone: "+62812345671003",
          address: "Jl. Pantai Kuta No. 78, Kuta",
          birthDate: "1992-03-08",
          gender: "FEMALE",
          totalVisits: 15,
          lastVisit: "2024-09-08"
        }
      ]);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching customers:", error);
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
        birthDate: customer.birthDate || "",
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
      // TODO: Implement API call to save customer
      console.log("Saving customer:", formData);
      await fetchCustomers();
      handleCloseDialog();
      // TODO: Show success toast
    } catch (error) {
      console.error("Error saving customer:", error);
      // TODO: Show error toast
    }
  };

  const handleDelete = async (customer: Customer) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus customer "${customer.name}"?`)) {
      try {
        // TODO: Implement API call to delete customer
        console.log("Deleting customer:", customer.id);
        await fetchCustomers();
        // TODO: Show success toast
      } catch (error) {
        console.error("Error deleting customer:", error);
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

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }

    return age;
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
              <TableCell>Umur/Gender</TableCell>
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
                      {customer.birthDate && (
                        <Typography variant='body2' color='textSecondary'>
                          <Cake fontSize='small' /> {formatDate(customer.birthDate)}
                        </Typography>
                      )}
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
                    {customer.birthDate && (
                      <Typography variant='body2'>{calculateAge(customer.birthDate)} tahun</Typography>
                    )}
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

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label='Tanggal Lahir'
                  value={formData.birthDate}
                  onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                  fullWidth
                  type='date'
                  InputLabelProps={{
                    shrink: true
                  }}
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
                    <MenuItem value='MALE'>Laki-laki</MenuItem>
                    <MenuItem value='FEMALE'>Perempuan</MenuItem>
                  </Select>
                </FormControl>
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
          <Button onClick={handleSubmit} variant='contained' disabled={!formData.name || !formData.phone}>
            {editingCustomer ? "Update" : "Simpan"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
