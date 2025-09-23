"use client";

import { useState, useEffect, useCallback } from "react";

import { Card, CardContent, Typography, Grid, Box, CircularProgress, IconButton, MenuItem, Menu } from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line
} from "recharts";
import { CalendarToday, People, Receipt, Star } from "@mui/icons-material";
import { format, addDays } from "date-fns";

interface DashboardData {
  todayAppointments: number;
  monthlyRevenue: number;
  totalCustomers: number;
  totalEmployees: number;
  serviceDistribution: Array<{ name: string; value: number; color: string }>;
  revenueChart: Array<{ date: string; revenue: number }>;
  dailyActivity: Array<{ day: string; appointments: number }>;
  topServices: Array<{ name: string; count: number; revenue: number }>;
  topEmployees: Array<{ name: string; appointments: number; revenue: number }>;
}

const StatCard = ({
  title,
  value,
  icon,
  color = "primary",
  isLoading = false
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color?: string;
  isLoading?: boolean;
}) => (
  <Card sx={{ height: "100%", position: "relative", overflow: "visible" }}>
    <CardContent>
      <Box display='flex' justifyContent='space-between' alignItems='flex-start'>
        <Box>
          <Typography color='textSecondary' gutterBottom variant='body2'>
            {title}
          </Typography>
          {isLoading ? (
            <CircularProgress size={24} />
          ) : (
            <Typography variant='h4' component='div' color={color}>
              {value}
            </Typography>
          )}
        </Box>
        <Box
          sx={{
            p: 1,
            borderRadius: 1,
            backgroundColor: `${color}.light`,
            color: `${color}.dark`
          }}
        >
          {icon}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

export default function HomePage() {
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    todayAppointments: 0,
    monthlyRevenue: 0,
    totalCustomers: 0,
    totalEmployees: 0,
    serviceDistribution: [],
    revenueChart: [],
    dailyActivity: [],
    topServices: [],
    topEmployees: []
  });

  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);

    try {
      const response = await fetch(`/api/dashboard?date=${selectedDate}`);

      if (response.ok) {
        const data = await response.json();

        setDashboardData(data);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  }, [selectedDate]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0
    }).format(amount);
  };

  const handleDateMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleDateMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDateSelect = (days: number) => {
    const newDate = days === 0 ? new Date() : addDays(new Date(), days);

    setSelectedDate(format(newDate, "yyyy-MM-dd"));
    handleDateMenuClose();
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box display='flex' justifyContent='space-between' alignItems='center' mb={3}>
        <Box>
          <Typography variant='h4' gutterBottom>
            Dashboard
          </Typography>
          <Typography variant='body1' color='textSecondary'>
            Selamat datang di dashboard Kalimasada Spa
          </Typography>
        </Box>
        <Box display='flex' alignItems='center' gap={2}>
          <Typography variant='body2' color='textSecondary'>
            {format(new Date(selectedDate), "dd MMMM yyyy")}
          </Typography>
          <IconButton onClick={handleDateMenuClick}>
            <CalendarToday />
          </IconButton>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleDateMenuClose}>
            <MenuItem onClick={() => handleDateSelect(0)}>Hari Ini</MenuItem>
            <MenuItem onClick={() => handleDateSelect(-1)}>Kemarin</MenuItem>
            <MenuItem onClick={() => handleDateSelect(-7)}>7 Hari Lalu</MenuItem>
            <MenuItem onClick={() => handleDateSelect(-30)}>30 Hari Lalu</MenuItem>
          </Menu>
        </Box>
      </Box>

      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title='Janji Hari Ini'
            value={dashboardData.todayAppointments}
            icon={<CalendarToday />}
            color='primary'
            isLoading={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title='Pendapatan Bulan Ini'
            value={formatCurrency(dashboardData.monthlyRevenue)}
            icon={<Receipt />}
            color='success'
            isLoading={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title='Total Pelanggan'
            value={dashboardData.totalCustomers}
            icon={<People />}
            color='info'
            isLoading={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title='Total Karyawan'
            value={dashboardData.totalEmployees}
            icon={<Star />}
            color='warning'
            isLoading={loading}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant='h6' gutterBottom>
                Pendapatan 7 Hari Terakhir
              </Typography>
              {loading ? (
                <Box display='flex' justifyContent='center' py={4}>
                  <CircularProgress />
                </Box>
              ) : (
                <ResponsiveContainer width='100%' height={300}>
                  <LineChart data={dashboardData.revenueChart}>
                    <CartesianGrid strokeDasharray='3 3' />
                    <XAxis dataKey='date' />
                    <YAxis tickFormatter={(value) => `${value / 1000000}M`} />
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    <Line type='monotone' dataKey='revenue' stroke='#8884d8' strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant='h6' gutterBottom>
                Distribusi Layanan
              </Typography>
              {loading ? (
                <Box display='flex' justifyContent='center' py={4}>
                  <CircularProgress />
                </Box>
              ) : (
                <ResponsiveContainer width='100%' height={300}>
                  <PieChart>
                    <Pie
                      data={dashboardData.serviceDistribution}
                      cx='50%'
                      cy='50%'
                      labelLine={false}
                      outerRadius={80}
                      fill='#8884d8'
                      dataKey='value'
                    >
                      {dashboardData.serviceDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3} mb={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant='h6' gutterBottom>
                Aktivitas Harian (7 Hari Terakhir)
              </Typography>
              {loading ? (
                <Box display='flex' justifyContent='center' py={4}>
                  <CircularProgress />
                </Box>
              ) : (
                <ResponsiveContainer width='100%' height={300}>
                  <BarChart data={dashboardData.dailyActivity}>
                    <CartesianGrid strokeDasharray='3 3' />
                    <XAxis dataKey='day' />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey='appointments' fill='#8884d8' />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant='h6' gutterBottom>
                Layanan Terpopuler
              </Typography>
              {loading ? (
                <Box display='flex' justifyContent='center' py={4}>
                  <CircularProgress />
                </Box>
              ) : (
                <Box>
                  {dashboardData.topServices.map((service, index) => (
                    <Box key={index} display='flex' justifyContent='space-between' alignItems='center' py={1}>
                      <Typography variant='body2'>{service.name}</Typography>
                      <Box textAlign='right'>
                        <Typography variant='body2' fontWeight='bold'>
                          {service.count} appointments
                        </Typography>
                        <Typography variant='caption' color='textSecondary'>
                          {formatCurrency(service.revenue)}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant='h6' gutterBottom>
                Karyawan Terbaik
              </Typography>
              {loading ? (
                <Box display='flex' justifyContent='center' py={4}>
                  <CircularProgress />
                </Box>
              ) : (
                <Box>
                  {dashboardData.topEmployees.map((employee, index) => (
                    <Box key={index} display='flex' justifyContent='space-between' alignItems='center' py={1}>
                      <Typography variant='body2'>{employee.name}</Typography>
                      <Box textAlign='right'>
                        <Typography variant='body2' fontWeight='bold'>
                          {employee.appointments} appointments
                        </Typography>
                        <Typography variant='caption' color='textSecondary'>
                          {formatCurrency(employee.revenue)}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
