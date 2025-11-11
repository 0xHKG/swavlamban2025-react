import { useState, type ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Layout as AntLayout, Menu, Button, Typography, Avatar, Drawer } from 'antd';
import {
  DashboardOutlined,
  UserAddOutlined,
  UnorderedListOutlined,
  ControlOutlined,
  InfoCircleOutlined,
  LogoutOutlined,
  MailOutlined,
  SettingOutlined,
  MenuOutlined,
} from '@ant-design/icons';
import { useAuth } from '../hooks/useAuth';

const { Sider, Content, Footer, Header } = AntLayout;
const { Text } = Typography;

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key);
    setMobileDrawerOpen(false); // Close drawer on mobile after navigation
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

  // Sidebar content (reusable for both desktop Sider and mobile Drawer)
  const sidebarContent = (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
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

      {/* Scrollable navigation section */}
      <div style={{ flex: 1, overflow: 'auto', paddingBottom: 16 }}>
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
          onClick={handleMenuClick}
          items={menuItems}
          style={{
            background: 'transparent',
            border: 'none',
            padding: '0 12px',
          }}
          theme="dark"
        />
      </div>

      {/* Logout Button - Fixed at bottom */}
      <div style={{ padding: 16, marginTop: 'auto' }}>
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
    </div>
  );

  return (
    <AntLayout hasSider style={{ minHeight: '100vh' }}>
      {/* Desktop Sidebar - Hidden on mobile (< 768px) */}
      <Sider
        width={280}
        breakpoint="md"
        collapsedWidth="0"
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
        {sidebarContent}
      </Sider>

      {/* Mobile Drawer - Only shows on mobile (< 768px) */}
      <Drawer
        title="Menu"
        placement="left"
        onClose={() => setMobileDrawerOpen(false)}
        open={mobileDrawerOpen}
        styles={{
          body: { padding: 0, background: 'linear-gradient(180deg, #1e3a8a 0%, #1e293b 100%)' },
          header: {
            background: 'linear-gradient(180deg, #1e3a8a 0%, #1e293b 100%)',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            color: '#fbbf24'
          }
        }}
        width={280}
      >
        {sidebarContent}
      </Drawer>

      <AntLayout style={{ marginLeft: 280 }}>
        {/* Mobile Header with Hamburger Menu - Only shows on mobile */}
        <Header
          style={{
            padding: '0 16px',
            background: 'linear-gradient(90deg, #1e3a8a 0%, #1e293b 100%)',
            display: 'none', // Hidden by default (desktop)
            alignItems: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
          }}
          className="mobile-header"
        >
          <Button
            type="text"
            icon={<MenuOutlined style={{ fontSize: 20, color: '#fbbf24' }} />}
            onClick={() => setMobileDrawerOpen(true)}
            style={{ marginRight: 16 }}
          />
          <Text style={{ color: '#fbbf24', fontWeight: 700, fontSize: 18 }}>
            Swavlamban 2025
          </Text>
        </Header>
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
