import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Box } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider, useAuth } from './hooks/useAuth';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import AddEntryPage from './pages/AddEntryPage';
import MyEntriesPage from './pages/MyEntriesPage';
import AdminPanelPage from './pages/AdminPanelPage';
import EventInfoPage from './pages/EventInfoPage';
import GeneratePassesPage from './pages/GeneratePassesPage';
import SettingsPage from './pages/SettingsPage';

// Indian Navy theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1D4E89',
      dark: '#0D2E59',
      light: '#2A5F9E',
    },
    secondary: {
      main: '#FFD700',
    },
    background: {
      default: '#F5F7FA',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
    },
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});

// Protected Route wrapper
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { token, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

// Admin Route wrapper
function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, token, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  const { token } = useAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={token ? <Navigate to="/dashboard" replace /> : <LoginPage />}
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/add-entry"
        element={
          <ProtectedRoute>
            <AddEntryPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-entries"
        element={
          <ProtectedRoute>
            <MyEntriesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/event-info"
        element={
          <ProtectedRoute>
            <EventInfoPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/generate-passes"
        element={
          <ProtectedRoute>
            <GeneratePassesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminPanelPage />
          </AdminRoute>
        }
      />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ width: '100vw', overflowX: 'hidden' }}>
        <BrowserRouter>
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </BrowserRouter>
      </Box>
    </ThemeProvider>
  );
}

export default App
