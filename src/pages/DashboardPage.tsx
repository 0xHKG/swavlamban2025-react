import { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  CircularProgress,
  Card,
  CardContent,
} from '@mui/material';
import {
  People as PeopleIcon,
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  Event as EventIcon,
} from '@mui/icons-material';
import { apiService } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import type { DashboardStats } from '../types';
import Layout from '../components/Layout';

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await apiService.getDashboardStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = stats ? [
    {
      title: 'Total Entries',
      value: stats.total_entries,
      icon: <PeopleIcon sx={{ fontSize: 40 }} />,
      color: '#1976d2',
    },
    {
      title: 'Max Quota',
      value: stats.max_entries,
      icon: <AssignmentIcon sx={{ fontSize: 40 }} />,
      color: '#388e3c',
    },
    {
      title: 'Remaining',
      value: stats.remaining_quota,
      icon: <CheckCircleIcon sx={{ fontSize: 40 }} />,
      color: '#f57c00',
    },
    {
      title: 'Passes Generated',
      value: stats.passes_generated,
      icon: <EventIcon sx={{ fontSize: 40 }} />,
      color: '#7b1fa2',
    },
  ] : [];

  const passStats = stats ? [
    { label: 'Exhibition Day 1', value: stats.exhibition_day1_count, color: '#e91e63' },
    { label: 'Exhibition Day 2', value: stats.exhibition_day2_count, color: '#9c27b0' },
    { label: 'Interactive Sessions', value: stats.interactive_sessions_count, color: '#3f51b5' },
    { label: 'Plenary Session', value: stats.plenary_count, color: '#00bcd4' },
  ] : [];

  if (loading) {
    return (
      <Layout>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: '#1D4E89' }}>
          Welcome, {user?.username}!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {user?.organization} | Role: {user?.role}
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statCards.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ height: '100%', background: `linear-gradient(135deg, ${stat.color} 0%, ${stat.color}CC 100%)`, color: 'white' }}>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                      {stat.value}
                    </Typography>
                    <Typography variant="body2">
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

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
          Pass Distribution
        </Typography>
        <Grid container spacing={2}>
          {passStats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Box
                sx={{
                  p: 2,
                  borderRadius: 1,
                  bgcolor: `${stat.color}15`,
                  borderLeft: `4px solid ${stat.color}`,
                }}
              >
                <Typography variant="h4" sx={{ fontWeight: 700, color: stat.color }}>
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

      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
          Event Details
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="body2" color="text.secondary">📅 Date</Typography>
            <Typography variant="body1" sx={{ fontWeight: 600 }}>November 25-26, 2025</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body2" color="text.secondary">📍 Venue</Typography>
            <Typography variant="body1" sx={{ fontWeight: 600 }}>Manekshaw Centre, New Delhi</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body2" color="text.secondary">🏛️ Halls</Typography>
            <Typography variant="body1" sx={{ fontWeight: 600 }}>Zorawar Hall & Exhibition Hall</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body2" color="text.secondary">📧 Support</Typography>
            <Typography variant="body1" sx={{ fontWeight: 600 }}>niio-tdac@navy.gov.in</Typography>
          </Grid>
        </Grid>
      </Paper>
    </Layout>
  );
}
