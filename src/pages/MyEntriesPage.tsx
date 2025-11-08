import { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Email as EmailIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { mockApiService } from '../services/mockApi';
import type { Entry } from '../types';
import Layout from '../components/Layout';

export default function MyEntriesPage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState<number | null>(null);
  const [generateDialog, setGenerateDialog] = useState<Entry | null>(null);
  const [generating, setGenerating] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    try {
      const data = await mockApiService.getMyEntries();
      setEntries(data);
    } catch (error) {
      console.error('Failed to load entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteDialog) return;

    try {
      await mockApiService.deleteEntry(deleteDialog);
      setMessage({ type: 'success', text: 'Entry deleted successfully' });
      loadEntries();
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete entry' });
    } finally {
      setDeleteDialog(null);
    }
  };

  const handleGeneratePasses = async (sendEmail: boolean) => {
    if (!generateDialog) return;

    setGenerating(true);
    try {
      const result = await mockApiService.generatePasses(generateDialog.id, sendEmail);
      setMessage({ type: 'success', text: result.message });
      loadEntries();
      setGenerateDialog(null);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to generate passes' });
    } finally {
      setGenerating(false);
    }
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'phone', headerName: 'Phone', width: 150 },
    {
      field: 'passes',
      headerName: 'Passes',
      width: 300,
      renderCell: (params) => (
        <Box display="flex" gap={0.5} flexWrap="wrap">
          {params.row.exhibition_day1 && <Chip label="Exh Day 1" size="small" color="primary" />}
          {params.row.exhibition_day2 && <Chip label="Exh Day 2" size="small" color="secondary" />}
          {params.row.interactive_sessions && <Chip label="Interactive" size="small" color="info" />}
          {params.row.plenary && <Chip label="Plenary" size="small" color="success" />}
        </Box>
      ),
    },
    {
      field: 'generated',
      headerName: 'Generated',
      width: 120,
      renderCell: (params) => {
        const hasGenerated = params.row.pass_generated_exhibition_day1 ||
          params.row.pass_generated_exhibition_day2 ||
          params.row.pass_generated_interactive_sessions ||
          params.row.pass_generated_plenary;

        return hasGenerated ? (
          <Chip icon={<CheckCircleIcon />} label="Yes" color="success" size="small" />
        ) : (
          <Chip icon={<CancelIcon />} label="No" color="default" size="small" />
        );
      },
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <Box>
          <IconButton
            color="primary"
            onClick={() => setGenerateDialog(params.row)}
            title="Generate & Send Passes"
          >
            <EmailIcon />
          </IconButton>
          <IconButton
            color="error"
            onClick={() => setDeleteDialog(params.row.id)}
            title="Delete Entry"
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Layout>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: '#1D4E89' }}>
          My Entries
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your registered attendees
        </Typography>
      </Box>

      {message && (
        <Alert severity={message.type} sx={{ mb: 3 }} onClose={() => setMessage(null)}>
          {message.text}
        </Alert>
      )}

      <Paper sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={entries}
          columns={columns}
          loading={loading}
          pageSizeOptions={[10, 25, 50]}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
          }}
          disableRowSelectionOnClick
        />
      </Paper>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog !== null} onClose={() => setDeleteDialog(null)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this entry? This action cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog(null)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Generate Passes Dialog */}
      <Dialog open={generateDialog !== null} onClose={() => !generating && setGenerateDialog(null)}>
        <DialogTitle>Generate & Send Passes</DialogTitle>
        <DialogContent>
          <Typography gutterBottom>
            Generate passes for: <strong>{generateDialog?.name}</strong>
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Email: {generateDialog?.email}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setGenerateDialog(null)} disabled={generating}>
            Cancel
          </Button>
          <Button
            onClick={() => handleGeneratePasses(false)}
            disabled={generating}
            variant="outlined"
          >
            Generate Only
          </Button>
          <Button
            onClick={() => handleGeneratePasses(true)}
            disabled={generating}
            variant="contained"
            sx={{ background: 'linear-gradient(135deg, #1D4E89 0%, #0D2E59 100%)' }}
          >
            {generating ? <CircularProgress size={24} /> : 'Generate & Email'}
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
}
