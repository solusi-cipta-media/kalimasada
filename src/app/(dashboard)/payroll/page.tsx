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
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Tabs,
  Tab,
  Alert
} from "@mui/material";
import { Add, Edit, Delete, Person, AttachMoney, TrendingUp, Receipt, CheckCircle, Pending } from "@mui/icons-material";

interface Payroll {
  id: number;
  employeeName: string;
  employeePosition: string;
  month: number;
  year: number;
  baseSalary: number;
  commission: number;
  bonus: number;
  deduction: number;
  totalSalary: number;
  status: "PENDING" | "PAID" | "CANCELLED";
  paidAt?: string;
  notes?: string;
}

const monthNames = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember"
];

export default function GajiPage() {
  const [payrolls, setPayrolls] = useState<Payroll[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [generateDialogOpen, setGenerateDialogOpen] = useState(false);
  const [editingPayroll, setEditingPayroll] = useState<Payroll | null>(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [tabValue, setTabValue] = useState(0);

  const [formData, setFormData] = useState({
    employeeId: "",
    month: "",
    year: "",
    baseSalary: "",
    commission: "",
    bonus: "",
    deduction: "",
    notes: ""
  });

  const [generateData, setGenerateData] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear()
  });

  useEffect(() => {
    fetchPayrolls();
  }, [selectedYear, selectedMonth]);

  const fetchPayrolls = async () => {
    try {
      // TODO: Implement API call to fetch payrolls
      // For now, using mock data
      setPayrolls([
        {
          id: 1,
          employeeName: "Sari Dewi",
          employeePosition: "Senior Therapist",
          month: 9,
          year: 2024,
          baseSalary: 4500000,
          commission: 450000,
          bonus: 0,
          deduction: 0,
          totalSalary: 4950000,
          status: "PAID",
          paidAt: "2024-09-05"
        },
        {
          id: 2,
          employeeName: "Made Wirawan",
          employeePosition: "Massage Therapist",
          month: 9,
          year: 2024,
          baseSalary: 3500000,
          commission: 280000,
          bonus: 100000,
          deduction: 0,
          totalSalary: 3880000,
          status: "PAID",
          paidAt: "2024-09-05"
        },
        {
          id: 3,
          employeeName: "Kadek Ayu",
          employeePosition: "Facial Specialist",
          month: 9,
          year: 2024,
          baseSalary: 4000000,
          commission: 480000,
          bonus: 0,
          deduction: 50000,
          totalSalary: 4430000,
          status: "PENDING"
        },
        {
          id: 4,
          employeeName: "Wayan Suarta",
          employeePosition: "Receptionist",
          month: 9,
          year: 2024,
          baseSalary: 3000000,
          commission: 0,
          bonus: 50000,
          deduction: 0,
          totalSalary: 3050000,
          status: "PENDING"
        }
      ]);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching payrolls:", error);
      setLoading(false);
    }
  };

  const handleOpenDialog = (payroll?: Payroll) => {
    if (payroll) {
      setEditingPayroll(payroll);
      setFormData({
        employeeId: "1", // TODO: Get actual employee ID
        month: payroll.month.toString(),
        year: payroll.year.toString(),
        baseSalary: payroll.baseSalary.toString(),
        commission: payroll.commission.toString(),
        bonus: payroll.bonus.toString(),
        deduction: payroll.deduction.toString(),
        notes: payroll.notes || ""
      });
    } else {
      setEditingPayroll(null);
      setFormData({
        employeeId: "",
        month: selectedMonth.toString(),
        year: selectedYear.toString(),
        baseSalary: "",
        commission: "",
        bonus: "",
        deduction: "",
        notes: ""
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingPayroll(null);
    setFormData({
      employeeId: "",
      month: "",
      year: "",
      baseSalary: "",
      commission: "",
      bonus: "",
      deduction: "",
      notes: ""
    });
  };

  const handleSubmit = async () => {
    try {
      // TODO: Implement API call to save payroll
      console.log("Saving payroll:", formData);
      await fetchPayrolls();
      handleCloseDialog();
      // TODO: Show success toast
    } catch (error) {
      console.error("Error saving payroll:", error);
      // TODO: Show error toast
    }
  };

  const handleGeneratePayroll = async () => {
    try {
      // TODO: Implement API call to generate payroll for all employees
      console.log("Generating payroll for:", generateData);
      await fetchPayrolls();
      setGenerateDialogOpen(false);
      // TODO: Show success toast
    } catch (error) {
      console.error("Error generating payroll:", error);
      // TODO: Show error toast
    }
  };

  const handleMarkAsPaid = async (payroll: Payroll) => {
    if (window.confirm(`Apakah Anda yakin ingin menandai gaji "${payroll.employeeName}" sebagai sudah dibayar?`)) {
      try {
        // TODO: Implement API call to mark payroll as paid
        console.log("Marking payroll as paid:", payroll.id);
        await fetchPayrolls();
        // TODO: Show success toast
      } catch (error) {
        console.error("Error marking payroll as paid:", error);
      }
    }
  };

  const handleDelete = async (payroll: Payroll) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus data gaji "${payroll.employeeName}"?`)) {
      try {
        // TODO: Implement API call to delete payroll
        console.log("Deleting payroll:", payroll.id);
        await fetchPayrolls();
        // TODO: Show success toast
      } catch (error) {
        console.error("Error deleting payroll:", error);
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
    switch (status) {
      case "PAID":
        return { label: "Sudah Dibayar", color: "success" as const };
      case "PENDING":
        return { label: "Belum Dibayar", color: "warning" as const };
      case "CANCELLED":
        return { label: "Dibatalkan", color: "error" as const };
      default:
        return { label: status, color: "default" as const };
    }
  };

  const getPendingPayrolls = () => {
    return payrolls.filter((p) => p.status === "PENDING");
  };

  const getPaidPayrolls = () => {
    return payrolls.filter((p) => p.status === "PAID");
  };

  const getCurrentPayrolls = () => {
    switch (tabValue) {
      case 0:
        return payrolls;
      case 1:
        return getPendingPayrolls();
      case 2:
        return getPaidPayrolls();
      default:
        return payrolls;
    }
  };

  const calculateTotals = () => {
    const currentPayrolls = getCurrentPayrolls();
    return {
      totalBaseSalary: currentPayrolls.reduce((sum, p) => sum + p.baseSalary, 0),
      totalCommission: currentPayrolls.reduce((sum, p) => sum + p.commission, 0),
      totalBonus: currentPayrolls.reduce((sum, p) => sum + p.bonus, 0),
      totalDeduction: currentPayrolls.reduce((sum, p) => sum + p.deduction, 0),
      totalSalary: currentPayrolls.reduce((sum, p) => sum + p.totalSalary, 0)
    };
  };

  const totals = calculateTotals();

  if (loading) {
    return (
      <Box display='flex' justifyContent='center' alignItems='center' minHeight='400px'>
        <Typography>Loading data gaji...</Typography>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Box display='flex' justifyContent='space-between' alignItems='center' mb={3}>
        <Typography variant='h4' component='h1'>
          Manajemen Gaji
        </Typography>
        <Box display='flex' gap={2}>
          <Button variant='outlined' startIcon={<Receipt />} onClick={() => setGenerateDialogOpen(true)}>
            Generate Payroll
          </Button>
          <Button variant='contained' startIcon={<Add />} onClick={() => handleOpenDialog()}>
            Input Manual
          </Button>
        </Box>
      </Box>

      {/* Period Selector */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display='flex' alignItems='center' gap={2}>
            <Typography variant='h6'>Periode:</Typography>
            <FormControl size='small' sx={{ minWidth: 120 }}>
              <InputLabel>Bulan</InputLabel>
              <Select value={selectedMonth} onChange={(e) => setSelectedMonth(Number(e.target.value))} label='Bulan'>
                {monthNames.map((month, index) => (
                  <MenuItem key={index} value={index + 1}>
                    {month}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl size='small' sx={{ minWidth: 100 }}>
              <InputLabel>Tahun</InputLabel>
              <Select value={selectedYear} onChange={(e) => setSelectedYear(Number(e.target.value))} label='Tahun'>
                <MenuItem value={2023}>2023</MenuItem>
                <MenuItem value={2024}>2024</MenuItem>
                <MenuItem value={2025}>2025</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display='flex' alignItems='center' justifyContent='space-between'>
                <Box>
                  <Typography color='textSecondary' gutterBottom variant='body2'>
                    Total Gaji Pokok
                  </Typography>
                  <Typography variant='h6'>{formatCurrency(totals.totalBaseSalary)}</Typography>
                </Box>
                <AttachMoney color='primary' />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display='flex' alignItems='center' justifyContent='space-between'>
                <Box>
                  <Typography color='textSecondary' gutterBottom variant='body2'>
                    Total Komisi
                  </Typography>
                  <Typography variant='h6'>{formatCurrency(totals.totalCommission)}</Typography>
                </Box>
                <TrendingUp color='success' />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display='flex' alignItems='center' justifyContent='space-between'>
                <Box>
                  <Typography color='textSecondary' gutterBottom variant='body2'>
                    Total Bonus
                  </Typography>
                  <Typography variant='h6'>{formatCurrency(totals.totalBonus)}</Typography>
                </Box>
                <CheckCircle color='info' />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display='flex' alignItems='center' justifyContent='space-between'>
                <Box>
                  <Typography color='textSecondary' gutterBottom variant='body2'>
                    Total Gaji
                  </Typography>
                  <Typography variant='h6'>{formatCurrency(totals.totalSalary)}</Typography>
                </Box>
                <Receipt color='warning' />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
        <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
          <Tab label={`Semua (${payrolls.length})`} />
          <Tab label={`Belum Dibayar (${getPendingPayrolls().length})`} />
          <Tab label={`Sudah Dibayar (${getPaidPayrolls().length})`} />
        </Tabs>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Karyawan</TableCell>
              <TableCell>Periode</TableCell>
              <TableCell>Gaji Pokok</TableCell>
              <TableCell>Komisi</TableCell>
              <TableCell>Bonus</TableCell>
              <TableCell>Potongan</TableCell>
              <TableCell>Total Gaji</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align='center'>Aksi</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {getCurrentPayrolls().map((payroll) => (
              <TableRow key={payroll.id}>
                <TableCell>
                  <Box display='flex' alignItems='center' gap={2}>
                    <Avatar>
                      <Person />
                    </Avatar>
                    <Box>
                      <Typography variant='subtitle2'>{payroll.employeeName}</Typography>
                      <Typography variant='body2' color='textSecondary'>
                        {payroll.employeePosition}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant='subtitle2'>
                    {monthNames[payroll.month - 1]} {payroll.year}
                  </Typography>
                </TableCell>
                <TableCell>{formatCurrency(payroll.baseSalary)}</TableCell>
                <TableCell>{formatCurrency(payroll.commission)}</TableCell>
                <TableCell>{formatCurrency(payroll.bonus)}</TableCell>
                <TableCell>{formatCurrency(payroll.deduction)}</TableCell>
                <TableCell>
                  <Typography variant='subtitle2' color='primary'>
                    {formatCurrency(payroll.totalSalary)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box display='flex' alignItems='center' gap={1}>
                    <Chip
                      label={getStatusInfo(payroll.status).label}
                      color={getStatusInfo(payroll.status).color}
                      size='small'
                    />
                    {payroll.status === "PENDING" && (
                      <Button size='small' variant='outlined' color='success' onClick={() => handleMarkAsPaid(payroll)}>
                        Bayar
                      </Button>
                    )}
                  </Box>
                </TableCell>
                <TableCell align='center'>
                  <IconButton size='small' onClick={() => handleOpenDialog(payroll)}>
                    <Edit />
                  </IconButton>
                  <IconButton size='small' color='error' onClick={() => handleDelete(payroll)}>
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
        <DialogTitle>{editingPayroll ? "Edit Data Gaji" : "Input Gaji Manual"}</DialogTitle>
        <DialogContent>
          <Box display='flex' flexDirection='column' gap={3} pt={2}>
            <FormControl fullWidth required>
              <InputLabel>Karyawan</InputLabel>
              <Select
                value={formData.employeeId}
                onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                label='Karyawan'
              >
                <MenuItem value='1'>Sari Dewi</MenuItem>
                <MenuItem value='2'>Made Wirawan</MenuItem>
                <MenuItem value='3'>Kadek Ayu</MenuItem>
                <MenuItem value='4'>Wayan Suarta</MenuItem>
              </Select>
            </FormControl>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Bulan</InputLabel>
                  <Select
                    value={formData.month}
                    onChange={(e) => setFormData({ ...formData, month: e.target.value })}
                    label='Bulan'
                  >
                    {monthNames.map((month, index) => (
                      <MenuItem key={index} value={index + 1}>
                        {month}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Tahun</InputLabel>
                  <Select
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    label='Tahun'
                  >
                    <MenuItem value='2023'>2023</MenuItem>
                    <MenuItem value='2024'>2024</MenuItem>
                    <MenuItem value='2025'>2025</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label='Gaji Pokok'
                  value={formData.baseSalary}
                  onChange={(e) => setFormData({ ...formData, baseSalary: e.target.value })}
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
                    startAdornment: <InputAdornment position='start'>Rp</InputAdornment>
                  }}
                />
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label='Bonus'
                  value={formData.bonus}
                  onChange={(e) => setFormData({ ...formData, bonus: e.target.value })}
                  fullWidth
                  type='number'
                  InputProps={{
                    startAdornment: <InputAdornment position='start'>Rp</InputAdornment>
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label='Potongan'
                  value={formData.deduction}
                  onChange={(e) => setFormData({ ...formData, deduction: e.target.value })}
                  fullWidth
                  type='number'
                  InputProps={{
                    startAdornment: <InputAdornment position='start'>Rp</InputAdornment>
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
            disabled={!formData.employeeId || !formData.month || !formData.year || !formData.baseSalary}
          >
            {editingPayroll ? "Update" : "Simpan"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Generate Payroll Dialog */}
      <Dialog open={generateDialogOpen} onClose={() => setGenerateDialogOpen(false)} maxWidth='sm' fullWidth>
        <DialogTitle>Generate Payroll Otomatis</DialogTitle>
        <DialogContent>
          <Alert severity='info' sx={{ mb: 3 }}>
            Sistem akan menghitung gaji semua karyawan aktif berdasarkan komisi dari appointment yang selesai pada
            periode yang dipilih.
          </Alert>

          <Box display='flex' flexDirection='column' gap={3} pt={2}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Bulan</InputLabel>
                  <Select
                    value={generateData.month}
                    onChange={(e) => setGenerateData({ ...generateData, month: Number(e.target.value) })}
                    label='Bulan'
                  >
                    {monthNames.map((month, index) => (
                      <MenuItem key={index} value={index + 1}>
                        {month}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Tahun</InputLabel>
                  <Select
                    value={generateData.year}
                    onChange={(e) => setGenerateData({ ...generateData, year: Number(e.target.value) })}
                    label='Tahun'
                  >
                    <MenuItem value={2023}>2023</MenuItem>
                    <MenuItem value={2024}>2024</MenuItem>
                    <MenuItem value={2025}>2025</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setGenerateDialogOpen(false)}>Batal</Button>
          <Button onClick={handleGeneratePayroll} variant='contained' color='warning'>
            Generate Payroll
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
