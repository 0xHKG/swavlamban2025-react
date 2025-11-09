import { useState, useEffect } from 'react';
import { Card, Form, Input, Button, Typography, App, Row, Col, Statistic } from 'antd';
import {
  SettingOutlined,
  LockOutlined,
  UserOutlined,
  SaveOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import { useAuth } from '../hooks/useAuth';
import { apiService } from '../services';
import Layout from '../components/Layout';

const { Title, Text } = Typography;

export default function SettingsPage() {
  const { message } = App.useApp(); // Use App hook for notifications
  const { user } = useAuth();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [entries, dashStats] = await Promise.all([
        apiService.getMyEntries(),
        apiService.getDashboardStats(),
      ]);

      // Count passes generated (number of entries with at least one pass)
      const passesGenerated = entries.filter(
        (e) =>
          e.pass_generated_exhibition_day1 ||
          e.pass_generated_exhibition_day2 ||
          e.pass_generated_interactive_sessions ||
          e.pass_generated_plenary
      ).length;

      setStats({
        total_entries: dashStats.total_entries,
        quota_remaining: dashStats.remaining_quota,
        passes_generated: passesGenerated,
        usage_percent:
          user?.max_entries && user.max_entries > 0
            ? ((dashStats.total_entries / user.max_entries) * 100).toFixed(1)
            : '0.0',
      });
    } catch (error) {
      console.error('Failed to load statistics', error);
    }
  };

  const handlePasswordChange = async (values: any) => {
    setLoading(true);
    try {
      // Simulate password change API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      message.success('Password updated successfully!');
      form.resetFields();
    } catch (err) {
      message.error('Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      {/* Page Header */}
      <div style={{ marginBottom: 32 }}>
        <Title level={2} style={{ marginBottom: 8, color: '#e2e8f0' }}>
          <SettingOutlined style={{ marginRight: 12 }} />
          Account Settings
        </Title>
        <Text style={{ fontSize: 16, color: '#94a3b8' }}>Manage your account settings and preferences</Text>
      </div>

      {/* Account Information */}
      <Card
        style={{
          background: 'rgba(30, 41, 59, 0.5)',
          borderRadius: 16,
          border: '1px solid rgba(255,255,255,0.1)',
          marginBottom: 24,
        }}
      >
        <Title level={4} style={{ color: '#e2e8f0', marginBottom: 24 }}>
          📋 Account Information
        </Title>

        <Row gutter={[32, 24]}>
          <Col xs={24} sm={12} md={6}>
            <div>
              <Text style={{ color: '#94a3b8', display: 'block', marginBottom: 8 }}>Username</Text>
              <Text style={{ color: '#e2e8f0', fontSize: 16, fontWeight: 500 }}>{user?.username}</Text>
            </div>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <div>
              <Text style={{ color: '#94a3b8', display: 'block', marginBottom: 8 }}>Organization</Text>
              <Text style={{ color: '#e2e8f0', fontSize: 16, fontWeight: 500 }}>{user?.organization}</Text>
            </div>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <div>
              <Text style={{ color: '#94a3b8', display: 'block', marginBottom: 8 }}>Role</Text>
              <Text style={{ color: '#fbbf24', fontSize: 16, fontWeight: 500 }}>{user?.role.toUpperCase()}</Text>
            </div>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <div>
              <Text style={{ color: '#94a3b8', display: 'block', marginBottom: 8 }}>Account Status</Text>
              <Text style={{ color: '#43e97b', fontSize: 16, fontWeight: 500 }}>🟢 Active</Text>
            </div>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <div>
              <Text style={{ color: '#94a3b8', display: 'block', marginBottom: 8 }}>Max Entries</Text>
              <Text style={{ color: '#e2e8f0', fontSize: 16, fontWeight: 500 }}>{user?.max_entries}</Text>
            </div>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <div>
              <Text style={{ color: '#94a3b8', display: 'block', marginBottom: 8 }}>Created</Text>
              <Text style={{ color: '#e2e8f0', fontSize: 16, fontWeight: 500 }}>N/A</Text>
            </div>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <div>
              <Text style={{ color: '#94a3b8', display: 'block', marginBottom: 8 }}>Last Login</Text>
              <Text style={{ color: '#e2e8f0', fontSize: 16, fontWeight: 500 }}>Never</Text>
            </div>
          </Col>
        </Row>
      </Card>

      {/* Pass Permissions */}
      <Card
        style={{
          background: 'rgba(30, 41, 59, 0.5)',
          borderRadius: 16,
          border: '1px solid rgba(255,255,255,0.1)',
          marginBottom: 24,
        }}
      >
        <Title level={4} style={{ color: '#e2e8f0', marginBottom: 16 }}>
          🎫 Pass Permissions
        </Title>
        <Text style={{ color: '#94a3b8', display: 'block', marginBottom: 16 }}>
          You are allowed to generate the following pass types:
        </Text>

        <Row gutter={[16, 16]}>
          <Col xs={12} sm={6}>
            {user?.allowed_passes?.exhibition_day1 ? (
              <div
                style={{
                  padding: 12,
                  borderRadius: 8,
                  background: 'rgba(67, 233, 123, 0.1)',
                  border: '1px solid rgba(67, 233, 123, 0.3)',
                  textAlign: 'center',
                }}
              >
                <CheckCircleOutlined style={{ color: '#43e97b', fontSize: 20, marginBottom: 8 }} />
                <Text style={{ color: '#43e97b', display: 'block' }}>📅 Exhibition Day 1</Text>
              </div>
            ) : (
              <div
                style={{
                  padding: 12,
                  borderRadius: 8,
                  background: 'rgba(245, 87, 108, 0.1)',
                  border: '1px solid rgba(245, 87, 108, 0.3)',
                  textAlign: 'center',
                }}
              >
                <CloseCircleOutlined style={{ color: '#f5576c', fontSize: 20, marginBottom: 8 }} />
                <Text style={{ color: '#f5576c', display: 'block', textDecoration: 'line-through' }}>
                  📅 Exhibition Day 1
                </Text>
              </div>
            )}
          </Col>

          <Col xs={12} sm={6}>
            {user?.allowed_passes?.exhibition_day2 ? (
              <div
                style={{
                  padding: 12,
                  borderRadius: 8,
                  background: 'rgba(67, 233, 123, 0.1)',
                  border: '1px solid rgba(67, 233, 123, 0.3)',
                  textAlign: 'center',
                }}
              >
                <CheckCircleOutlined style={{ color: '#43e97b', fontSize: 20, marginBottom: 8 }} />
                <Text style={{ color: '#43e97b', display: 'block' }}>📅 Exhibition Day 2</Text>
              </div>
            ) : (
              <div
                style={{
                  padding: 12,
                  borderRadius: 8,
                  background: 'rgba(245, 87, 108, 0.1)',
                  border: '1px solid rgba(245, 87, 108, 0.3)',
                  textAlign: 'center',
                }}
              >
                <CloseCircleOutlined style={{ color: '#f5576c', fontSize: 20, marginBottom: 8 }} />
                <Text style={{ color: '#f5576c', display: 'block', textDecoration: 'line-through' }}>
                  📅 Exhibition Day 2
                </Text>
              </div>
            )}
          </Col>

          <Col xs={12} sm={6}>
            {user?.allowed_passes?.interactive_sessions ? (
              <div
                style={{
                  padding: 12,
                  borderRadius: 8,
                  background: 'rgba(67, 233, 123, 0.1)',
                  border: '1px solid rgba(67, 233, 123, 0.3)',
                  textAlign: 'center',
                }}
              >
                <CheckCircleOutlined style={{ color: '#43e97b', fontSize: 20, marginBottom: 8 }} />
                <Text style={{ color: '#43e97b', display: 'block' }}>💡 Interactive Sessions</Text>
              </div>
            ) : (
              <div
                style={{
                  padding: 12,
                  borderRadius: 8,
                  background: 'rgba(245, 87, 108, 0.1)',
                  border: '1px solid rgba(245, 87, 108, 0.3)',
                  textAlign: 'center',
                }}
              >
                <CloseCircleOutlined style={{ color: '#f5576c', fontSize: 20, marginBottom: 8 }} />
                <Text style={{ color: '#f5576c', display: 'block', textDecoration: 'line-through' }}>
                  💡 Interactive Sessions
                </Text>
              </div>
            )}
          </Col>

          <Col xs={12} sm={6}>
            {user?.allowed_passes?.plenary ? (
              <div
                style={{
                  padding: 12,
                  borderRadius: 8,
                  background: 'rgba(67, 233, 123, 0.1)',
                  border: '1px solid rgba(67, 233, 123, 0.3)',
                  textAlign: 'center',
                }}
              >
                <CheckCircleOutlined style={{ color: '#43e97b', fontSize: 20, marginBottom: 8 }} />
                <Text style={{ color: '#43e97b', display: 'block' }}>🎤 Plenary</Text>
              </div>
            ) : (
              <div
                style={{
                  padding: 12,
                  borderRadius: 8,
                  background: 'rgba(245, 87, 108, 0.1)',
                  border: '1px solid rgba(245, 87, 108, 0.3)',
                  textAlign: 'center',
                }}
              >
                <CloseCircleOutlined style={{ color: '#f5576c', fontSize: 20, marginBottom: 8 }} />
                <Text style={{ color: '#f5576c', display: 'block', textDecoration: 'line-through' }}>🎤 Plenary</Text>
              </div>
            )}
          </Col>
        </Row>
      </Card>

      {/* Usage Statistics */}
      <Card
        style={{
          background: 'rgba(30, 41, 59, 0.5)',
          borderRadius: 16,
          border: '1px solid rgba(255,255,255,0.1)',
          marginBottom: 24,
        }}
      >
        <Title level={4} style={{ color: '#e2e8f0', marginBottom: 24 }}>
          📊 Your Usage Statistics
        </Title>

        {stats ? (
          <Row gutter={24}>
            <Col xs={12} sm={6}>
              <Card
                style={{
                  background: 'rgba(79, 172, 254, 0.1)',
                  border: '1px solid rgba(79, 172, 254, 0.3)',
                  borderRadius: 12,
                }}
              >
                <Statistic
                  title={<span style={{ color: '#94a3b8' }}>Total Entries</span>}
                  value={stats.total_entries}
                  valueStyle={{ color: '#4facfe', fontSize: 32 }}
                />
              </Card>
            </Col>

            <Col xs={12} sm={6}>
              <Card
                style={{
                  background: 'rgba(67, 233, 123, 0.1)',
                  border: '1px solid rgba(67, 233, 123, 0.3)',
                  borderRadius: 12,
                }}
              >
                <Statistic
                  title={<span style={{ color: '#94a3b8' }}>Quota Remaining</span>}
                  value={stats.quota_remaining}
                  valueStyle={{ color: '#43e97b', fontSize: 32 }}
                />
              </Card>
            </Col>

            <Col xs={12} sm={6}>
              <Card
                style={{
                  background: 'rgba(251, 191, 36, 0.1)',
                  border: '1px solid rgba(251, 191, 36, 0.3)',
                  borderRadius: 12,
                }}
              >
                <Statistic
                  title={<span style={{ color: '#94a3b8' }}>Passes Generated</span>}
                  value={stats.passes_generated}
                  valueStyle={{ color: '#fbbf24', fontSize: 32 }}
                />
              </Card>
            </Col>

            <Col xs={12} sm={6}>
              <Card
                style={{
                  background: 'rgba(139, 92, 246, 0.1)',
                  border: '1px solid rgba(139, 92, 246, 0.3)',
                  borderRadius: 12,
                }}
              >
                <Statistic
                  title={<span style={{ color: '#94a3b8' }}>Usage %</span>}
                  value={`${stats.usage_percent}%`}
                  valueStyle={{ color: '#8b5cf6', fontSize: 32 }}
                />
              </Card>
            </Col>
          </Row>
        ) : (
          <Text style={{ color: '#94a3b8' }}>Loading statistics...</Text>
        )}
      </Card>

      {/* Security Section - Change Password */}
      <Card
        style={{
          background: 'rgba(30, 41, 59, 0.5)',
          borderRadius: 16,
          border: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <Title level={4} style={{ color: '#e2e8f0', marginBottom: 16 }}>
          🔒 Change Password
        </Title>

        <Form form={form} layout="vertical" onFinish={handlePasswordChange} style={{ maxWidth: 500 }}>
          <Form.Item
            label={<span style={{ color: '#e2e8f0' }}>Current Password</span>}
            name="current_password"
            rules={[{ required: true, message: 'Please enter current password' }]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: '#94a3b8' }} />}
              placeholder="Enter current password"
              size="large"
              style={{
                background: 'rgba(15, 23, 42, 0.5)',
                borderColor: 'rgba(255,255,255,0.2)',
                color: '#e2e8f0',
              }}
            />
          </Form.Item>

          <Form.Item
            label={<span style={{ color: '#e2e8f0' }}>New Password</span>}
            name="new_password"
            rules={[
              { required: true, message: 'Please enter new password' },
              { min: 8, message: 'Password must be at least 8 characters' },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: '#94a3b8' }} />}
              placeholder="Enter new password (min 8 characters)"
              size="large"
              style={{
                background: 'rgba(15, 23, 42, 0.5)',
                borderColor: 'rgba(255,255,255,0.2)',
                color: '#e2e8f0',
              }}
            />
          </Form.Item>

          <Form.Item
            label={<span style={{ color: '#e2e8f0' }}>Confirm New Password</span>}
            name="confirm_password"
            dependencies={['new_password']}
            rules={[
              { required: true, message: 'Please confirm new password' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('new_password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Passwords do not match'));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: '#94a3b8' }} />}
              placeholder="Confirm new password"
              size="large"
              style={{
                background: 'rgba(15, 23, 42, 0.5)',
                borderColor: 'rgba(255,255,255,0.2)',
                color: '#e2e8f0',
              }}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              icon={<SaveOutlined />}
              htmlType="submit"
              loading={loading}
              size="large"
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                minWidth: 200,
              }}
            >
              Update Password
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </Layout>
  );
}
