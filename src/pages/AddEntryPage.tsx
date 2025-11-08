import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Alert,
  CircularProgress,
} from '@mui/material';
import { mockApiService } from '../services/mockApi';
import { useAuth } from '../hooks/useAuth';
import Layout from '../components/Layout';

export default function AddEntryPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    id_type: 'Aadhaar',
    id_number: '',
    exhibition_day1: false,
    exhibition_day2: false,
    interactive_sessions: false,
    plenary: false,
  });

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await mockApiService.createEntry(formData);
      setSuccess('Entry created successfully!');
      setTimeout(() => navigate('/my-entries'), 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to create entry');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: '#1D4E89' }}>
          Add New Entry
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Fill in the details to create a new registration entry
        </Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}

      <Paper sx={{ p: 4 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Full Name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Phone Number"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="+91-9876543210"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                type="email"
                label="Email Address"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>ID Type</InputLabel>
                <Select
                  value={formData.id_type}
                  label="ID Type"
                  onChange={(e) => handleChange('id_type', e.target.value)}
                >
                  <MenuItem value="Aadhaar">Aadhaar</MenuItem>
                  <MenuItem value="PAN">PAN Card</MenuItem>
                  <MenuItem value="Passport">Passport</MenuItem>
                  <MenuItem value="Driving License">Driving License</MenuItem>
                  <MenuItem value="Voter ID">Voter ID</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="ID Number"
                value={formData.id_number}
                onChange={(e) => handleChange('id_number', e.target.value)}
                placeholder={formData.id_type === 'Aadhaar' ? '1111-2222-3333' : 'Enter ID number'}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2, mb: 1 }}>
                Select Passes
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Choose the event sessions this attendee will participate in
              </Typography>
            </Grid>

            {user?.allowed_passes.exhibition_day1 && (
              <Grid item xs={12} sm={6} md={3}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.exhibition_day1}
                      onChange={(e) => handleChange('exhibition_day1', e.target.checked)}
                    />
                  }
                  label={
                    <Box>
                      <Typography variant="body1">Exhibition Day 1</Typography>
                      <Typography variant="caption" color="text.secondary">
                        25 Nov 2025
                      </Typography>
                    </Box>
                  }
                />
              </Grid>
            )}

            {user?.allowed_passes.exhibition_day2 && (
              <Grid item xs={12} sm={6} md={3}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.exhibition_day2}
                      onChange={(e) => handleChange('exhibition_day2', e.target.checked)}
                    />
                  }
                  label={
                    <Box>
                      <Typography variant="body1">Exhibition Day 2</Typography>
                      <Typography variant="caption" color="text.secondary">
                        26 Nov 2025
                      </Typography>
                    </Box>
                  }
                />
              </Grid>
            )}

            {user?.allowed_passes.interactive_sessions && (
              <Grid item xs={12} sm={6} md={3}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.interactive_sessions}
                      onChange={(e) => handleChange('interactive_sessions', e.target.checked)}
                    />
                  }
                  label={
                    <Box>
                      <Typography variant="body1">Interactive Sessions</Typography>
                      <Typography variant="caption" color="text.secondary">
                        26 Nov 2025 (AM)
                      </Typography>
                    </Box>
                  }
                />
              </Grid>
            )}

            {user?.allowed_passes.plenary && (
              <Grid item xs={12} sm={6} md={3}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.plenary}
                      onChange={(e) => handleChange('plenary', e.target.checked)}
                    />
                  }
                  label={
                    <Box>
                      <Typography variant="body1">Plenary Session</Typography>
                      <Typography variant="caption" color="text.secondary">
                        26 Nov 2025 (PM)
                      </Typography>
                    </Box>
                  }
                />
              </Grid>
            )}

            <Grid item xs={12}>
              <Box display="flex" gap={2} justifyContent="flex-end" sx={{ mt: 2 }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/my-entries')}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  sx={{
                    px: 4,
                    background: 'linear-gradient(135deg, #1D4E89 0%, #0D2E59 100%)',
                  }}
                >
                  {loading ? <CircularProgress size={24} /> : 'Create Entry'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Layout>
  );
}
