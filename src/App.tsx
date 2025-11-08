import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider, theme } from 'antd';
import { AuthProvider, useAuth } from './hooks/useAuth';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import AddEntryPage from './pages/AddEntryPage';
import MyEntriesPage from './pages/MyEntriesPage';
import AdminPanelPage from './pages/AdminPanelPage';
import EventInfoPage from './pages/EventInfoPage';
import GeneratePassesPage from './pages/GeneratePassesPage';
import SettingsPage from './pages/SettingsPage';
import 'antd/dist/reset.css';

// Dark theme configuration for Ant Design
const antTheme = {
  algorithm: theme.darkAlgorithm, // Use built-in dark theme
  token: {
    colorPrimary: '#667eea',
    colorSuccess: '#43e97b',
    colorWarning: '#fbbf24',
    colorError: '#f5576c',
    colorInfo: '#4facfe',
    colorBgBase: '#0f172a', // Deep blue-black background
    colorBgContainer: '#1e293b', // Card/container background
    colorBorder: 'rgba(255,255,255,0.1)', // Subtle borders
    colorText: '#e2e8f0', // Light text for readability
    colorTextSecondary: '#94a3b8', // Muted secondary text
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
    borderRadius: 12,
    fontSize: 14,
  },
  components: {
    Table: {
      colorBgContainer: 'rgba(30, 41, 59, 0.5)',
      colorText: '#e2e8f0',
      colorTextHeading: '#e2e8f0',
      borderColor: 'rgba(255,255,255,0.1)',
    },
    Card: {
      colorBgContainer: 'rgba(30, 41, 59, 0.5)',
      colorBorderSecondary: 'rgba(255,255,255,0.1)',
    },
    Input: {
      colorBgContainer: 'rgba(15, 23, 42, 0.5)',
      colorText: '#e2e8f0',
      colorTextPlaceholder: 'rgba(148, 163, 184, 0.6)',
      colorBorder: 'rgba(255,255,255,0.2)',
    },
    Select: {
      colorBgContainer: 'rgba(15, 23, 42, 0.5)',
      colorText: '#e2e8f0',
      colorTextPlaceholder: 'rgba(148, 163, 184, 0.6)',
      colorBorder: 'rgba(255,255,255,0.2)',
    },
    Button: {
      colorPrimary: '#667eea',
      colorPrimaryHover: '#764ba2',
      colorText: '#e2e8f0',
    },
  },
};

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
    <ConfigProvider theme={antTheme}>
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default App
