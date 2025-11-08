import type { ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Layout as AntLayout, Menu, Button, Typography, Avatar } from 'antd';
import {
  DashboardOutlined,
  UserAddOutlined,
  UnorderedListOutlined,
  ControlOutlined,
  InfoCircleOutlined,
  LogoutOutlined,
  MailOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { useAuth } from '../hooks/useAuth';

const { Sider, Content, Footer } = AntLayout;
const { Text } = Typography;

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: '/event-info',
      icon: <InfoCircleOutlined />,
      label: 'Event Information',
    },
    {
      key: '/my-entries',
      icon: <UnorderedListOutlined />,
      label: 'My Entries',
    },
    {
      key: '/add-entry',
      icon: <UserAddOutlined />,
      label: 'Add Entry',
    },
    {
      key: '/generate-passes',
      icon: <MailOutlined />,
      label: 'Generate & Email Passes',
    },
    {
      key: '/settings',
      icon: <SettingOutlined />,
      label: 'Settings',
    },
  ];

  if (user?.role === 'admin') {
    menuItems.push({
      key: '/admin',
      icon: <ControlOutlined />,
      label: 'Admin Panel',
    });
  }

  return (
    <AntLayout hasSider style={{ minHeight: '100vh' }}>
      <Sider
        width={280}
        style={{
          background: 'linear-gradient(180deg, #1e3a8a 0%, #1e293b 100%)',
          boxShadow: '4px 0 24px rgba(0,0,0,0.3)',
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        {/* Logo */}
        <div
          style={{
            padding: '24px 20px',
            textAlign: 'center',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          <img
            src="/IN.png"
            alt="Indian Navy Logo"
            style={{
              width: '80px',
              height: '80px',
              objectFit: 'contain',
              marginBottom: 12,
            }}
          />
          <div style={{ color: '#fbbf24', fontWeight: 700, fontSize: 16, marginBottom: 4 }}>
            Swavlamban 2025
          </div>
          <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>
            Indian Navy
          </Text>
        </div>

        {/* User Info Card */}
        <div
          style={{
            padding: '20px',
            textAlign: 'center',
            background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.15) 0%, rgba(102, 126, 234, 0.15) 100%)',
            borderRadius: 12,
            margin: '20px 16px',
            border: '1px solid rgba(251, 191, 36, 0.2)',
          }}
        >
          <Avatar
            size={56}
            style={{
              backgroundColor: '#fbbf24',
              color: '#1e3a8a',
              marginBottom: 12,
              fontWeight: 700,
              fontSize: 24,
            }}
          >
            {user?.organization?.charAt(0) || 'U'}
          </Avatar>
          <div style={{ color: '#fbbf24', fontWeight: 700, fontSize: 18, marginBottom: 6 }}>
            {user?.organization}
          </div>
          <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>
            @{user?.username}
          </Text>
          <div
            style={{
              color: 'rgba(255,255,255,0.5)',
              fontSize: 11,
              marginTop: 8,
              padding: '4px 12px',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: 12,
              display: 'inline-block',
            }}
          >
            {user?.role.toUpperCase()}
          </div>
        </div>

        {/* Navigation Label */}
        <div
          style={{
            padding: '12px 24px 8px',
            color: 'rgba(255,255,255,0.5)',
            fontWeight: 600,
            fontSize: 11,
            letterSpacing: '0.5px',
          }}
        >
          📋 NAVIGATION
        </div>

        {/* Menu */}
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          onClick={({ key }) => navigate(key)}
          items={menuItems}
          style={{
            background: 'transparent',
            border: 'none',
            padding: '0 12px',
          }}
          theme="dark"
        />

        {/* Logout Button */}
        <div style={{ padding: 16, position: 'absolute', bottom: 16, left: 0, right: 0 }}>
          <Button
            block
            icon={<LogoutOutlined />}
            onClick={handleLogout}
            style={{
              height: 44,
              color: 'rgba(255,255,255,0.9)',
              borderColor: 'rgba(255,255,255,0.2)',
              background: 'rgba(255,255,255,0.05)',
              borderRadius: 8,
              fontWeight: 500,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
            }}
          >
            Logout
          </Button>
        </div>
      </Sider>

      <AntLayout style={{ marginLeft: 280 }}>
        <Content
          style={{
            padding: 32,
            background: '#0f172a',
            minHeight: 'calc(100vh - 48px)',
          }}
        >
          {children}
        </Content>

        <Footer
          style={{
            textAlign: 'center',
            background: '#1e293b',
            color: 'white',
            padding: '16px 32px',
          }}
        >
          Indian Navy - Swavlamban 2025 | Nov 25-26, 2025 | Manekshaw Centre
        </Footer>
      </AntLayout>
    </AntLayout>
  );
}
