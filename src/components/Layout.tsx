import type { ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  PersonAdd as PersonAddIcon,
  List as ListIcon,
  AdminPanelSettings as AdminIcon,
  Info as InfoIcon,
  Logout as LogoutIcon,
  AccountCircle,
} from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';
import { useState } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: <DashboardIcon /> },
    { label: 'Add Entry', path: '/add-entry', icon: <PersonAddIcon /> },
    { label: 'My Entries', path: '/my-entries', icon: <ListIcon /> },
    { label: 'Event Info', path: '/event-info', icon: <InfoIcon /> },
  ];

  if (user?.role === 'admin') {
    navItems.push({ label: 'Admin Panel', path: '/admin', icon: <AdminIcon /> });
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static" sx={{ background: 'linear-gradient(135deg, #1D4E89 0%, #0D2E59 100%)' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 0, mr: 4, fontWeight: 700 }}>
            🇮🇳 Swavlamban 2025
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {navItems.map((item) => (
              <Button
                key={item.path}
                color="inherit"
                startIcon={item.icon}
                onClick={() => navigate(item.path)}
                sx={{
                  mx: 0.5,
                  fontWeight: location.pathname === item.path ? 700 : 400,
                  borderBottom: location.pathname === item.path ? '2px solid #FFD700' : 'none',
                  borderRadius: 0,
                }}
              >
                {item.label}
              </Button>
            ))}
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2" sx={{ display: { xs: 'none', sm: 'block' } }}>
              {user?.organization} | {user?.username}
            </Typography>
            <IconButton color="inherit" onClick={handleMenu}>
              <AccountCircle />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem disabled>
                <Typography variant="caption" color="text.secondary">
                  {user?.organization}
                </Typography>
              </MenuItem>
              <MenuItem disabled>
                <Typography variant="caption" color="text.secondary">
                  {user?.username} ({user?.role})
                </Typography>
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      <Box component="main" sx={{ flexGrow: 1, bgcolor: '#F5F7FA', py: 4 }}>
        <Container maxWidth="xl">
          {children}
        </Container>
      </Box>

      <Box component="footer" sx={{ py: 2, bgcolor: '#0D2E59', color: 'white', textAlign: 'center' }}>
        <Typography variant="body2">
          Indian Navy - Swavlamban 2025 | Nov 25-26, 2025 | Manekshaw Centre
        </Typography>
      </Box>
    </Box>
  );
}
