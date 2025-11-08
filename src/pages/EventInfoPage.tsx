import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Divider,
} from '@mui/material';
import {
  LocationOn,
  CalendarToday,
  AccessTime,
  Phone,
  Email,
} from '@mui/icons-material';
import Layout from '../components/Layout';

export default function EventInfoPage() {
  return (
    <Layout>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: '#1D4E89' }}>
          Event Information
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Everything you need to know about Swavlamban 2025
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <CalendarToday sx={{ mr: 1, color: '#1D4E89' }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Event Dates
                </Typography>
              </Box>
              <Typography variant="body1" gutterBottom>
                <strong>Day 1:</strong> November 25, 2025 (Monday)
              </Typography>
              <Typography variant="body1">
                <strong>Day 2:</strong> November 26, 2025 (Tuesday)
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <LocationOn sx={{ mr: 1, color: '#1D4E89' }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Venue
                </Typography>
              </Box>
              <Typography variant="body1" gutterBottom>
                <strong>Manekshaw Centre</strong>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Parade Road, Delhi Cantonment
              </Typography>
              <Typography variant="body2" color="text.secondary">
                New Delhi - 110010
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
              Event Schedule
            </Typography>

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1D4E89', mb: 1 }}>
                Day 1 - November 25, 2025
              </Typography>
              <Box sx={{ pl: 2 }}>
                <Box display="flex" alignItems="center" mb={1}>
                  <AccessTime sx={{ mr: 1, fontSize: 20 }} />
                  <Typography variant="body2">
                    <strong>1100 - 1730 hrs:</strong> Exhibition (Exhibition Hall)
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1D4E89', mb: 1 }}>
                Day 2 - November 26, 2025
              </Typography>
              <Box sx={{ pl: 2 }}>
                <Box display="flex" alignItems="center" mb={1}>
                  <AccessTime sx={{ mr: 1, fontSize: 20 }} />
                  <Typography variant="body2">
                    <strong>1000 - 1730 hrs:</strong> Exhibition (Exhibition Hall)
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center" mb={1}>
                  <AccessTime sx={{ mr: 1, fontSize: 20 }} />
                  <Typography variant="body2">
                    <strong>1030 - 1130 hrs:</strong> Interactive Session I (Zorawar Hall)
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center" mb={1}>
                  <AccessTime sx={{ mr: 1, fontSize: 20 }} />
                  <Typography variant="body2">
                    <strong>1200 - 1330 hrs:</strong> Interactive Session II (Zorawar Hall)
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center" mb={1}>
                  <AccessTime sx={{ mr: 1, fontSize: 20 }} />
                  <Typography variant="body2">
                    <strong>1625 - 1755 hrs:</strong> Plenary Session (Zorawar Hall)
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
              Contact Information
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Box display="flex" alignItems="center">
                  <Phone sx={{ mr: 2, color: '#1D4E89' }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Phone
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      011-26771528
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Box display="flex" alignItems="center">
                  <Email sx={{ mr: 2, color: '#1D4E89' }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Email
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      niio-tdac@navy.gov.in
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Card sx={{ background: 'linear-gradient(135deg, #1D4E89 0%, #0D2E59 100%)', color: 'white' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                About Swavlamban 2025
              </Typography>
              <Typography variant="body2">
                Swavlamban 2025 is the Indian Navy's flagship seminar on naval innovation and indigenisation.
                The event brings together industry leaders, defense experts, and innovators to discuss
                self-reliance in naval capabilities and showcase cutting-edge technologies.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
}
