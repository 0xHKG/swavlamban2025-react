import Layout from '../components/Layout';
import { Box, Typography, Paper } from '@mui/material';

export default function SettingsPage() {
  return (
    <Layout>
      <Box>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: '#1D4E89', mb: 3 }}>
          ⚙️ Settings
        </Typography>

        <Paper sx={{ p: 4, borderRadius: 3 }}>
          <Typography variant="body1" color="text.secondary">
            Settings and configuration options will be implemented here.
          </Typography>
        </Paper>
      </Box>
    </Layout>
  );
}
