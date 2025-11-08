import { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  Button,
  Chip,
  Stack,
  Divider,
  Avatar,
  Skeleton,
  Fade,
  Zoom,
} from '@mui/material';
import {
  People as PeopleIcon,
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  Event as EventIcon,
  PersonAdd as PersonAddIcon,
  List as ListIcon,
  ConfirmationNumber as PassIcon,
  TrendingUp as TrendingUpIcon,
  DateRange as DateRangeIcon,
  Place as PlaceIcon,
  Email as EmailIcon,
} from '@mui/icons-material';
import { PieChart } from '@mui/x-charts/PieChart';
import { BarChart } from '@mui/x-charts/BarChart';
import { useNavigate } from 'react-router-dom';
import { mockApiService } from '../services/mockApi';
import { useAuth } from '../hooks/useAuth';
import type { DashboardStats } from '../types';
import Layout from '../components/Layout';

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await mockApiService.getDashboardStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <Box>
          <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 3, mb: 4 }} />
          <Skeleton variant="text" height={40} width={200} sx={{ mb: 3 }} />
          <Grid container spacing={3}>
            {[1, 2, 3, 4].map((i) => (
              <Grid item xs={12} sm={6} md={3} key={i}>
                <Skeleton variant="rectangular" height={140} sx={{ borderRadius: 3 }} />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Layout>
    );
  }

  const statCards = [
    {
      title: 'Total Entries',
      value: stats?.total_entries || 0,
      icon: <PeopleIcon sx={{ fontSize: 40 }} />,
      color: '#2196F3',
      gradient: 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)',
      bgColor: 'rgba(33, 150, 243, 0.1)',
    },
    {
      title: 'Max Quota',
      value: stats?.max_entries || 0,
      icon: <AssignmentIcon sx={{ fontSize: 40 }} />,
      color: '#4CAF50',
      gradient: 'linear-gradient(135deg, #4CAF50 0%, #388E3C 100%)',
      bgColor: 'rgba(76, 175, 80, 0.1)',
    },
    {
      title: 'Remaining',
      value: stats?.remaining_quota || 0,
      icon: <CheckCircleIcon sx={{ fontSize: 40 }} />,
      color: '#FF9800',
      gradient: 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)',
      bgColor: 'rgba(255, 152, 0, 0.1)',
    },
    {
      title: 'Passes Generated',
      value: stats?.passes_generated || 0,
      icon: <EventIcon sx={{ fontSize: 40 }} />,
      color: '#9C27B0',
      gradient: 'linear-gradient(135deg, #9C27B0 0%, #7B1FA2 100%)',
      bgColor: 'rgba(156, 39, 176, 0.1)',
    },
  ];

  const passData = [
    { id: 0, value: stats?.exhibition_day1_count || 0, label: 'Exhibition Day 1', color: '#E91E63' },
    { id: 1, value: stats?.exhibition_day2_count || 0, label: 'Exhibition Day 2', color: '#673AB7' },
    { id: 2, value: stats?.interactive_sessions_count || 0, label: 'Interactive', color: '#00BCD4' },
    { id: 3, value: stats?.plenary_count || 0, label: 'Plenary', color: '#009688' },
  ];

  const utilizationPercent = stats ? Math.round(((stats.total_entries || 0) / (stats.max_entries || 1)) * 100) : 0;

  return (
    <Layout>
      <Fade in timeout={800}>
        <Box>
          {/* Hero Header */}
          <Paper
            elevation={8}
            sx={{
              background: 'linear-gradient(135deg, #1D4E89 0%, #0D2E59 100%)',
              borderRadius: 4,
              p: 4,
              mb: 4,
              color: 'white',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                right: 0,
                width: '40%',
                height: '100%',
                background: 'rgba(255,255,255,0.05)',
                transform: 'skewX(-10deg)',
              }
            }}
          >
            <Stack direction="row" spacing={3} alignItems="center" sx={{ position: 'relative', zIndex: 1 }}>
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  bgcolor: '#FFD700',
                  fontSize: '2.5rem',
                  boxShadow: 4,
                }}
              >
                🇮🇳
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h3" sx={{ fontWeight: 700, mb: 0.5, letterSpacing: '-0.5px' }}>
                  Swavlamban 2025
                </Typography>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Chip
                    icon={<DateRangeIcon />}
                    label="November 25-26, 2025"
                    sx={{
                      bgcolor: 'rgba(255,255,255,0.2)',
                      color: 'white',
                      fontWeight: 600,
                      '& .MuiChip-icon': { color: '#FFD700' }
                    }}
                  />
                  <Chip
                    icon={<PlaceIcon />}
                    label="Manekshaw Centre"
                    sx={{
                      bgcolor: 'rgba(255,255,255,0.2)',
                      color: 'white',
                      fontWeight: 600,
                      '& .MuiChip-icon': { color: '#FFD700' }
                    }}
                  />
                </Stack>
              </Box>
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="caption" sx={{ opacity: 0.8, display: 'block', mb: 0.5 }}>
                  Quota Utilization
                </Typography>
                <Stack direction="row" spacing={1} alignItems="baseline">
                  <Typography variant="h2" sx={{ fontWeight: 700, color: '#FFD700' }}>
                    {utilizationPercent}
                  </Typography>
                  <Typography variant="h5" sx={{ opacity: 0.9 }}>%</Typography>
                </Stack>
              </Box>
            </Stack>
          </Paper>

          {/* Stats Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {statCards.map((stat, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Zoom in timeout={600 + index * 100}>
                  <Card
                    elevation={4}
                    sx={{
                      height: '100%',
                      background: stat.gradient,
                      color: 'white',
                      borderRadius: 3,
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        transform: 'translateY(-8px) scale(1.02)',
                        boxShadow: 12,
                      },
                      cursor: 'pointer',
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
                        <Box>
                          <Typography variant="body2" sx={{ opacity: 0.9, mb: 1, fontWeight: 500 }}>
                            {stat.title}
                          </Typography>
                          <Typography variant="h2" sx={{ fontWeight: 700, mb: 1 }}>
                            {stat.value}
                          </Typography>
                          <Stack direction="row" spacing={0.5} alignItems="center">
                            <TrendingUpIcon sx={{ fontSize: 16, opacity: 0.8 }} />
                            <Typography variant="caption" sx={{ opacity: 0.8 }}>
                              Updated now
                            </Typography>
                          </Stack>
                        </Box>
                        <Avatar
                          sx={{
                            bgcolor: 'rgba(255,255,255,0.2)',
                            width: 56,
                            height: 56,
                            color: 'white',
                          }}
                        >
                          {stat.icon}
                        </Avatar>
                      </Stack>
                    </CardContent>
                  </Card>
                </Zoom>
              </Grid>
            ))}
          </Grid>

          {/* Quick Actions */}
          <Paper elevation={3} sx={{ p: 4, mb: 4, borderRadius: 3 }}>
            <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
              <Typography variant="h5" sx={{ fontWeight: 700, color: '#1D4E89' }}>
                🚀 Quick Actions
              </Typography>
              <Chip label="3 Actions Available" size="small" color="primary" variant="outlined" />
            </Stack>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  startIcon={<PersonAddIcon />}
                  onClick={() => navigate('/add-entry')}
                  sx={{
                    py: 2.5,
                    background: 'linear-gradient(135deg, #1D4E89 0%, #0D2E59 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #2A5F9E 0%, #1A3D6F 100%)',
                      transform: 'translateY(-2px)',
                      boxShadow: 6,
                    },
                    borderRadius: 2,
                    fontWeight: 600,
                    textTransform: 'none',
                    fontSize: '1.05rem',
                    transition: 'all 0.3s',
                  }}
                >
                  Add New Entry
                </Button>
              </Grid>
              <Grid item xs={12} md={4}>
                <Button
                  fullWidth
                  variant="outlined"
                  size="large"
                  startIcon={<ListIcon />}
                  onClick={() => navigate('/my-entries')}
                  sx={{
                    py: 2.5,
                    borderWidth: 2,
                    borderColor: '#1D4E89',
                    color: '#1D4E89',
                    '&:hover': {
                      borderWidth: 2,
                      borderColor: '#1D4E89',
                      bgcolor: 'rgba(29, 78, 137, 0.04)',
                      transform: 'translateY(-2px)',
                      boxShadow: 4,
                    },
                    borderRadius: 2,
                    fontWeight: 600,
                    textTransform: 'none',
                    fontSize: '1.05rem',
                    transition: 'all 0.3s',
                  }}
                >
                  View My Entries
                </Button>
              </Grid>
              <Grid item xs={12} md={4}>
                <Button
                  fullWidth
                  variant="outlined"
                  size="large"
                  startIcon={<PassIcon />}
                  onClick={() => navigate('/generate-passes')}
                  sx={{
                    py: 2.5,
                    borderWidth: 2,
                    borderColor: '#9C27B0',
                    color: '#9C27B0',
                    '&:hover': {
                      borderWidth: 2,
                      borderColor: '#9C27B0',
                      bgcolor: 'rgba(156, 39, 176, 0.04)',
                      transform: 'translateY(-2px)',
                      boxShadow: 4,
                    },
                    borderRadius: 2,
                    fontWeight: 600,
                    textTransform: 'none',
                    fontSize: '1.05rem',
                    transition: 'all 0.3s',
                  }}
                >
                  Generate & Email Passes
                </Button>
              </Grid>
            </Grid>
          </Paper>

          <Grid container spacing={3} sx={{ mb: 4 }}>
            {/* Pass Distribution - Pie Chart */}
            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ p: 4, borderRadius: 3, height: '100%' }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, color: '#1D4E89', mb: 3 }}>
                  📊 Pass Distribution
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
                  <PieChart
                    series={[
                      {
                        data: passData,
                        highlightScope: { faded: 'global', highlighted: 'item' },
                        faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                        innerRadius: 30,
                        outerRadius: 120,
                        paddingAngle: 2,
                        cornerRadius: 5,
                      },
                    ]}
                    height={300}
                    slotProps={{
                      legend: {
                        direction: 'column',
                        position: { vertical: 'middle', horizontal: 'right' },
                        padding: 0,
                      },
                    }}
                  />
                </Box>
              </Paper>
            </Grid>

            {/* Pass Statistics - Bar Chart */}
            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ p: 4, borderRadius: 3, height: '100%' }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, color: '#1D4E89', mb: 3 }}>
                  📈 Pass Statistics
                </Typography>
                <BarChart
                  xAxis={[{
                    scaleType: 'band',
                    data: ['Exh Day 1', 'Exh Day 2', 'Interactive', 'Plenary'],
                  }]}
                  series={[
                    {
                      data: [
                        stats?.exhibition_day1_count || 0,
                        stats?.exhibition_day2_count || 0,
                        stats?.interactive_sessions_count || 0,
                        stats?.plenary_count || 0,
                      ],
                      color: '#1D4E89',
                    },
                  ]}
                  height={300}
                />
              </Paper>
            </Grid>
          </Grid>

          {/* Event Details */}
          <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, color: '#1D4E89', mb: 3 }}>
              ℹ️ Event Details
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <Stack spacing={1}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <DateRangeIcon color="primary" />
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                      EVENT DATES
                    </Typography>
                  </Stack>
                  <Typography variant="body1" sx={{ fontWeight: 600, fontSize: '1.05rem' }}>
                    November 25-26, 2025
                  </Typography>
                </Stack>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Stack spacing={1}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <PlaceIcon color="primary" />
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                      VENUE
                    </Typography>
                  </Stack>
                  <Typography variant="body1" sx={{ fontWeight: 600, fontSize: '1.05rem' }}>
                    Manekshaw Centre, New Delhi
                  </Typography>
                </Stack>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Stack spacing={1}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <EventIcon color="primary" />
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                      HALLS
                    </Typography>
                  </Stack>
                  <Typography variant="body1" sx={{ fontWeight: 600, fontSize: '1.05rem' }}>
                    Zorawar Hall & Exhibition Hall
                  </Typography>
                </Stack>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Stack spacing={1}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <EmailIcon color="primary" />
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                      SUPPORT
                    </Typography>
                  </Stack>
                  <Typography variant="body1" sx={{ fontWeight: 600, fontSize: '1.05rem' }}>
                    niio-tdac@navy.gov.in
                  </Typography>
                </Stack>
              </Grid>
            </Grid>
          </Paper>
        </Box>
      </Fade>
    </Layout>
  );
}
