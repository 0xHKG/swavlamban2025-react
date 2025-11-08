import { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { mockApiService } from '../services/mockApi';
import type { User, Entry } from '../types';
import Layout from '../components/Layout';

export default function AdminPanelPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [usersData, entriesData] = await Promise.all([
        mockApiService.getAllUsers(),
        mockApiService.getAllEntries(),
      ]);
      setUsers(usersData);
      setEntries(entriesData);
    } catch (error) {
      console.error('Failed to load admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const userColumns: GridColDef[] = [
    { field: 'username', headerName: 'Username', width: 150 },
    { field: 'organization', headerName: 'Organization', width: 200 },
    { field: 'role', headerName: 'Role', width: 100 },
    { field: 'max_entries', headerName: 'Max Entries', width: 120 },
    {
      field: 'is_active',
      headerName: 'Status',
      width: 100,
      renderCell: (params) => (
        <Typography color={params.value ? 'success.main' : 'error.main'}>
          {params.value ? 'Active' : 'Inactive'}
        </Typography>
      ),
    },
  ];

  const entryColumns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'username', headerName: 'User', width: 120 },
    { field: 'name', headerName: 'Name', width: 180 },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'phone', headerName: 'Phone', width: 150 },
  ];

  const stats = [
    { label: 'Total Users', value: users.length, color: '#1976d2' },
    { label: 'Total Entries', value: entries.length, color: '#388e3c' },
    { label: 'Active Users', value: users.filter(u => u.is_active).length, color: '#f57c00' },
    { label: 'Admin Users', value: users.filter(u => u.role === 'admin').length, color: '#7b1fa2' },
  ];

  return (
    <Layout>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: '#1D4E89' }}>
          Admin Panel
        </Typography>
        <Typography variant="body1" color="text.secondary">
          System overview and management
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ background: `linear-gradient(135deg, ${stat.color} 0%, ${stat.color}CC 100%)`, color: 'white' }}>
              <CardContent>
                <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                  {stat.value}
                </Typography>
                <Typography variant="body2">{stat.label}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Paper sx={{ mb: 3, p: 2 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
          All Users
        </Typography>
        <Box sx={{ height: 400 }}>
          <DataGrid
            rows={users}
            columns={userColumns}
            loading={loading}
            getRowId={(row) => row.username}
            pageSizeOptions={[5, 10, 25]}
            initialState={{
              pagination: { paginationModel: { pageSize: 5 } },
            }}
          />
        </Box>
      </Paper>

      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
          All Entries
        </Typography>
        <Box sx={{ height: 500 }}>
          <DataGrid
            rows={entries}
            columns={entryColumns}
            loading={loading}
            pageSizeOptions={[10, 25, 50]}
            initialState={{
              pagination: { paginationModel: { pageSize: 10 } },
            }}
          />
        </Box>
      </Paper>
    </Layout>
  );
}
