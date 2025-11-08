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
} from '@mui/material';
import {
  People as PeopleIcon,
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  Event as EventIcon,
  PersonAdd as PersonAddIcon,
  List as ListIcon,
  ConfirmationNumber as PassIcon,
} from '@mui/icons-material';
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
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

  const statCards = [
    {
      title: 'Total Entries',
      value: stats?.total_entries || 0,
      icon: <PeopleIcon sx={{ fontSize: 50, opacity: 0.3 }} />,
      color: '#2196F3',
    },
    {
      title: 'Max Quota',
      value: stats?.max_entries || 0,
      icon: <AssignmentIcon sx={{ fontSize: 50, opacity: 0.3 }} />,
      color: '#4CAF50',
    },
    {
      title: 'Remaining',
      value: stats?.remaining_quota || 0,
      icon: <CheckCircleIcon sx={{ fontSize: 50, opacity: 0.3 }} />,
      color: '#FF9800',
    },
    {
      title: 'Passes Generated',
      value: stats?.passes_generated || 0,
      icon: <EventIcon sx={{ fontSize: 50, opacity: 0.3 }} />,
      color: '#9C27B0',
    },
  ];

  const passStats = [
    { label: 'Exhibition Day 1', value: stats?.exhibition_day1_count || 0, color: '#E91E63' },
    { label: 'Exhibition Day 2', value: stats?.exhibition_day2_count || 0, color: '#673AB7' },
    { label: 'Interactive Sessions', value: stats?.interactive_sessions_count || 0, color: '#00BCD4' },
    { label: 'Plenary Session', value: stats?.plenary_count || 0, color: '#009688' },
  ];

  return (
    <Layout>
      <Box>
        {/* Page Header */}
        <Box sx={{
          background: 'linear-gradient(135deg, #1D4E89 0%, #0D2E59 100%)',
          borderRadius: 3,
          p: 3,
          mb: 4,
          color: 'white',
          textAlign: 'center',
          boxShadow: '0 4px 12px rgba(29, 78, 137, 0.3)'
        }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
            🇮🇳 Swavlamban 2025
          </Typography>
          <Typography variant="h6" sx={{ color: '#FFD700' }}>
            November 25-26, 2025 | Registration System
          </Typography>
        </Box>

        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
          📊 Dashboard
        </Typography>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {statCards.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card sx={{
                bgcolor: stat.color,
                color: 'white',
                borderRadius: 3,
                boxShadow: 3,
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 6,
                }
              }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                        {stat.value}
                      </Typography>
                      <Typography variant="body1">
                        {stat.title}
                      </Typography>
                    </Box>
                    {stat.icon}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Quick Actions */}
        <Paper sx={{ p: 4, mb: 4, borderRadius: 3, boxShadow: 2 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
            🚀 Quick Actions
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Button
                fullWidth
                variant="contained"
                size="large"
                startIcon={<PersonAddIcon />}
                onClick={() => navigate('/add-entry')}
                sx={{
                  py: 2,
                  background: 'linear-gradient(135deg, #1D4E89 0%, #0D2E59 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #2A5F9E 0%, #1A3D6F 100%)',
                    transform: 'translateY(-2px)',
                    boxShadow: 4,
                  },
                  borderRadius: 2,
                  fontWeight: 600,
                  textTransform: 'none',
                  fontSize: '1rem',
                  transition: 'all 0.2s',
                }}
              >
                Add New Entry
              </Button>
            </Grid>
            <Grid item xs={12} md={4}>
              <Button
                fullWidth
                variant="contained"
                size="large"
                startIcon={<ListIcon />}
                onClick={() => navigate('/my-entries')}
                sx={{
                  py: 2,
                  background: 'linear-gradient(135deg, #1D4E89 0%, #0D2E59 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #2A5F9E 0%, #1A3D6F 100%)',
                    transform: 'translateY(-2px)',
                    boxShadow: 4,
                  },
                  borderRadius: 2,
                  fontWeight: 600,
                  textTransform: 'none',
                  fontSize: '1rem',
                  transition: 'all 0.2s',
                }}
              >
                View My Entries
              </Button>
            </Grid>
            <Grid item xs={12} md={4}>
              <Button
                fullWidth
                variant="contained"
                size="large"
                startIcon={<PassIcon />}
                onClick={() => navigate('/generate-passes')}
                sx={{
                  py: 2,
                  background: 'linear-gradient(135deg, #1D4E89 0%, #0D2E59 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #2A5F9E 0%, #1A3D6F 100%)',
                    transform: 'translateY(-2px)',
                    boxShadow: 4,
                  },
                  borderRadius: 2,
                  fontWeight: 600,
                  textTransform: 'none',
                  fontSize: '1rem',
                  transition: 'all 0.2s',
                }}
              >
                Generate & Email Passes
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Pass Distribution */}
        <Paper sx={{ p: 4, mb: 4, borderRadius: 3, boxShadow: 2 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
            Pass Distribution
          </Typography>
          <Grid container spacing={3}>
            {passStats.map((stat, index) => (
              <Grid item xs={6} md={3} key={index}>
                <Box sx={{
                  borderLeft: `4px solid ${stat.color}`,
                  pl: 2,
                  bgcolor: `${stat.color}15`,
                  py: 2.5,
                  borderRadius: 1.5,
                  transition: 'all 0.2s',
                  '&:hover': {
                    bgcolor: `${stat.color}25`,
                    transform: 'translateX(4px)',
                  }
                }}>
                  <Typography variant="h3" sx={{ color: stat.color, fontWeight: 700, mb: 0.5 }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {stat.label}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Paper>

        {/* Event Details */}
        <Paper sx={{ p: 4, borderRadius: 3, boxShadow: 2 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
            Event Details
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={3}>
              <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5 }}>
                📅 Date
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                November 25-26, 2025
              </Typography>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5 }}>
                📍 Venue
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                Manekshaw Centre, New Delhi
              </Typography>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5 }}>
                🏛️ Halls
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                Zorawar Hall & Exhibition Hall
              </Typography>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5 }}>
                📧 Support
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                niio-tdac@navy.gov.in
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Layout>
  );
}
