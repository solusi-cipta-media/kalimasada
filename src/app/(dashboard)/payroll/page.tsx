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
  Alert,
  CircularProgress,
  Divider,
  Container,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
  Autocomplete,
  Checkbox,
  ListItemText
} from "@mui/material";
import {
  Add,
  Person,
  AttachMoney,
  Receipt,
  CheckCircle,
  Pending,
  People,
  Visibility,
  Delete,
  CalendarToday,
  Payment,
  Paid
} from "@mui/icons-material";

import { confirmDialog, successAlert, errorAlert, swalConfig } from "@/utils/sweetAlert";

interface PayrollGeneration {
  id: number;
  month: number;
  year: number;
  generatedByUser: {
    id: number;
    fullName: string;
    email: string;
  };
  employeeCount: number;
  totalAmount: number;
  status: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  payrolls?: PayrollDetail[];
}

interface PayrollDetail {
  id: number;
  employeeId: number;
  baseSalary: number;
  commission: number;
  bonus: number;
  deduction: number;
  totalSalary: number;
  status: "PENDING" | "PAID" | "CANCELLED";
  paidAt?: string;
  employee: {
    id: number;
    name: string;
    position: string;
    avatar?: string;
  };
}

const PayrollPage = () => {
  const [generations, setGenerations] = useState<PayrollGeneration[]>([]);
  const [selectedGeneration, setSelectedGeneration] = useState<PayrollGeneration | null>(null);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

  const [formData, setFormData] = useState({
    month: "",
    year: "",
    employeeSelection: "all", // "all" or "selected"
    selectedEmployeeIds: [] as number[]
  });

  const [generating, setGenerating] = useState(false);
  const [employees, setEmployees] = useState<any[]>([]);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [payingAll, setPayingAll] = useState(false);
  const [payingIndividual, setPayingIndividual] = useState<number | null>(null);

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

  useEffect(() => {
    fetchGenerations();
  }, []);

  const fetchGenerations = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/payroll/generation");
      const result = await response.json();

      if (response.ok) {
        setGenerations(result.data || []);
      } else {
        console.error("Error fetching generations:", result.message);
      }
    } catch (error) {
      console.error("Error fetching generations:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchGenerationDetails = async (id: number) => {
    try {
      setDetailLoading(true);

      const response = await fetch(`/api/payroll/generation/${id}`);
      const result = await response.json();

      if (response.ok) {
        setSelectedGeneration(result.data);
        setDetailDialogOpen(true);
      } else {
        console.error("Error fetching generation details:", result.message);
      }
    } catch (error) {
      console.error("Error fetching generation details:", error);
    } finally {
      setDetailLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      setLoadingEmployees(true);
      const response = await fetch("/api/employee?isActive=true");
      const result = await response.json();

      if (response.ok) {
        setEmployees(result.data || []);
      } else {
        console.error("Error fetching employees:", result.message);
        setEmployees([]);
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
      setEmployees([]);
    } finally {
      setLoadingEmployees(false);
    }
  };

  const handleOpenDialog = () => {
    const currentDate = new Date();

    setFormData({
      month: (currentDate.getMonth() + 1).toString(),
      year: currentDate.getFullYear().toString(),
      employeeSelection: "all",
      selectedEmployeeIds: []
    });
    fetchEmployees();
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setFormData({
      month: "",
      year: "",
      employeeSelection: "all",
      selectedEmployeeIds: []
    });
  };

  const handleCloseDetailDialog = () => {
    setDetailDialogOpen(false);
    setSelectedGeneration(null);
  };

  const handleSubmit = async () => {
    const monthName = monthNames[Number(formData.month) - 1];

    const employeeText =
      formData.employeeSelection === "all"
        ? "semua karyawan"
        : `${formData.selectedEmployeeIds.length} karyawan terpilih`;

    const result = await Swal.fire(
      confirmDialog.generate(`gaji bulan ${monthName} ${formData.year} untuk ${employeeText}`)
    );

    if (result.isConfirmed) {
      try {
        setGenerating(true);

        const requestBody: any = {
          month: Number(formData.month),
          year: Number(formData.year)
        };

        // Add employee IDs if specific employees are selected
        if (formData.employeeSelection === "selected") {
          requestBody.employeeIds = formData.selectedEmployeeIds;
        }

        const response = await fetch("/api/payroll/generation", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(requestBody)
        });

        const result = await response.json();

        if (response.ok) {
          await fetchGenerations();
          handleCloseDialog();

          // Show success message
          Swal.fire(successAlert.timer(result.message || "Gaji berhasil digenerate!"));
        } else {
          console.error("Error generating payroll:", result.message);
          Swal.fire(errorAlert.simple(result.message || "Terjadi kesalahan saat generate gaji"));
        }
      } catch (error) {
        console.error("Error generating payroll:", error);
        Swal.fire(errorAlert.network());
      } finally {
        setGenerating(false);
      }
    }
  };

  const handleDelete = async (generation: PayrollGeneration) => {
    const monthName = monthNames[generation.month - 1];
    const result = await Swal.fire(confirmDialog.delete(`gaji bulan ${monthName} ${generation.year}`));

    if (result.isConfirmed) {
      try {
        const response = await fetch(`/api/payroll/generation/${generation.id}`, {
          method: "DELETE"
        });

        if (response.ok) {
          await fetchGenerations();

          // Show success message
          Swal.fire(successAlert.timer("Data gaji berhasil dihapus!"));
        } else {
          Swal.fire(errorAlert.simple("Terjadi kesalahan saat menghapus data"));
        }
      } catch (error) {
        console.error("Error deleting generation:", error);
        Swal.fire(errorAlert.network());
      }
    }
  };

  const handlePayIndividual = async (payrollId: number) => {
    // Find the payroll details for confirmation
    const payroll = selectedGeneration?.payrolls?.find((p) => p.id === payrollId);
    const employeeName = payroll?.employee?.name || "";
    const amount = payroll ? formatCurrency(payroll.totalSalary) : "";

    const result = await Swal.fire(confirmDialog.payment(amount, employeeName));

    if (result.isConfirmed) {
      try {
        setPayingIndividual(payrollId);

        const response = await fetch(`/api/payroll/${payrollId}/pay`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json"
          }
        });

        if (response.ok) {
          const data = await response.json();

          // Refresh the generation details
          if (selectedGeneration) {
            await fetchGenerationDetails(selectedGeneration.id);
          }

          await fetchGenerations();

          // Show success message
          Swal.fire(successAlert.timer(data.message || "Pembayaran berhasil!"));
        } else {
          Swal.fire(errorAlert.simple("Terjadi kesalahan saat memproses pembayaran"));
        }
      } catch (error) {
        console.error("Error paying individual payroll:", error);
        Swal.fire(errorAlert.network());
      } finally {
        setPayingIndividual(null);
      }
    }
  };

  const handlePayAll = async (generationId: number) => {
    // Calculate pending payrolls count and total amount
    const pendingPayrolls = selectedGeneration?.payrolls?.filter((p) => p.status === "PENDING") || [];
    const paidPayrolls = selectedGeneration?.payrolls?.filter((p) => p.status === "PAID") || [];
    const totalAmount = pendingPayrolls.reduce((sum, p) => sum + p.totalSalary, 0);
    const formattedTotal = formatCurrency(totalAmount);

    // Create more descriptive confirmation message
    const hasMixedStatus = paidPayrolls.length > 0;

    const confirmationConfig = hasMixedStatus
      ? {
          title: "Konfirmasi Pembayaran Belum Dibayar",
          text: `Terdapat ${paidPayrolls.length} gaji yang sudah dibayar. Apakah Anda yakin ingin membayar ${pendingPayrolls.length} gaji yang belum dibayar dengan total ${formattedTotal}?`,
          icon: "question" as const,
          showCancelButton: true,
          confirmButtonText: `Ya, Bayar ${pendingPayrolls.length} Gaji`,
          cancelButtonText: "Batal",
          reverseButtons: true,
          ...swalConfig
        }
      : confirmDialog.payAll(pendingPayrolls.length, formattedTotal);

    const result = await Swal.fire(confirmationConfig);

    if (result.isConfirmed) {
      try {
        setPayingAll(true);

        const response = await fetch(`/api/payroll/generation/${generationId}/pay-all`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json"
          }
        });

        if (response.ok) {
          const data = await response.json();

          // Refresh the generation details
          if (selectedGeneration) {
            await fetchGenerationDetails(selectedGeneration.id);
          }

          await fetchGenerations();

          // Show success message with specific count
          const successMessage = data.message || `${pendingPayrolls.length} gaji berhasil dibayar!`;

          Swal.fire(successAlert.timer(successMessage));
        } else {
          Swal.fire(errorAlert.simple("Terjadi kesalahan saat memproses pembayaran"));
        }
      } catch (error) {
        console.error("Error paying all payrolls:", error);
        Swal.fire(errorAlert.network());
      } finally {
        setPayingAll(false);
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
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "PAID":
        return { label: "Sudah Dibayar", color: "success" as const, icon: <CheckCircle /> };
      case "PENDING":
        return { label: "Belum Dibayar", color: "warning" as const, icon: <Pending /> };
      case "CANCELLED":
        return { label: "Dibatalkan", color: "error" as const, icon: <Delete /> };
      default:
        return { label: "Selesai", color: "info" as const, icon: <CheckCircle /> };
    }
  };

  const getTotalStats = () => {
    return generations.reduce(
      (acc, gen) => {
        acc.totalEmployees += gen.employeeCount;
        acc.totalAmount += gen.totalAmount;
        acc.totalGenerations += 1;

        return acc;
      },
      { totalEmployees: 0, totalAmount: 0, totalGenerations: 0 }
    );
  };

  const stats = getTotalStats();

  if (loading) {
    return (
      <Box display='flex' justifyContent='center' alignItems='center' minHeight='400px'>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth='xl'>
      <Box p={3}>
        {/* Header */}
        <Box display='flex' justifyContent='space-between' alignItems='center' mb={3}>
          <Box>
            <Typography variant='h4' component='h1' gutterBottom>
              Manajemen Gaji
            </Typography>
            <Typography variant='body1' color='textSecondary'>
              Kelola dan pantau riwayat generate gaji bulanan karyawan
            </Typography>
          </Box>
          <Button variant='contained' startIcon={<Add />} onClick={handleOpenDialog} size='large'>
            Generate Gaji Baru
          </Button>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Box display='flex' alignItems='center' gap={2}>
                  <Avatar sx={{ bgcolor: "primary.main" }}>
                    <Receipt />
                  </Avatar>
                  <Box>
                    <Typography variant='h4'>{stats.totalGenerations}</Typography>
                    <Typography variant='body2' color='textSecondary'>
                      Total Generate
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Box display='flex' alignItems='center' gap={2}>
                  <Avatar sx={{ bgcolor: "success.main" }}>
                    <People />
                  </Avatar>
                  <Box>
                    <Typography variant='h4'>{stats.totalEmployees}</Typography>
                    <Typography variant='body2' color='textSecondary'>
                      Total Karyawan
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Box display='flex' alignItems='center' gap={2}>
                  <Avatar sx={{ bgcolor: "info.main" }}>
                    <AttachMoney />
                  </Avatar>
                  <Box>
                    <Typography variant='h4'>{formatCurrency(stats.totalAmount)}</Typography>
                    <Typography variant='body2' color='textSecondary'>
                      Total Nilai Gaji
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Generations Table */}
        <Card>
          <CardContent>
            <Typography variant='h6' gutterBottom>
              Riwayat Generate Gaji
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Periode</TableCell>
                    <TableCell>Dibuat Oleh</TableCell>
                    <TableCell>Jumlah Karyawan</TableCell>
                    <TableCell>Total Gaji</TableCell>
                    <TableCell>Tanggal Dibuat</TableCell>
                    <TableCell align='center'>Aksi</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {generations.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align='center'>
                        <Typography variant='body2' color='textSecondary'>
                          Belum ada data generate gaji
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    generations.map((generation) => (
                      <TableRow key={generation.id}>
                        <TableCell>
                          <Box display='flex' alignItems='center' gap={1}>
                            <CalendarToday fontSize='small' color='primary' />
                            <Typography variant='subtitle2'>
                              {monthNames[generation.month - 1]} {generation.year}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box>
                            <Typography variant='subtitle2'>{generation.generatedByUser.fullName}</Typography>
                            <Typography variant='body2' color='textSecondary'>
                              {generation.generatedByUser.email}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip label={`${generation.employeeCount} Karyawan`} color='primary' size='small' />
                        </TableCell>
                        <TableCell>
                          <Typography variant='subtitle2' color='success.main'>
                            {formatCurrency(generation.totalAmount)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant='body2'>{formatDate(generation.createdAt)}</Typography>
                        </TableCell>
                        <TableCell align='center'>
                          <IconButton
                            size='small'
                            color='primary'
                            onClick={() => fetchGenerationDetails(generation.id)}
                            disabled={detailLoading}
                          >
                            {detailLoading ? <CircularProgress size={20} /> : <Visibility />}
                          </IconButton>
                          <IconButton size='small' color='error' onClick={() => handleDelete(generation)}>
                            <Delete />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        {/* Generate Dialog */}
        <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth='sm' fullWidth>
          <DialogTitle>Generate Gaji Bulanan</DialogTitle>
          <DialogContent>
            <Alert severity='info' sx={{ mb: 3 }}>
              Generate gaji akan menghitung gaji karyawan berdasarkan periode dan pilihan karyawan yang dipilih.
            </Alert>

            <Grid container spacing={2} sx={{ mt: 1 }}>
              {/* Period Selection */}
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>Bulan</InputLabel>
                  <Select
                    value={formData.month}
                    label='Bulan'
                    onChange={(e) => setFormData((prev) => ({ ...prev, month: e.target.value }))}
                  >
                    {monthNames.map((month, index) => (
                      <MenuItem key={index + 1} value={index + 1}>
                        {month}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label='Tahun'
                  type='number'
                  value={formData.year}
                  onChange={(e) => setFormData((prev) => ({ ...prev, year: e.target.value }))}
                  inputProps={{ min: 2020, max: 2030 }}
                />
              </Grid>

              {/* Employee Selection Options */}
              <Grid item xs={12}>
                <FormControl component='fieldset' sx={{ mt: 2 }}>
                  <FormLabel component='legend'>Pilihan Karyawan</FormLabel>
                  <RadioGroup
                    value={formData.employeeSelection}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        employeeSelection: e.target.value,
                        selectedEmployeeIds: [] // Reset selection when changing mode
                      }))
                    }
                    row
                  >
                    <FormControlLabel value='all' control={<Radio />} label='Semua Karyawan Aktif' />
                    <FormControlLabel value='selected' control={<Radio />} label='Karyawan Terpilih' />
                  </RadioGroup>
                </FormControl>
              </Grid>

              {/* Employee Selection Dropdown */}
              {formData.employeeSelection === "selected" && (
                <Grid item xs={12}>
                  <Autocomplete
                    multiple
                    options={employees}
                    getOptionLabel={(option) => `${option.name} - ${option.position}`}
                    value={employees.filter((emp) => formData.selectedEmployeeIds.includes(emp.id))}
                    onChange={(_, newValue) => {
                      setFormData((prev) => ({
                        ...prev,
                        selectedEmployeeIds: newValue.map((emp) => emp.id)
                      }));
                    }}
                    loading={loadingEmployees}
                    renderOption={(props, option, { selected }) => (
                      <li {...props}>
                        <Checkbox checked={selected} style={{ marginRight: 8 }} />
                        <ListItemText
                          primary={option.name}
                          secondary={`${option.position} - ${new Intl.NumberFormat("id-ID", {
                            style: "currency",
                            currency: "IDR"
                          }).format(option.salary)}`}
                        />
                      </li>
                    )}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label='Pilih Karyawan'
                        placeholder={loadingEmployees ? "Memuat karyawan..." : "Ketik untuk mencari karyawan"}
                        helperText={
                          formData.selectedEmployeeIds.length > 0
                            ? `${formData.selectedEmployeeIds.length} karyawan dipilih`
                            : "Pilih minimal 1 karyawan"
                        }
                      />
                    )}
                  />
                </Grid>
              )}
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Batal</Button>
            <Button
              onClick={handleSubmit}
              variant='contained'
              disabled={
                generating ||
                !formData.month ||
                !formData.year ||
                (formData.employeeSelection === "selected" && formData.selectedEmployeeIds.length === 0)
              }
            >
              {generating ? <CircularProgress size={20} /> : "Generate Gaji"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Detail Dialog */}
        <Dialog open={detailDialogOpen} onClose={handleCloseDetailDialog} maxWidth='lg' fullWidth>
          <DialogTitle>
            Detail Gaji -{" "}
            {selectedGeneration && `${monthNames[selectedGeneration.month - 1]} ${selectedGeneration.year}`}
          </DialogTitle>
          <DialogContent>
            {detailLoading ? (
              <Box display='flex' flexDirection='column' alignItems='center' py={4}>
                <CircularProgress size={48} />
                <Typography variant='body1' sx={{ mt: 2 }}>
                  Memuat detail gaji...
                </Typography>
              </Box>
            ) : selectedGeneration ? (
              <Box>
                {/* Generation Info */}
                <Box mb={3}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Typography variant='subtitle2' color='textSecondary'>
                        Dibuat Oleh
                      </Typography>
                      <Typography variant='body1'>{selectedGeneration.generatedByUser.fullName}</Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant='subtitle2' color='textSecondary'>
                        Tanggal Dibuat
                      </Typography>
                      <Typography variant='body1'>{formatDate(selectedGeneration.createdAt)}</Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant='subtitle2' color='textSecondary'>
                        Jumlah Karyawan
                      </Typography>
                      <Typography variant='body1'>{selectedGeneration.employeeCount} Karyawan</Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant='subtitle2' color='textSecondary'>
                        Total Gaji
                      </Typography>
                      <Typography variant='body1' color='success.main'>
                        {formatCurrency(selectedGeneration.totalAmount)}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Payroll Details */}
                <Box display='flex' justifyContent='space-between' alignItems='center' mb={2}>
                  <Typography variant='h6'>Detail Gaji Karyawan</Typography>
                  {selectedGeneration && selectedGeneration.payrolls?.some((p) => p.status === "PENDING") && (
                    <Box>
                      {(() => {
                        const pendingCount =
                          selectedGeneration.payrolls?.filter((p) => p.status === "PENDING").length || 0;

                        const totalCount = selectedGeneration.payrolls?.length || 0;
                        const hasMixedStatus = pendingCount < totalCount;

                        return (
                          <Button
                            variant='contained'
                            color='success'
                            startIcon={payingAll ? <CircularProgress size={16} /> : <Paid />}
                            onClick={() => handlePayAll(selectedGeneration.id)}
                            disabled={payingAll}
                            size='small'
                          >
                            {payingAll
                              ? "Membayar..."
                              : hasMixedStatus
                                ? `Bayar ${pendingCount} Belum Dibayar`
                                : "Bayar Semua"}
                          </Button>
                        );
                      })()}
                    </Box>
                  )}
                </Box>

                {/* Payment Status Summary */}
                {selectedGeneration && selectedGeneration.payrolls && (
                  <Box mb={2} display='flex' gap={1}>
                    {(() => {
                      const pendingCount = selectedGeneration.payrolls.filter((p) => p.status === "PENDING").length;
                      const paidCount = selectedGeneration.payrolls.filter((p) => p.status === "PAID").length;

                      return (
                        <>
                          {paidCount > 0 && (
                            <Chip
                              label={`${paidCount} Sudah Dibayar`}
                              color='success'
                              variant='outlined'
                              size='small'
                            />
                          )}
                          {pendingCount > 0 && (
                            <Chip
                              label={`${pendingCount} Belum Dibayar`}
                              color='warning'
                              variant='outlined'
                              size='small'
                            />
                          )}
                        </>
                      );
                    })()}
                  </Box>
                )}

                <TableContainer component={Paper} variant='outlined'>
                  <Table size='small'>
                    <TableHead>
                      <TableRow>
                        <TableCell>Karyawan</TableCell>
                        <TableCell>Gaji Pokok</TableCell>
                        <TableCell>Komisi</TableCell>
                        <TableCell>Bonus</TableCell>
                        <TableCell>Potongan</TableCell>
                        <TableCell>Total</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell align='center'>Aksi</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedGeneration.payrolls?.map((payroll) => (
                        <TableRow key={payroll.id}>
                          <TableCell>
                            <Box display='flex' alignItems='center' gap={1}>
                              <Avatar sx={{ width: 32, height: 32 }}>
                                <Person />
                              </Avatar>
                              <Box>
                                <Typography variant='subtitle2'>{payroll.employee.name}</Typography>
                                <Typography variant='caption' color='textSecondary'>
                                  {payroll.employee.position}
                                </Typography>
                              </Box>
                            </Box>
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
                            <Chip {...getStatusInfo(payroll.status)} size='small' />
                          </TableCell>
                          <TableCell align='center'>
                            {payroll.status === "PENDING" && (
                              <Button
                                variant='outlined'
                                color='success'
                                size='small'
                                startIcon={
                                  payingIndividual === payroll.id ? <CircularProgress size={16} /> : <Payment />
                                }
                                onClick={() => handlePayIndividual(payroll.id)}
                                disabled={payingIndividual === payroll.id || payingAll}
                              >
                                {payingIndividual === payroll.id ? "Bayar..." : "Bayar"}
                              </Button>
                            )}
                            {payroll.status === "PAID" && (
                              <Chip label='Sudah Dibayar' color='success' size='small' variant='outlined' />
                            )}
                          </TableCell>
                        </TableRow>
                      )) || []}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            ) : (
              <Box display='flex' justifyContent='center' py={4}>
                <Typography variant='body1' color='textSecondary'>
                  Tidak ada data yang tersedia
                </Typography>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDetailDialog}>Tutup</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default PayrollPage;
