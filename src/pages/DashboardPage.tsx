import { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  CircularProgress,
  Button,
  Divider,
} from '@mui/material';
import {
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

  return (
    <Layout>
      <Box>
        {/* Page Title */}
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
          📊 Dashboard
        </Typography>

        {/* Metrics Row */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'white', boxShadow: 1 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontSize: '0.9rem' }}>
                Total Entries
              </Typography>
              <Typography variant="h3" sx={{ color: '#2196F3', fontWeight: 700 }}>
                {stats?.total_entries || 0}
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'white', boxShadow: 1 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontSize: '0.9rem' }}>
                Max Quota
              </Typography>
              <Typography variant="h3" sx={{ color: '#4CAF50', fontWeight: 700 }}>
                {stats?.max_entries || 0}
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'white', boxShadow: 1 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontSize: '0.9rem' }}>
                Remaining
              </Typography>
              <Typography variant="h3" sx={{ color: '#FF9800', fontWeight: 700 }}>
                {stats?.remaining_quota || 0}
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'white', boxShadow: 1 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontSize: '0.9rem' }}>
                Passes Generated
              </Typography>
              <Typography variant="h3" sx={{ color: '#9C27B0', fontWeight: 700 }}>
                {stats?.passes_generated || 0}
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* Quick Actions */}
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
          🚀 Quick Actions
        </Typography>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={4}>
            <Button
              fullWidth
              variant="contained"
              size="large"
              startIcon={<PersonAddIcon />}
              onClick={() => navigate('/add-entry')}
              sx={{
                py: 1.5,
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 500,
              }}
            >
              ➕ Add New Entry
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
                py: 1.5,
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 500,
              }}
            >
              📝 View My Entries
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
                py: 1.5,
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 500,
              }}
            >
              🎫 Generate & Email Passes
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Layout>
  );
}
