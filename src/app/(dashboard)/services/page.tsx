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
  InputAdornment,
  Switch,
  FormControlLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from "@mui/material";
import { Add, Edit, Delete, Visibility, VisibilityOff } from "@mui/icons-material";

import { confirmDialog, successAlert, errorAlert } from "@/utils/sweetAlert";

interface Service {
  id: number;
  name: string;
  description?: string;
  price: number;
  duration: number;
  category: string;
  isActive: boolean;
}

const serviceCategories = [
  { value: "FACIAL", label: "Facial" },
  { value: "MASSAGE", label: "Massage" },
  { value: "BODY_TREATMENT", label: "Body Treatment" },
  { value: "HAIR_TREATMENT", label: "Hair Treatment" },
  { value: "NAIL_CARE", label: "Nail Care" },
  { value: "MAKEUP", label: "Makeup" },
  { value: "WAXING", label: "Waxing" },
  { value: "OTHER", label: "Lainnya" }
];

export default function LayananPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    duration: "",
    category: ""
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await fetch("/api/services");
      const result = await response.json();

      if (response.ok) {
        setServices(result.data);
      } else {
        console.error("Error fetching services:", result.message);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching services:", error);
      setLoading(false);
    }
  };

  const handleOpenDialog = (service?: Service) => {
    if (service) {
      setEditingService(service);
      setFormData({
        name: service.name,
        description: service.description || "",
        price: service.price.toString(),
        duration: service.duration.toString(),
        category: service.category
      });
    } else {
      setEditingService(null);
      setFormData({
        name: "",
        description: "",
        price: "",
        duration: "",
        category: ""
      });
    }

    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingService(null);
    setFormData({
      name: "",
      description: "",
      price: "",
      duration: "",
      category: ""
    });
  };

  const handleSubmit = async () => {
    try {
      const url = editingService ? `/api/services/${editingService.id}` : "/api/services";
      const method = editingService ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description || undefined,
          price: parseFloat(formData.price),
          duration: parseInt(formData.duration),
          category: formData.category
        })
      });

      const result = await response.json();

      if (response.ok) {
        await fetchServices();
        handleCloseDialog();

        // TODO: Show success toast
      } else {
        console.error("Error saving service:", result.message);

        // TODO: Show error toast
      }
    } catch (error) {
      console.error("Error saving service:", error);

      // TODO: Show error toast
    }
  };

  const handleToggleActive = async (service: Service) => {
    try {
      const response = await fetch(`/api/services/${service.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          isActive: !service.isActive
        })
      });

      if (response.ok) {
        await fetchServices();

        // TODO: Show success toast
      } else {
        console.error("Error toggling service status");

        // TODO: Show error toast
      }
    } catch (error) {
      console.error("Error toggling service status:", error);
    }
  };

  const handleDelete = async (service: Service) => {
    const result = await Swal.fire(confirmDialog.delete(`layanan "${service.name}"`));

    if (result.isConfirmed) {
      try {
        const response = await fetch(`/api/services/${service.id}`, {
          method: "DELETE"
        });

        if (response.ok) {
          await fetchServices();

          Swal.fire(successAlert.timer("Layanan berhasil dihapus!"));
        } else {
          console.error("Error deleting service");
          Swal.fire(errorAlert.simple("Terjadi kesalahan saat menghapus layanan"));
        }
      } catch (error) {
        console.error("Error deleting service:", error);
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

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (hours > 0) {
      return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    }

    return `${mins}m`;
  };

  const getCategoryLabel = (category: string) => {
    const found = serviceCategories.find((cat) => cat.value === category);

    return found ? found.label : category;
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: any } = {
      FACIAL: "primary",
      MASSAGE: "secondary",
      BODY_TREATMENT: "success",
      HAIR_TREATMENT: "warning",
      NAIL_CARE: "info",
      MAKEUP: "error",
      WAXING: "default",
      OTHER: "default"
    };

    return colors[category] || "default";
  };

  if (loading) {
    return (
      <Box display='flex' justifyContent='center' alignItems='center' minHeight='400px'>
        <Typography>Loading layanan...</Typography>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Box display='flex' justifyContent='space-between' alignItems='center' mb={3}>
        <Typography variant='h4' component='h1'>
          Manajemen Layanan
        </Typography>
        <Button variant='contained' startIcon={<Add />} onClick={() => handleOpenDialog()}>
          Tambah Layanan
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nama Layanan</TableCell>
              <TableCell>Kategori</TableCell>
              <TableCell>Harga</TableCell>
              <TableCell>Durasi</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align='center'>Aksi</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {services.map((service) => (
              <TableRow key={service.id}>
                <TableCell>
                  <Box>
                    <Typography variant='subtitle2'>{service.name}</Typography>
                    {service.description && (
                      <Typography variant='body2' color='textSecondary'>
                        {service.description}
                      </Typography>
                    )}
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label={getCategoryLabel(service.category)}
                    color={getCategoryColor(service.category)}
                    size='small'
                  />
                </TableCell>
                <TableCell>
                  <Typography variant='subtitle2'>{formatCurrency(service.price)}</Typography>
                </TableCell>
                <TableCell>{formatDuration(service.duration)}</TableCell>
                <TableCell>
                  <FormControlLabel
                    control={
                      <Switch checked={service.isActive} onChange={() => handleToggleActive(service)} size='small' />
                    }
                    label={service.isActive ? "Aktif" : "Nonaktif"}
                  />
                </TableCell>
                <TableCell align='center'>
                  <IconButton size='small' onClick={() => handleOpenDialog(service)}>
                    <Edit />
                  </IconButton>
                  <IconButton size='small' color='error' onClick={() => handleDelete(service)}>
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
        <DialogTitle>{editingService ? "Edit Layanan" : "Tambah Layanan Baru"}</DialogTitle>
        <DialogContent>
          <Box display='flex' flexDirection='column' gap={3} pt={2}>
            <TextField
              label='Nama Layanan'
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              fullWidth
              required
            />

            <TextField
              label='Deskripsi'
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              fullWidth
              multiline
              rows={3}
            />

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label='Harga'
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
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
                  label='Durasi (menit)'
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  fullWidth
                  required
                  type='number'
                  InputProps={{
                    endAdornment: <InputAdornment position='end'>menit</InputAdornment>
                  }}
                />
              </Grid>
            </Grid>

            <FormControl fullWidth required>
              <InputLabel>Kategori</InputLabel>
              <Select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                label='Kategori'
              >
                {serviceCategories.map((category) => (
                  <MenuItem key={category.value} value={category.value}>
                    {category.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Batal</Button>
          <Button
            onClick={handleSubmit}
            variant='contained'
            disabled={!formData.name || !formData.price || !formData.duration || !formData.category}
          >
            {editingService ? "Update" : "Simpan"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
