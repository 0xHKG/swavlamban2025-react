import { useState } from 'react';
import {
  Card,
  Form,
  Input,
  Button,
  Typography,
  message,
  Row,
  Col,
  Divider,
} from 'antd';
import {
  SettingOutlined,
  LockOutlined,
  UserOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import { useAuth } from '../hooks/useAuth';
import Layout from '../components/Layout';

const { Title, Text } = Typography;

export default function SettingsPage() {
  const { user } = useAuth();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

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
          Settings
        </Title>
        <Text style={{ fontSize: 16, color: '#94a3b8' }}>
          Manage your account settings and preferences
        </Text>
      </div>

      <Row gutter={24}>
        {/* Account Information */}
        <Col xs={24} lg={12}>
          <Card
            style={{
              background: 'rgba(30, 41, 59, 0.5)',
              borderRadius: 16,
              border: '1px solid rgba(255,255,255,0.1)',
              marginBottom: 24,
            }}
            styles={{ body: { padding: 32 } }}
          >
            <Title level={4} style={{ color: '#e2e8f0', marginBottom: 24 }}>
              <UserOutlined style={{ marginRight: 8 }} />
              Account Information
            </Title>

            <div style={{ marginBottom: 24 }}>
              <Text style={{ color: '#94a3b8', display: 'block', marginBottom: 4 }}>
                Username
              </Text>
              <Text style={{ color: '#e2e8f0', fontSize: 16, fontWeight: 500 }}>
                {user?.username}
              </Text>
            </div>

            <div style={{ marginBottom: 24 }}>
              <Text style={{ color: '#94a3b8', display: 'block', marginBottom: 4 }}>
                Organization
              </Text>
              <Text style={{ color: '#e2e8f0', fontSize: 16, fontWeight: 500 }}>
                {user?.organization}
              </Text>
            </div>

            <div style={{ marginBottom: 24 }}>
              <Text style={{ color: '#94a3b8', display: 'block', marginBottom: 4 }}>
                Role
              </Text>
              <Text style={{ color: '#fbbf24', fontSize: 16, fontWeight: 500 }}>
                {user?.role.toUpperCase()}
              </Text>
            </div>

            <div>
              <Text style={{ color: '#94a3b8', display: 'block', marginBottom: 4 }}>
                Maximum Entries
              </Text>
              <Text style={{ color: '#e2e8f0', fontSize: 16, fontWeight: 500 }}>
                {user?.max_entries}
              </Text>
            </div>
          </Card>

          {/* Allowed Passes */}
          <Card
            style={{
              background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
              borderRadius: 16,
              border: '1px solid rgba(102, 126, 234, 0.2)',
            }}
            styles={{ body: { padding: 32 } }}
          >
            <Title level={4} style={{ color: '#e2e8f0', marginBottom: 16 }}>
              Allowed Event Passes
            </Title>

            <Row gutter={[16, 16]}>
              <Col xs={12}>
                <Text style={{ color: user?.allowed_passes.exhibition_day1 ? '#43e97b' : '#94a3b8' }}>
                  {user?.allowed_passes.exhibition_day1 ? '✅' : '❌'} Exhibition Day 1
                </Text>
              </Col>
              <Col xs={12}>
                <Text style={{ color: user?.allowed_passes.exhibition_day2 ? '#43e97b' : '#94a3b8' }}>
                  {user?.allowed_passes.exhibition_day2 ? '✅' : '❌'} Exhibition Day 2
                </Text>
              </Col>
              <Col xs={12}>
                <Text style={{ color: user?.allowed_passes.interactive_sessions ? '#43e97b' : '#94a3b8' }}>
                  {user?.allowed_passes.interactive_sessions ? '✅' : '❌'} Interactive Sessions
                </Text>
              </Col>
              <Col xs={12}>
                <Text style={{ color: user?.allowed_passes.plenary ? '#43e97b' : '#94a3b8' }}>
                  {user?.allowed_passes.plenary ? '✅' : '❌'} Plenary Session
                </Text>
              </Col>
            </Row>
          </Card>
        </Col>

        {/* Change Password */}
        <Col xs={24} lg={12}>
          <Card
            style={{
              background: 'rgba(30, 41, 59, 0.5)',
              borderRadius: 16,
              border: '1px solid rgba(255,255,255,0.1)',
            }}
            styles={{ body: { padding: 32 } }}
          >
            <Title level={4} style={{ color: '#e2e8f0', marginBottom: 24 }}>
              <LockOutlined style={{ marginRight: 8 }} />
              Change Password
            </Title>

            <Form
              form={form}
              layout="vertical"
              onFinish={handlePasswordChange}
            >
              <Form.Item
                label={<span style={{ color: '#e2e8f0' }}>Current Password</span>}
                name="current_password"
                rules={[{ required: true, message: 'Please enter current password' }]}
              >
                <Input.Password
                  placeholder="Enter current password"
                  size="large"
                  style={{
                    background: 'rgba(15, 23, 42, 0.5)',
                    borderColor: 'rgba(255,255,255,0.2)',
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
                  placeholder="Enter new password"
                  size="large"
                  style={{
                    background: 'rgba(15, 23, 42, 0.5)',
                    borderColor: 'rgba(255,255,255,0.2)',
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
                  placeholder="Confirm new password"
                  size="large"
                  style={{
                    background: 'rgba(15, 23, 42, 0.5)',
                    borderColor: 'rgba(255,255,255,0.2)',
                  }}
                />
              </Form.Item>

              <Form.Item style={{ marginTop: 32, marginBottom: 0 }}>
                <Button
                  type="primary"
                  size="large"
                  icon={<SaveOutlined />}
                  htmlType="submit"
                  loading={loading}
                  block
                  style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    border: 'none',
                  }}
                >
                  Update Password
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </Layout>
  );
}
