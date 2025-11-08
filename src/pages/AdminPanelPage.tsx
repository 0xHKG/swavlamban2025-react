import { useEffect, useState } from 'react';
import {
  Card,
  Row,
  Col,
  Typography,
  Table,
  Statistic,
  Button,
  Modal,
  Form,
  Input,
  Checkbox,
  InputNumber,
  message,
  Tabs,
  Select,
  Space,
  Tag,
  Popconfirm,
} from 'antd';
import {
  TeamOutlined,
  UserOutlined,
  FileTextOutlined,
  MailOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { mockApiService } from '../services/mockApi';
import type { User, Entry } from '../types';
import Layout from '../components/Layout';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

export default function AdminPanelPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [userModalVisible, setUserModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [usersData, entriesData] = await Promise.all([
        mockApiService.getAllUsers(),
        mockApiService.getAllEntries(),
      ]);
      setUsers(usersData);
      setEntries(entriesData);
    } catch (error) {
      console.error('Failed to load data:', error);
      message.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics
  const totalUsers = users.length;
  const totalEntries = entries.length;
  const totalQuota = users.reduce((sum, u) => sum + u.max_entries, 0);
  const passesGenerated = entries.filter(
    (e) =>
      e.pass_generated_exhibition_day1 ||
      e.pass_generated_exhibition_day2 ||
      e.pass_generated_interactive_sessions ||
      e.pass_generated_plenary
  ).length;

  // Organization statistics
  const orgStats = users.map((user) => {
    const userEntries = entries.filter((e) => e.username === user.username);
    return {
      username: user.username,
      organization: user.organization,
      role: user.role,
      max_entries: user.max_entries,
      total_entries: userEntries.length,
      remaining: user.max_entries - userEntries.length,
      exhibition_day1: userEntries.filter((e) => e.exhibition_day1).length,
      exhibition_day2: userEntries.filter((e) => e.exhibition_day2).length,
      interactive_sessions: userEntries.filter((e) => e.interactive_sessions).length,
      plenary: userEntries.filter((e) => e.plenary).length,
    };
  });

  // User Management Handlers
  const handleAddUser = () => {
    setEditingUser(null);
    form.resetFields();
    form.setFieldsValue({
      role: 'user',
      max_entries: 50,
      allowed_passes: {
        exhibition_day1: true,
        exhibition_day2: true,
        interactive_sessions: false,
        plenary: false,
      },
    });
    setUserModalVisible(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    form.setFieldsValue({
      username: user.username,
      organization: user.organization,
      role: user.role,
      max_entries: user.max_entries,
      ...user.allowed_passes,
    });
    setUserModalVisible(true);
  };

  const handleDeleteUser = async (username: string) => {
    try {
      await mockApiService.deleteUser(username);
      message.success('User deleted successfully');
      loadData();
    } catch (error) {
      message.error('Failed to delete user');
    }
  };

  const handleUserSubmit = async () => {
    try {
      const values = await form.validateFields();

      const userData = {
        username: values.username,
        organization: values.organization,
        role: values.role,
        max_entries: values.max_entries,
        allowed_passes: {
          exhibition_day1: values.exhibition_day1 || false,
          exhibition_day2: values.exhibition_day2 || false,
          interactive_sessions: values.interactive_sessions || false,
          plenary: values.plenary || false,
        },
        password: 'admin123', // Default password for new users
      };

      if (editingUser) {
        await mockApiService.updateUser(editingUser.username, userData);
        message.success('User updated successfully');
      } else {
        await mockApiService.createUser(userData);
        message.success('User created successfully');
      }

      setUserModalVisible(false);
      form.resetFields();
      loadData();
    } catch (error: any) {
      message.error(error.message || 'Failed to save user');
    }
  };

  // Organization Statistics Table Columns
  const orgColumns: ColumnsType<any> = [
    {
      title: 'Organization',
      dataIndex: 'organization',
      key: 'organization',
      render: (text, record) => (
        <div>
          <Text style={{ color: '#e2e8f0', fontWeight: 500 }}>{text}</Text>
          <br />
          <Text style={{ color: '#94a3b8', fontSize: 13 }}>@{record.username}</Text>
        </div>
      ),
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role) => (
        <Tag color={role === 'admin' ? 'purple' : 'blue'}>{role.toUpperCase()}</Tag>
      ),
    },
    {
      title: 'Quota',
      key: 'quota',
      render: (_, record) => (
        <div>
          <Text style={{ color: '#e2e8f0' }}>
            {record.total_entries} / {record.max_entries}
          </Text>
          <br />
          <Text style={{ color: record.remaining < 10 ? '#f5576c' : '#43e97b', fontSize: 12 }}>
            {record.remaining} remaining
          </Text>
        </div>
      ),
    },
    {
      title: 'Ex Day 1',
      dataIndex: 'exhibition_day1',
      key: 'exhibition_day1',
      render: (count) => <Tag color="blue">{count}</Tag>,
    },
    {
      title: 'Ex Day 2',
      dataIndex: 'exhibition_day2',
      key: 'exhibition_day2',
      render: (count) => <Tag color="purple">{count}</Tag>,
    },
    {
      title: 'Interactive',
      dataIndex: 'interactive_sessions',
      key: 'interactive_sessions',
      render: (count) => <Tag color="cyan">{count}</Tag>,
    },
    {
      title: 'Plenary',
      dataIndex: 'plenary',
      key: 'plenary',
      render: (count) => <Tag color="green">{count}</Tag>,
    },
  ];

  // User Management Table Columns
  const userColumns: ColumnsType<User> = [
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
      render: (text) => <Text style={{ color: '#e2e8f0', fontWeight: 500 }}>{text}</Text>,
    },
    {
      title: 'Organization',
      dataIndex: 'organization',
      key: 'organization',
      render: (text) => <Text style={{ color: '#94a3b8' }}>{text}</Text>,
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role) => (
        <Tag color={role === 'admin' ? 'purple' : 'blue'}>{role.toUpperCase()}</Tag>
      ),
    },
    {
      title: 'Max Entries',
      dataIndex: 'max_entries',
      key: 'max_entries',
      render: (max) => <Text style={{ color: '#e2e8f0' }}>{max}</Text>,
    },
    {
      title: 'Status',
      dataIndex: 'is_active',
      key: 'is_active',
      render: (active) => (
        <Tag color={active ? 'green' : 'red'}>{active ? 'Active' : 'Inactive'}</Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEditUser(record)}
            style={{ color: '#667eea' }}
          >
            Edit
          </Button>
          {record.role !== 'admin' && (
            <Popconfirm
              title="Delete User"
              description="Are you sure you want to delete this user?"
              onConfirm={() => handleDeleteUser(record.username)}
              okText="Yes"
              cancelText="No"
            >
              <Button type="link" size="small" icon={<DeleteOutlined />} danger>
                Delete
              </Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <Layout>
      {/* Page Header */}
      <div style={{ marginBottom: 32 }}>
        <Title level={2} style={{ marginBottom: 8, color: '#e2e8f0' }}>
          Admin Panel
        </Title>
        <Text style={{ fontSize: 16, color: '#94a3b8' }}>
          Manage users, organizations, and system-wide statistics
        </Text>
      </div>

      {/* System Overview Cards */}
      <Row gutter={[24, 24]} style={{ marginBottom: 40 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card
            loading={loading}
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: 16,
              border: 'none',
              boxShadow: '0 8px 24px rgba(102, 126, 234, 0.25)',
            }}
            styles={{ body: { padding: '24px' } }}
          >
            <Statistic
              title={<span style={{ color: 'rgba(255,255,255,0.8)' }}>Total Organizations</span>}
              value={totalUsers}
              valueStyle={{ color: 'white' }}
              prefix={<TeamOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card
            loading={loading}
            style={{
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              borderRadius: 16,
              border: 'none',
              boxShadow: '0 8px 24px rgba(245, 87, 108, 0.25)',
            }}
            styles={{ body: { padding: '24px' } }}
          >
            <Statistic
              title={<span style={{ color: 'rgba(255,255,255,0.8)' }}>Total Entries</span>}
              value={totalEntries}
              valueStyle={{ color: 'white' }}
              prefix={<FileTextOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card
            loading={loading}
            style={{
              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              borderRadius: 16,
              border: 'none',
              boxShadow: '0 8px 24px rgba(79, 172, 254, 0.25)',
            }}
            styles={{ body: { padding: '24px' } }}
          >
            <Statistic
              title={<span style={{ color: 'rgba(255,255,255,0.8)' }}>Total Quota</span>}
              value={totalQuota}
              valueStyle={{ color: 'white' }}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card
            loading={loading}
            style={{
              background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
              borderRadius: 16,
              border: 'none',
              boxShadow: '0 8px 24px rgba(67, 233, 123, 0.25)',
            }}
            styles={{ body: { padding: '24px' } }}
          >
            <Statistic
              title={<span style={{ color: 'rgba(255,255,255,0.8)' }}>Passes Generated</span>}
              value={passesGenerated}
              valueStyle={{ color: 'white' }}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* Main Content Tabs */}
      <Card
        style={{
          background: 'rgba(30, 41, 59, 0.5)',
          borderRadius: 16,
          border: '1px solid rgba(255,255,255,0.1)',
        }}
        styles={{ body: { padding: 24 } }}
      >
        <Tabs defaultActiveKey="1" size="large">
          {/* Organization Statistics Tab */}
          <TabPane tab="📊 Organization Statistics" key="1">
            <Table
              columns={orgColumns}
              dataSource={orgStats}
              loading={loading}
              rowKey="username"
              pagination={{ pageSize: 10 }}
              style={{ background: 'transparent' }}
            />
          </TabPane>

          {/* User Management Tab */}
          <TabPane tab="👥 User Management" key="2">
            <div style={{ marginBottom: 16 }}>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAddUser}
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: 'none',
                }}
              >
                Add New User
              </Button>
            </div>

            <Table
              columns={userColumns}
              dataSource={users}
              loading={loading}
              rowKey="username"
              pagination={{ pageSize: 10 }}
              style={{ background: 'transparent' }}
            />
          </TabPane>

          {/* Bulk Email Tab */}
          <TabPane tab="📧 Bulk Email" key="3">
            <Card
              style={{
                background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                borderRadius: 12,
                border: '1px solid rgba(102, 126, 234, 0.3)',
              }}
              styles={{ body: { padding: 24 } }}
            >
              <Title level={5} style={{ color: '#e2e8f0', marginBottom: 16 }}>
                <MailOutlined style={{ marginRight: 8 }} />
                Send Passes to Multiple Attendees
              </Title>
              <Text style={{ color: '#94a3b8', display: 'block', marginBottom: 24 }}>
                This feature allows you to send passes to multiple attendees at once. Use the My Entries
                page to select specific attendees for bulk email operations.
              </Text>
              <Button
                type="primary"
                icon={<MailOutlined />}
                size="large"
                style={{
                  background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                  border: 'none',
                }}
              >
                Go to My Entries for Bulk Email
              </Button>
            </Card>
          </TabPane>
        </Tabs>
      </Card>

      {/* User Create/Edit Modal */}
      <Modal
        title={editingUser ? 'Edit User' : 'Add New User'}
        open={userModalVisible}
        onOk={handleUserSubmit}
        onCancel={() => {
          setUserModalVisible(false);
          form.resetFields();
        }}
        width={700}
        okText={editingUser ? 'Update User' : 'Create User'}
        okButtonProps={{
          style: {
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            border: 'none',
          },
        }}
      >
        <Form form={form} layout="vertical" style={{ marginTop: 24 }}>
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: 'Please enter username' }]}
          >
            <Input placeholder="iitdelhi" disabled={!!editingUser} />
          </Form.Item>

          <Form.Item
            label="Organization Name"
            name="organization"
            rules={[{ required: true, message: 'Please enter organization' }]}
          >
            <Input placeholder="IIT Delhi" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Role"
                name="role"
                rules={[{ required: true, message: 'Please select role' }]}
              >
                <Select>
                  <Option value="user">User</Option>
                  <Option value="admin">Admin</Option>
                </Select>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Max Entries"
                name="max_entries"
                rules={[{ required: true, message: 'Please enter max entries' }]}
              >
                <InputNumber min={1} max={999} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Title level={6} style={{ marginTop: 16, marginBottom: 12 }}>
            Allowed Pass Types
          </Title>

          <Space direction="vertical" style={{ width: '100%' }}>
            <Form.Item name="exhibition_day1" valuePropName="checked" style={{ marginBottom: 8 }}>
              <Checkbox>
                <Tag color="blue">Exhibition Day 1 (25 Nov)</Tag>
              </Checkbox>
            </Form.Item>

            <Form.Item name="exhibition_day2" valuePropName="checked" style={{ marginBottom: 8 }}>
              <Checkbox>
                <Tag color="purple">Exhibition Day 2 (26 Nov)</Tag>
              </Checkbox>
            </Form.Item>

            <Form.Item name="interactive_sessions" valuePropName="checked" style={{ marginBottom: 8 }}>
              <Checkbox>
                <Tag color="cyan">Interactive Sessions (26 Nov AM)</Tag>
              </Checkbox>
            </Form.Item>

            <Form.Item name="plenary" valuePropName="checked" style={{ marginBottom: 0 }}>
              <Checkbox>
                <Tag color="green">Plenary Session (26 Nov PM)</Tag>
              </Checkbox>
            </Form.Item>
          </Space>
        </Form>
      </Modal>
    </Layout>
  );
}
