"use client";
import { useEffect, useState, useCallback } from "react";

import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  useTheme,
  Paper,
  TextField,
  InputAdornment
} from "@mui/material";
import { CalendarToday, People, AttachMoney, Spa, Schedule } from "@mui/icons-material";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

interface DashboardStats {
  todayAppointments: number;
  monthlyRevenue: number;
  totalCustomers: number;
  totalEmployees: number;
  upcomingAppointments: any[];
  revenueData: any[];
  serviceDistribution: any[];
  dailyActivityData: any[];
  topServices: any[];
  topEmployees: any[];
}

export default function BerandaPage() {
  const theme = useTheme();

  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]); // Format: YYYY-MM-DD

  const [stats, setStats] = useState<DashboardStats>({
    todayAppointments: 0,
    monthlyRevenue: 0,
    totalCustomers: 0,
    totalEmployees: 0,
    upcomingAppointments: [],
    revenueData: [],
    serviceDistribution: [],
    dailyActivityData: [],
    topServices: [],
    topEmployees: []
  });

  const [loading, setLoading] = useState(true);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);

      // Generate different data based on selected date
      const dateObj = new Date(selectedDate);
      const dateStr = selectedDate;
      const dayOfWeek = dateObj.getDay(); // 0 = Sunday, 1 = Monday, etc.
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

      // Base multiplier for different days
      const multiplier = isWeekend ? 0.7 : 1.0; // Weekend typically has less activity
      const dateHash = dateObj.getDate() % 10; // Use date to create variation

      // TODO: Implement API calls to fetch dashboard data for specific date
      // For now, we'll use mock data that varies by date
      setStats({
        todayAppointments: Math.floor((12 + dateHash) * multiplier),
        monthlyRevenue: Math.floor(45000000 * (1 + dateHash * 0.1)),
        totalCustomers: 156 + dateHash,
        totalEmployees: 8,
        upcomingAppointments: [
          {
            id: 1,
            customerName: isWeekend ? "Weekend Client A" : "Sarah Johnson",
            serviceName: "Balinese Massage",
            time: "10:00",
            employee: "Sari Dewi",
            date: dateStr
          },
          {
            id: 2,
            customerName: isWeekend ? "Weekend Client B" : "Michael Chen",
            serviceName: "Facial Treatment",
            time: "11:30",
            employee: "Kadek Ayu",
            date: dateStr
          },
          {
            id: 3,
            customerName: isWeekend ? "Weekend Client C" : "Lisa Anderson",
            serviceName: "Hair Treatment",
            time: "13:00",
            employee: "Ni Luh Putu",
            date: dateStr
          }
        ],
        revenueData: [
          { name: "Jan", revenue: 24000000 },
          { name: "Feb", revenue: 28000000 },
          { name: "Mar", revenue: 32000000 },
          { name: "Apr", revenue: 35000000 },
          { name: "May", revenue: 38000000 },
          { name: "Jun", revenue: Math.floor(45000000 * (1 + dateHash * 0.1)) }
        ],
        serviceDistribution: [
          { name: "Massage", value: 35, color: theme.palette.primary.main },
          { name: "Facial", value: 25, color: theme.palette.secondary.main },
          { name: "Hair Treatment", value: 20, color: theme.palette.success.main },
          { name: "Body Treatment", value: 15, color: theme.palette.warning.main },
          { name: "Others", value: 5, color: theme.palette.error.main }
        ],
        dailyActivityData: [
          {
            time: "08:00",
            "Service at Home": Math.floor((2 + dateHash * 0.2) * multiplier),
            "Service at Location": Math.floor((5 + dateHash * 0.3) * multiplier)
          },
          {
            time: "10:00",
            "Service at Home": Math.floor((4 + dateHash * 0.3) * multiplier),
            "Service at Location": Math.floor((8 + dateHash * 0.4) * multiplier)
          },
          {
            time: "12:00",
            "Service at Home": Math.floor((3 + dateHash * 0.2) * multiplier),
            "Service at Location": Math.floor((12 + dateHash * 0.5) * multiplier)
          },
          {
            time: "14:00",
            "Service at Home": Math.floor((6 + dateHash * 0.4) * multiplier),
            "Service at Location": Math.floor((15 + dateHash * 0.6) * multiplier)
          },
          {
            time: "16:00",
            "Service at Home": Math.floor((5 + dateHash * 0.3) * multiplier),
            "Service at Location": Math.floor((10 + dateHash * 0.4) * multiplier)
          },
          {
            time: "18:00",
            "Service at Home": Math.floor((3 + dateHash * 0.2) * multiplier),
            "Service at Location": Math.floor((7 + dateHash * 0.3) * multiplier)
          },
          {
            time: "20:00",
            "Service at Home": Math.floor((2 + dateHash * 0.1) * multiplier),
            "Service at Location": Math.floor((4 + dateHash * 0.2) * multiplier)
          }
        ],
        topServices: [
          {
            id: 1,
            name: "Balinese Massage",
            bookings: Math.floor((25 + dateHash * 2) * multiplier),
            revenue: Math.floor((15000000 + dateHash * 1000000) * multiplier),
            icon: "💆‍♀️"
          },
          {
            id: 2,
            name: "Facial Treatment",
            bookings: Math.floor((20 + dateHash * 1.5) * multiplier),
            revenue: Math.floor((8000000 + dateHash * 800000) * multiplier),
            icon: "✨"
          },
          {
            id: 3,
            name: "Hair Treatment",
            bookings: Math.floor((18 + dateHash * 1.2) * multiplier),
            revenue: Math.floor((6000000 + dateHash * 600000) * multiplier),
            icon: "💇‍♀️"
          },
          {
            id: 4,
            name: "Body Scrub",
            bookings: Math.floor((15 + dateHash * 1) * multiplier),
            revenue: Math.floor((5000000 + dateHash * 500000) * multiplier),
            icon: "🧴"
          },
          {
            id: 5,
            name: "Aromatherapy",
            bookings: Math.floor((12 + dateHash * 0.8) * multiplier),
            revenue: Math.floor((4000000 + dateHash * 400000) * multiplier),
            icon: "🕯️"
          }
        ],
        topEmployees: [
          {
            id: 1,
            name: "Sari Dewi",
            position: "Senior Therapist",
            workload: Math.floor((28 + dateHash * 2) * multiplier),
            rating: 4.9,
            avatar: "/images/avatars/1.png"
          },
          {
            id: 2,
            name: "Kadek Ayu",
            position: "Facial Specialist",
            workload: Math.floor((24 + dateHash * 1.8) * multiplier),
            rating: 4.8,
            avatar: "/images/avatars/2.png"
          },
          {
            id: 3,
            name: "Ni Luh Putu",
            position: "Hair Stylist",
            workload: Math.floor((22 + dateHash * 1.5) * multiplier),
            rating: 4.7,
            avatar: "/images/avatars/3.png"
          },
          {
            id: 4,
            name: "Made Sutrisna",
            position: "Massage Therapist",
            workload: Math.floor((20 + dateHash * 1.2) * multiplier),
            rating: 4.6,
            avatar: "/images/avatars/4.png"
          },
          {
            id: 5,
            name: "Wayan Sari",
            position: "Body Treatment",
            workload: Math.floor((18 + dateHash * 1) * multiplier),
            rating: 4.5,
            avatar: "/images/avatars/5.png"
          }
        ]
      });
      setLoading(false);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setLoading(false);
    }
  }, [theme.palette, selectedDate]);

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

  const StatCard = ({
    title,
    value,
    icon,
    color = "primary"
  }: {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    color?: "primary" | "secondary" | "success" | "warning" | "error";
  }) => (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <Box display='flex' alignItems='center' justifyContent='space-between'>
          <Box>
            <Typography color='textSecondary' gutterBottom variant='body2'>
              {title}
            </Typography>
            <Typography variant='h4' component='h2'>
              {value}
            </Typography>
          </Box>
          <Box color={`${color}.main`}>{icon}</Box>
        </Box>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Box display='flex' justifyContent='center' alignItems='center' minHeight='400px'>
        <Typography>Loading dashboard...</Typography>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant='h4' component='h1' gutterBottom>
        Dashboard Kalimasada Spa & Salon
      </Typography>

      {/* Date Filter */}
      <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
        <Box display='flex' alignItems='center' gap={2}>
          <Typography variant='h6' component='span'>
            Filter Tanggal:
          </Typography>
          <TextField
            type='date'
            size='small'
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <CalendarToday />
                </InputAdornment>
              )
            }}
            sx={{ minWidth: 200 }}
          />
          <Typography variant='body2' color='textSecondary'>
            Data untuk:{" "}
            {new Date(selectedDate).toLocaleDateString("id-ID", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric"
            })}
            {(() => {
              const dayOfWeek = new Date(selectedDate).getDay();

              return dayOfWeek === 0 || dayOfWeek === 6 ? " (Weekend)" : " (Weekday)";
            })()}
          </Typography>
        </Box>
      </Paper>

      {/* Stats Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title='Appointment Hari Ini'
            value={stats.todayAppointments}
            icon={<CalendarToday fontSize='large' />}
            color='primary'
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title='Pendapatan Bulan Ini'
            value={formatCurrency(stats.monthlyRevenue)}
            icon={<AttachMoney fontSize='large' />}
            color='success'
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title='Total Customer'
            value={stats.totalCustomers}
            icon={<People fontSize='large' />}
            color='secondary'
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title='Total Karyawan'
            value={stats.totalEmployees}
            icon={<Spa fontSize='large' />}
            color='warning'
          />
        </Grid>
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={3} mb={4}>
        {/* Revenue Chart */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant='h6' gutterBottom>
                Pendapatan 6 Bulan Terakhir
              </Typography>
              <ResponsiveContainer width='100%' height={300}>
                <AreaChart data={stats.revenueData}>
                  <CartesianGrid strokeDasharray='3 3' />
                  <XAxis dataKey='name' />
                  <YAxis tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`} />
                  <Tooltip formatter={(value) => [formatCurrency(Number(value)), "Pendapatan"]} />
                  <Area
                    type='monotone'
                    dataKey='revenue'
                    stroke={theme.palette.primary.main}
                    fill={theme.palette.primary.main}
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Service Distribution Chart */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant='h6' gutterBottom>
                Distribusi Layanan
              </Typography>
              <ResponsiveContainer width='100%' height={300}>
                <PieChart>
                  <Pie
                    data={stats.serviceDistribution}
                    cx='50%'
                    cy='50%'
                    outerRadius={80}
                    dataKey='value'
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {stats.serviceDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, "Persentase"]} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Daily Activity Services Chart */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant='h6' gutterBottom>
                Daily Activity Services - Service at Home vs Service at Location
              </Typography>
              <ResponsiveContainer width='100%' height={400}>
                <BarChart data={stats.dailyActivityData}>
                  <CartesianGrid strokeDasharray='3 3' />
                  <XAxis dataKey='time' />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey='Service at Home' stackId='a' fill={theme.palette.primary.main} name='Service at Home' />
                  <Bar
                    dataKey='Service at Location'
                    stackId='a'
                    fill={theme.palette.secondary.main}
                    name='Service at Location'
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Bottom Section */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant='h6' gutterBottom>
                Appointment Mendatang
              </Typography>
              <List>
                {stats.upcomingAppointments.map((appointment) => (
                  <ListItem key={appointment.id} divider>
                    <ListItemAvatar>
                      <Avatar>
                        <Schedule />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box display='flex' alignItems='center' gap={1}>
                          <Typography variant='subtitle1'>{appointment.customerName}</Typography>
                          <Chip label={appointment.time} size='small' color='primary' />
                        </Box>
                      }
                      secondary={
                        <Typography variant='body2' color='textSecondary'>
                          {appointment.serviceName} • {appointment.employee}
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant='h6' gutterBottom>
                Quick Actions
              </Typography>
              <Box display='flex' flexDirection='column' gap={2}>
                <Chip
                  label='Buat Appointment Baru'
                  clickable
                  color='primary'
                  variant='outlined'
                  onClick={() => {
                    /* TODO: Navigate to new appointment */
                  }}
                />
                <Chip
                  label='Tambah Customer Baru'
                  clickable
                  color='secondary'
                  variant='outlined'
                  onClick={() => {
                    /* TODO: Navigate to new customer */
                  }}
                />
                <Chip
                  label='Lihat Jadwal Hari Ini'
                  clickable
                  color='info'
                  variant='outlined'
                  onClick={() => {
                    /* TODO: Navigate to today's schedule */
                  }}
                />
                <Chip
                  label='Generate Payroll'
                  clickable
                  color='warning'
                  variant='outlined'
                  onClick={() => {
                    /* TODO: Navigate to payroll */
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Top 5 Best Seller Services and Top 5 Workload Employees */}
      <Grid container spacing={3} mb={4}>
        {/* Top 5 Best Seller Services */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant='h6' gutterBottom>
                Top 5 Best Seller Services
              </Typography>
              <List>
                {stats.topServices.map((service, index) => (
                  <ListItem key={service.id} divider>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: theme.palette.primary.main }}>{index + 1}</Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box display='flex' alignItems='center' gap={1}>
                          <Typography variant='body1' component='span'>
                            {service.icon}
                          </Typography>
                          <Typography variant='subtitle1' component='span'>
                            {service.name}
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <Box display='flex' justifyContent='space-between' mt={0.5}>
                          <Typography variant='body2' color='textSecondary'>
                            {service.bookings} bookings
                          </Typography>
                          <Typography variant='body2' color='primary.main' fontWeight='bold'>
                            {formatCurrency(service.revenue)}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Top 5 Workload Employees */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant='h6' gutterBottom>
                Top 5 Workload Employees
              </Typography>
              <List>
                {stats.topEmployees.map((employee) => (
                  <ListItem key={employee.id} divider>
                    <ListItemAvatar>
                      <Avatar src={employee.avatar} alt={employee.name}>
                        {employee.name
                          .split(" ")
                          .map((n: string) => n[0])
                          .join("")}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box display='flex' alignItems='center' justifyContent='space-between'>
                          <Box>
                            <Typography variant='subtitle1'>{employee.name}</Typography>
                            <Typography variant='body2' color='textSecondary'>
                              {employee.position}
                            </Typography>
                          </Box>
                          <Box textAlign='right'>
                            <Typography variant='h6' color='primary.main'>
                              {employee.workload}
                            </Typography>
                            <Typography variant='caption' color='textSecondary'>
                              appointments
                            </Typography>
                          </Box>
                        </Box>
                      }
                      secondary={
                        <Box display='flex' alignItems='center' gap={0.5} mt={0.5}>
                          <Typography variant='body2' color='textSecondary'>
                            Rating:
                          </Typography>
                          <Typography variant='body2' color='warning.main' fontWeight='bold'>
                            ⭐ {employee.rating}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
