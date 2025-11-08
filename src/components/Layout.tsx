import type { ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Button,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  PersonAdd as PersonAddIcon,
  List as ListIcon,
  AdminPanelSettings as AdminIcon,
  Info as InfoIcon,
  Logout as LogoutIcon,
  ConfirmationNumber as PassIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';

interface LayoutProps {
  children: ReactNode;
}

const DRAWER_WIDTH = 280;

export default function Layout({ children }: LayoutProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: <DashboardIcon /> },
    { label: 'Event Information', path: '/event-info', icon: <InfoIcon /> },
    { label: 'My Entries', path: '/my-entries', icon: <ListIcon /> },
    { label: 'Add Entry', path: '/add-entry', icon: <PersonAddIcon /> },
    { label: 'Generate & Email Passes', path: '/generate-passes', icon: <PassIcon /> },
    { label: 'Settings', path: '/settings', icon: <SettingsIcon /> },
  ];

  if (user?.role === 'admin') {
    navItems.push({ label: 'Admin Panel', path: '/admin', icon: <AdminIcon /> });
  }

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            background: 'linear-gradient(180deg, #1D4E89 0%, #0D2E59 100%)',
            color: 'white',
          },
        }}
      >
        {/* User Info */}
        <Box sx={{ p: 3, textAlign: 'center', bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 2, m: 2 }}>
          <Typography variant="h6" sx={{ color: '#FFD700', fontWeight: 700, mb: 0.5 }}>
            👤 {user?.organization}
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem' }}>
            @{user?.username}
          </Typography>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', display: 'block', mt: 0.5 }}>
            Role: {user?.role.toUpperCase()}
          </Typography>
        </Box>

        <Divider sx={{ borderColor: 'rgba(255,255,255,0.2)', my: 1 }} />

        {/* Navigation */}
        <Typography variant="subtitle2" sx={{ px: 3, py: 1, color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>
          📋 NAVIGATION
        </Typography>
        <List sx={{ px: 2 }}>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  onClick={() => navigate(item.path)}
                  sx={{
                    borderRadius: 2,
                    bgcolor: isActive ? 'rgba(255,255,255,0.15)' : 'transparent',
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.1)',
                    },
                    py: 1.5,
                  }}
                >
                  <ListItemIcon sx={{ color: isActive ? '#FFD700' : 'rgba(255,255,255,0.7)', minWidth: 40 }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontSize: '0.95rem',
                      fontWeight: isActive ? 600 : 400,
                      color: isActive ? 'white' : 'rgba(255,255,255,0.85)',
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>

        <Box sx={{ flexGrow: 1 }} />

        {/* Logout Button */}
        <Box sx={{ p: 2 }}>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
            sx={{
              color: 'white',
              borderColor: 'rgba(255,255,255,0.3)',
              '&:hover': {
                borderColor: 'white',
                bgcolor: 'rgba(255,255,255,0.1)',
              },
              py: 1,
              borderRadius: 2,
            }}
          >
            Logout
          </Button>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: '#F5F7FA',
          overflow: 'auto',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box sx={{ flexGrow: 1, p: 4 }}>
          {children}
        </Box>

        {/* Footer */}
        <Box sx={{ py: 2, px: 4, bgcolor: '#0D2E59', color: 'white', textAlign: 'center' }}>
          <Typography variant="body2">
            Indian Navy - Swavlamban 2025 | Nov 25-26, 2025 | Manekshaw Centre
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
