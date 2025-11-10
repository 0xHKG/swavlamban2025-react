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
  App,
  Tabs,
  Select,
  Space,
  Tag,
  Popconfirm,
  Upload,
  Alert,
  Progress,
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
  ReloadOutlined,
  DownloadOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { apiService } from '../services';
import type { User, Entry } from '../types';
import Layout from '../components/Layout';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

export default function AdminPanelPage() {
  const { message, modal } = App.useApp(); // Use App hook for notifications and modals
  const [users, setUsers] = useState<User[]>([]);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [userModalVisible, setUserModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [form] = Form.useForm();
  const [serverIp, setServerIp] = useState<string>('Loading...');

  // Pagination state
  const [entriesPageSize, setEntriesPageSize] = useState(10);
  const [orgPageSize, setOrgPageSize] = useState(10);
  const [usersPageSize, setUsersPageSize] = useState(10);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [usersData, entriesData, healthData] = await Promise.all([
        apiService.getAllUsers(),
        apiService.getAllEntries(),
        apiService.healthCheck(),
      ]);
      setUsers(usersData);
      // Sort entries by ID descending (most recent first)
      setEntries(entriesData.sort((a, b) => b.id - a.id));
      // Set server IP from health check
      setServerIp(healthData.server_ip || 'Unable to detect');
    } catch (error) {
      console.error('Failed to load data:', error);
      message.error('Failed to load admin data');
      setServerIp('Unable to detect');
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics
  const totalUsers = users.length;
  const totalEntries = entries.length;
  const totalQuota = users.reduce((sum, u) => sum + u.max_entries, 0);
  const quotaUsedPercent = totalQuota > 0 ? ((totalEntries / totalQuota) * 100).toFixed(1) : '0.0';
  const passesGenerated = entries.filter(
    (e) =>
      e.pass_generated_exhibition_day1 ||
      e.pass_generated_exhibition_day2 ||
      e.pass_generated_interactive_sessions ||
      e.pass_generated_plenary
  ).length;

  // Pass Generation Statistics (detailed by type)
  const passStats = {
    ex_day1_visitors: {
      total: entries.filter((e) => e.exhibition_day1 && !e.is_exhibitor_pass).length,
      generated: entries.filter((e) => e.pass_generated_exhibition_day1 && !e.is_exhibitor_pass).length,
    },
    ex_day2_visitors: {
      total: entries.filter((e) => e.exhibition_day2 && !e.is_exhibitor_pass).length,
      generated: entries.filter((e) => e.pass_generated_exhibition_day2 && !e.is_exhibitor_pass).length,
    },
    exhibitor_passes: {
      total: entries.filter((e) => e.is_exhibitor_pass).length,
      generated: entries.filter((e) => e.is_exhibitor_pass && (e.pass_generated_exhibition_day1 || e.pass_generated_exhibition_day2)).length,
    },
    interactive: {
      total: entries.filter((e) => e.interactive_sessions).length,
      generated: entries.filter((e) => e.pass_generated_interactive_sessions).length,
    },
    plenary: {
      total: entries.filter((e) => e.plenary).length,
      generated: entries.filter((e) => e.pass_generated_plenary).length,
    },
  };

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
      quota_ex_day1: 0,
      quota_ex_day2: 0,
      quota_interactive: 0,
      quota_plenary: 0,
      exhibition_day1: true,
      exhibition_day2: true,
      interactive_sessions: false,
      plenary: false,
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
      quota_ex_day1: user.quota_ex_day1,
      quota_ex_day2: user.quota_ex_day2,
      quota_interactive: user.quota_interactive,
      quota_plenary: user.quota_plenary,
      ...user.allowed_passes,
    });
    setUserModalVisible(true);
  };

  const handleDeleteUser = async (username: string) => {
    try {
      await apiService.deleteUser(username);
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
        quota_ex_day1: values.quota_ex_day1,
        quota_ex_day2: values.quota_ex_day2,
        quota_interactive: values.quota_interactive,
        quota_plenary: values.quota_plenary,
        allowed_passes: {
          exhibition_day1: values.exhibition_day1 || false,
          exhibition_day2: values.exhibition_day2 || false,
          interactive_sessions: values.interactive_sessions || false,
          plenary: values.plenary || false,
        },
        password: 'admin123', // Default password for new users
      };

      if (editingUser) {
        await apiService.updateUser(editingUser.username, userData);
        message.success('User updated successfully');
      } else {
        await apiService.createUser(userData);
        message.success('User created successfully');
      }

      setUserModalVisible(false);
      form.resetFields();
      loadData();
    } catch (error: any) {
      message.error(error.message || 'Failed to save user');
    }
  };

  const handleDownloadAllEntries = () => {
    if (entries.length === 0) {
      message.warning('No entries to download');
      return;
    }

    const csvContent = [
      ['ID', 'Name', 'Organization', 'Email', 'Phone', 'ID Type', 'Entry Type', 'Passes', 'Created'],
      ...entries.map((entry) => {
        const user = users.find((u) => u.username === entry.username);
        const passes: string[] = [];
        if (entry.exhibition_day1) passes.push('Ex-1');
        if (entry.exhibition_day2) passes.push('Ex-2');
        if (entry.interactive_sessions) passes.push('Interactive');
        if (entry.plenary) passes.push('Plenary');

        return [
          entry.id,
          `"${entry.name}"`,
          `"${user?.organization || 'N/A'}"`,
          `"${entry.email}"`,
          `"${entry.phone}"`,
          `"${entry.id_type}"`,
          entry.is_exhibitor_pass ? '🏢 Exhibitor' : '👤 Visitor',
          `"${passes.join(', ')}"`,
          new Date(entry.created_at).toLocaleDateString(),
        ];
      }),
    ]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
    link.setAttribute('href', url);
    link.setAttribute('download', `swavlamban2025_all_entries_${timestamp}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    message.success('CSV file downloaded successfully!');
  };

  const handleDownloadOrgStats = () => {
    if (orgStats.length === 0) {
      message.warning('No organization data to download');
      return;
    }

    const csvContent = [
      [
        'Organization',
        'Username',
        'Quota',
        'Entries',
        'Remaining',
        'Usage %',
        'Ex-1',
        'Ex-2',
        'Interactive',
        'Plenary',
        'Passes Generated',
        'Status',
      ],
      ...orgStats.map((stat) => [
        `"${stat.organization}"`,
        stat.username,
        stat.quota,
        stat.entries,
        stat.remaining,
        `${stat.usagePercent.toFixed(1)}%`,
        stat.ex1,
        stat.ex2,
        stat.interactive,
        stat.plenary,
        stat.passesGenerated,
        stat.isActive ? 'Active' : 'Inactive',
      ]),
    ]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    link.setAttribute('href', url);
    link.setAttribute('download', `swavlamban2025_org_report_${timestamp}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    message.success('Organization report downloaded successfully!');
  };

  // Handle Exhibitor CSV Upload
  const handleExhibitorCSVUpload = async (csvText: string) => {
    console.log('🔍 handleExhibitorCSVUpload called');
    console.log('📄 CSV Text length:', csvText?.length);
    try {
      // Parse CSV
      const lines = csvText.trim().split('\n');
      console.log('📊 Lines parsed:', lines.length);
      if (lines.length < 2) {
        message.error('CSV file is empty or invalid');
        return;
      }

      // Skip header row
      const dataRows = lines.slice(1);
      const exhibitors: any[] = [];
      const errors: string[] = [];

      // Parse each row
      for (let i = 0; i < dataRows.length; i++) {
        const rowNum = i + 2; // +2 because we skipped header (row 1)
        const columns = dataRows[i].split(',').map((col) => col.trim().replace(/^"|"$/g, ''));

        if (columns.length < 5) {
          errors.push(`Row ${rowNum}: Insufficient columns (need at least 5)`);
          continue;
        }

        const firmName = columns[0];
        const email = columns[1];
        const mobile = columns[2];

        // Validate email
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
          errors.push(`Row ${rowNum}: Invalid email format: ${email}`);
          continue;
        }

        // Validate mobile (10 digits)
        const mobileClean = mobile.replace(/\D/g, '');
        if (mobileClean.length !== 10) {
          errors.push(`Row ${rowNum}: Invalid mobile number (need 10 digits): ${mobile}`);
          continue;
        }

        // Extract attendees (alternating Name/Aadhar starting from column 4)
        const attendees: { name: string; aadhar: string }[] = [];
        let colIdx = 3; // Start at column 4 (index 3) - Attendee 1 Name

        while (colIdx < columns.length) {
          const attendeeName = columns[colIdx] || '';
          const aadharNum = columns[colIdx + 1] || '';

          if (attendeeName && aadharNum) {
            const aadharClean = aadharNum.replace(/\D/g, '');
            if (aadharClean.length === 12) {
              attendees.push({
                name: attendeeName,
                aadhar: aadharClean,
              });
            } else {
              errors.push(`Row ${rowNum}: Invalid Aadhar for ${attendeeName}: ${aadharNum}`);
            }
          }

          colIdx += 2; // Move to next attendee
        }

        if (attendees.length === 0) {
          errors.push(`Row ${rowNum}: No valid attendees found`);
          continue;
        }

        exhibitors.push({
          firmName,
          email,
          mobile: mobileClean,
          attendees,
        });
      }

      console.log('✅ Parsed exhibitors:', exhibitors.length);
      console.log('❌ Errors:', errors.length);
      console.log('📦 Exhibitors data:', exhibitors);

      // Show validation results
      if (errors.length > 0) {
        console.log('⚠️ Showing validation errors modal');
        modal.warning({
          title: 'CSV Validation Errors',
          content: (
            <div>
              <p>
                <strong>Valid Exhibitors:</strong> {exhibitors.length}
              </p>
              <p>
                <strong>Errors:</strong> {errors.length}
              </p>
              <div style={{ maxHeight: 300, overflow: 'auto', marginTop: 16 }}>
                {errors.map((err, idx) => (
                  <div key={idx} style={{ color: '#ff4d4f', marginBottom: 4 }}>
                    {err}
                  </div>
                ))}
              </div>
            </div>
          ),
          width: 600,
        });
      }

      if (exhibitors.length === 0) {
        console.log('⛔ No valid exhibitors, exiting');
        message.error('No valid exhibitors to process');
        return;
      }

      console.log('🚀 Showing confirmation modal');
      // Confirm before processing
      modal.confirm({
        title: 'Process Exhibitors',
        content: `Ready to process ${exhibitors.length} exhibitor(s) with ${exhibitors.reduce((sum, ex) => sum + ex.attendees.length, 0)} total attendee(s). Continue?`,
        okText: 'Yes, Process',
        cancelText: 'Cancel',
        onOk: async () => {
          // Process exhibitors
          const hide = message.loading('Processing exhibitors...', 0);
          let successCount = 0;
          let failedCount = 0;

          try {
            for (let i = 0; i < exhibitors.length; i++) {
              const exhibitor = exhibitors[i];

              // Create entries for each attendee
              for (const attendee of exhibitor.attendees) {
                try {
                  await apiService.createEntry({
                    name: attendee.name,
                    email: exhibitor.email,
                    phone: `+91-${exhibitor.mobile}`,
                    id_type: 'Aadhaar',
                    id_number: attendee.aadhar,
                    is_exhibitor_pass: true,
                    exhibition_day1: true,
                    exhibition_day2: true,
                    interactive_sessions: false,
                    plenary: false,
                  });
                  successCount++;
                } catch (error) {
                  failedCount++;
                  console.error(`Failed to create entry for ${attendee.name}:`, error);
                }
              }
            }

            hide();
            message.success(`Processing complete! Success: ${successCount}, Failed: ${failedCount}`);
            loadData(); // Reload data
          } catch (error) {
            hide();
            message.error('Failed to process exhibitors');
            console.error(error);
          }
        },
      });
    } catch (error) {
      console.error('❌ CSV Upload Error:', error);
      message.error(`Failed to parse CSV file: ${error instanceof Error ? error.message : 'Unknown error'}`);
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

      {/* System Overview Cards - 5 metrics */}
      <Card
        style={{
          background: 'rgba(30, 41, 59, 0.5)',
          borderRadius: 16,
          border: '1px solid rgba(255,255,255,0.1)',
          marginBottom: 32,
        }}
        styles={{ body: { padding: 24 } }}
      >
        <Title level={4} style={{ color: '#e2e8f0', marginBottom: 24 }}>
          📊 System Overview
        </Title>
        <Row gutter={[24, 24]}>
          <Col xs={12} sm={8} md={4}>
            <div style={{ textAlign: 'center' }}>
              <Text style={{ color: '#94a3b8', display: 'block', marginBottom: 8 }}>
                Organizations
              </Text>
              <Title level={2} style={{ color: '#e2e8f0', margin: 0 }}>
                {totalUsers}
              </Title>
            </div>
          </Col>
          <Col xs={12} sm={8} md={4}>
            <div style={{ textAlign: 'center' }}>
              <Text style={{ color: '#94a3b8', display: 'block', marginBottom: 8 }}>
                Total Quota
              </Text>
              <Title level={2} style={{ color: '#e2e8f0', margin: 0 }}>
                {totalQuota}
              </Title>
            </div>
          </Col>
          <Col xs={12} sm={8} md={4}>
            <div style={{ textAlign: 'center' }}>
              <Text style={{ color: '#94a3b8', display: 'block', marginBottom: 8 }}>
                Entries Created
              </Text>
              <Title level={2} style={{ color: '#e2e8f0', margin: 0 }}>
                {totalEntries}
              </Title>
            </div>
          </Col>
          <Col xs={12} sm={8} md={4}>
            <div style={{ textAlign: 'center' }}>
              <Text style={{ color: '#94a3b8', display: 'block', marginBottom: 8 }}>
                Quota Used
              </Text>
              <Title level={2} style={{ color: '#e2e8f0', margin: 0 }}>
                {quotaUsedPercent}%
              </Title>
            </div>
          </Col>
          <Col xs={12} sm={8} md={4}>
            <div style={{ textAlign: 'center' }}>
              <Text style={{ color: '#94a3b8', display: 'block', marginBottom: 8 }}>
                Passes Generated
              </Text>
              <Title level={2} style={{ color: '#e2e8f0', margin: 0 }}>
                {passesGenerated}
              </Title>
            </div>
          </Col>
        </Row>
      </Card>

      {/* Pass Generation Statistics */}
      <Card
        style={{
          background: 'rgba(30, 41, 59, 0.5)',
          borderRadius: 16,
          border: '1px solid rgba(255,255,255,0.1)',
          marginBottom: 32,
        }}
        styles={{ body: { padding: 24 } }}
      >
        <Title level={4} style={{ color: '#e2e8f0', marginBottom: 24 }}>
          🎫 Pass Generation Statistics
        </Title>

        {/* Row 1: Exhibition passes */}
        <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={12} lg={8}>
            <div
              style={{
                padding: 20,
                borderRadius: 12,
                background: 'rgba(79, 172, 254, 0.1)',
                border: '1px solid rgba(79, 172, 254, 0.3)',
              }}
            >
              <Text style={{ color: '#94a3b8', display: 'block', marginBottom: 8 }}>
                Exhibition Day 1 (Visitors)
              </Text>
              <Title level={2} style={{ color: '#e2e8f0', margin: '0 0 8px 0' }}>
                {passStats.ex_day1_visitors.total}
              </Title>
              <Text style={{ color: '#43e97b', fontSize: 14 }}>
                ↑ {passStats.ex_day1_visitors.generated} generated
              </Text>
            </div>
          </Col>

          <Col xs={24} sm={12} lg={8}>
            <div
              style={{
                padding: 20,
                borderRadius: 12,
                background: 'rgba(102, 126, 234, 0.1)',
                border: '1px solid rgba(102, 126, 234, 0.3)',
              }}
            >
              <Text style={{ color: '#94a3b8', display: 'block', marginBottom: 8 }}>
                Exhibition Day 2 (Visitors)
              </Text>
              <Title level={2} style={{ color: '#e2e8f0', margin: '0 0 8px 0' }}>
                {passStats.ex_day2_visitors.total}
              </Title>
              <Text style={{ color: '#43e97b', fontSize: 14 }}>
                ↑ {passStats.ex_day2_visitors.generated} generated
              </Text>
            </div>
          </Col>

          <Col xs={24} sm={12} lg={8}>
            <div
              style={{
                padding: 20,
                borderRadius: 12,
                background: 'rgba(118, 75, 162, 0.1)',
                border: '1px solid rgba(118, 75, 162, 0.3)',
              }}
            >
              <Text style={{ color: '#94a3b8', display: 'block', marginBottom: 8 }}>
                Exhibitor Passes (Both Days)
              </Text>
              <Title level={2} style={{ color: '#e2e8f0', margin: '0 0 8px 0' }}>
                {passStats.exhibitor_passes.total}
              </Title>
              <Text style={{ color: '#43e97b', fontSize: 14 }}>
                ↑ {passStats.exhibitor_passes.generated} generated
              </Text>
            </div>
          </Col>
        </Row>

        {/* Row 2: Interactive and Plenary */}
        <Row gutter={[24, 24]}>
          <Col xs={24} sm={12} lg={8}>
            <div
              style={{
                padding: 20,
                borderRadius: 12,
                background: 'rgba(67, 233, 123, 0.1)',
                border: '1px solid rgba(67, 233, 123, 0.3)',
              }}
            >
              <Text style={{ color: '#94a3b8', display: 'block', marginBottom: 8 }}>
                Interactive Sessions
              </Text>
              <Title level={2} style={{ color: '#e2e8f0', margin: '0 0 8px 0' }}>
                {passStats.interactive.total}
              </Title>
              <Text style={{ color: '#43e97b', fontSize: 14 }}>
                ↑ {passStats.interactive.generated} generated
              </Text>
            </div>
          </Col>

          <Col xs={24} sm={12} lg={8}>
            <div
              style={{
                padding: 20,
                borderRadius: 12,
                background: 'rgba(245, 87, 108, 0.1)',
                border: '1px solid rgba(245, 87, 108, 0.3)',
              }}
            >
              <Text style={{ color: '#94a3b8', display: 'block', marginBottom: 8 }}>
                Plenary
              </Text>
              <Title level={2} style={{ color: '#e2e8f0', margin: '0 0 8px 0' }}>
                {passStats.plenary.total}
              </Title>
              <Text style={{ color: '#43e97b', fontSize: 14 }}>
                ↑ {passStats.plenary.generated} generated
              </Text>
            </div>
          </Col>

          <Col xs={24} sm={12} lg={8}>
            {/* Empty column for alignment */}
          </Col>
        </Row>
      </Card>

      {/* System Health */}
      <Card
        style={{
          background: 'rgba(30, 41, 59, 0.5)',
          borderRadius: 16,
          border: '1px solid rgba(255,255,255,0.1)',
          marginBottom: 32,
        }}
        styles={{ body: { padding: 24 } }}
      >
        <Title level={4} style={{ color: '#e2e8f0', marginBottom: 24 }}>
          💚 System Health
        </Title>
        <Row gutter={[24, 24]}>
          <Col xs={24} sm={8}>
            <div
              style={{
                padding: 16,
                borderRadius: 8,
                background: 'rgba(67, 233, 123, 0.15)',
                border: '1px solid rgba(67, 233, 123, 0.3)',
              }}
            >
              <Text style={{ color: '#43e97b', display: 'block', marginBottom: 8, fontWeight: 500 }}>
                ✅ Database: Online
              </Text>
              <Text style={{ color: '#94a3b8' }}>Total Records: {totalEntries}</Text>
            </div>
          </Col>

          <Col xs={24} sm={8}>
            <div
              style={{
                padding: 16,
                borderRadius: 8,
                background: 'rgba(67, 233, 123, 0.15)',
                border: '1px solid rgba(67, 233, 123, 0.3)',
              }}
            >
              <Text style={{ color: '#43e97b', display: 'block', fontWeight: 500 }}>
                ✅ Database: Mock API (Browser)
              </Text>
            </div>
          </Col>

          <Col xs={24} sm={8}>
            <div
              style={{
                padding: 16,
                borderRadius: 8,
                background: 'rgba(67, 233, 123, 0.15)',
                border: '1px solid rgba(67, 233, 123, 0.3)',
              }}
            >
              <Text style={{ color: '#43e97b', display: 'block', marginBottom: 8, fontWeight: 500 }}>
                ✅ Active Users: {totalUsers}
              </Text>
              <Text style={{ color: '#94a3b8' }}>Admins: {users.filter((u) => u.role === 'admin').length}</Text>
            </div>
          </Col>
        </Row>
      </Card>

      {/* Server IP Info */}
      <Card
        style={{
          background: 'rgba(30, 41, 59, 0.5)',
          borderRadius: 16,
          border: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <Title level={4} style={{ color: '#e2e8f0', marginBottom: 16 }}>
          🌐 Server IP Information
        </Title>
        <Row gutter={24}>
          <Col xs={24} md={18}>
            <div
              style={{
                padding: 16,
                borderRadius: 8,
                background: 'rgba(79, 172, 254, 0.1)',
                border: '1px solid rgba(79, 172, 254, 0.3)',
              }}
            >
              <Text style={{ color: '#e2e8f0', display: 'block', marginBottom: 12, fontSize: 16 }}>
                <strong>Current Server IP Address:</strong>{' '}
                <span
                  style={{
                    fontFamily: 'monospace',
                    padding: '4px 8px',
                    background: 'rgba(0,0,0,0.3)',
                    borderRadius: 4,
                    marginLeft: 8,
                  }}
                >
                  {serverIp}
                </span>
              </Text>
            </div>
          </Col>
          <Col xs={24} md={6}>
            <Button
              type="primary"
              icon={<ReloadOutlined />}
              onClick={() => window.location.reload()}
              block
              style={{ height: 48 }}
            >
              🔄 Refresh
            </Button>
          </Col>
        </Row>
      </Card>

      {/* All Entries Table */}
      <Card
        style={{
          background: 'rgba(30, 41, 59, 0.5)',
          borderRadius: 16,
          border: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <Title level={4} style={{ color: '#e2e8f0', margin: 0 }}>
            📋 All Registered Entries
          </Title>
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            onClick={handleDownloadAllEntries}
            style={{
              background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
              border: 'none',
            }}
          >
            📥 Download All Entries (CSV)
          </Button>
        </div>

        {entries.length > 0 ? (
          <Table
            columns={[
              {
                title: 'ID',
                dataIndex: 'id',
                key: 'id',
                width: 80,
                defaultSortOrder: 'descend',
                sorter: (a, b) => a.id - b.id,
              },
              {
                title: 'Name',
                dataIndex: 'name',
                key: 'name',
                sorter: (a, b) => a.name.localeCompare(b.name),
              },
              {
                title: 'Organization',
                dataIndex: 'organization',
                key: 'organization',
                render: (_, record) => {
                  const user = users.find((u) => u.username === record.username);
                  return user?.organization || 'N/A';
                },
              },
              {
                title: 'Email',
                dataIndex: 'email',
                key: 'email',
              },
              {
                title: 'Phone',
                dataIndex: 'phone',
                key: 'phone',
              },
              {
                title: 'ID Type',
                dataIndex: 'id_type',
                key: 'id_type',
              },
              {
                title: 'Entry Type',
                key: 'entry_type',
                render: (_, record) => record.is_exhibitor_pass ? '🏢 Exhibitor' : '👤 Visitor',
              },
              {
                title: 'Passes',
                key: 'passes',
                render: (_, record) => {
                  const passes: string[] = [];

                  // Check exhibitor pass first
                  if (record.is_exhibitor_pass) {
                    passes.push('Ex-1, Ex-2');
                  } else {
                    // Individual passes for visitors
                    if (record.exhibition_day1) passes.push('Ex-1');
                    if (record.exhibition_day2) passes.push('Ex-2');
                  }

                  // Additional passes (same for both exhibitors and visitors)
                  if (record.interactive_sessions) passes.push('Interactive');
                  if (record.plenary) passes.push('Plenary');

                  return passes.join(', ') || 'None';
                },
              },
              {
                title: 'Created',
                dataIndex: 'created_at',
                key: 'created_at',
                render: (date: string) => new Date(date).toLocaleDateString(),
                sorter: (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
              },
            ]}
            dataSource={entries}
            rowKey="id"
            pagination={{
              pageSize: entriesPageSize,
              showSizeChanger: true,
              pageSizeOptions: ['10', '20', '50', '100', '200'],
              showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} entries`,
              onChange: (page, pageSize) => {
                if (pageSize !== entriesPageSize) {
                  setEntriesPageSize(pageSize);
                }
              },
            }}
            scroll={{ x: 1200 }}
          />
        ) : (
          <div
            style={{
              padding: 40,
              textAlign: 'center',
              background: 'rgba(79, 172, 254, 0.1)',
              borderRadius: 8,
              border: '1px solid rgba(79, 172, 254, 0.3)',
            }}
          >
            <Text style={{ color: '#4facfe', fontSize: 16 }}>No entries created yet</Text>
          </div>
        )}
      </Card>

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
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                type="primary"
                icon={<DownloadOutlined />}
                onClick={handleDownloadOrgStats}
                style={{
                  background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                  border: 'none',
                }}
              >
                📥 Download Organization Report (CSV)
              </Button>
            </div>
            <Table
              columns={orgColumns}
              dataSource={orgStats}
              loading={loading}
              rowKey="username"
              pagination={{
                pageSize: orgPageSize,
                showSizeChanger: true,
                pageSizeOptions: ['10', '20', '50', '100'],
                showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} organizations`,
                onChange: (page, pageSize) => {
                  if (pageSize !== orgPageSize) {
                    setOrgPageSize(pageSize);
                  }
                },
              }}
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
              pagination={{
                pageSize: usersPageSize,
                showSizeChanger: true,
                pageSizeOptions: ['10', '20', '50', '100'],
                showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} users`,
                onChange: (page, pageSize) => {
                  if (pageSize !== usersPageSize) {
                    setUsersPageSize(pageSize);
                  }
                },
              }}
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
                This feature allows you to send passes to multiple attendees at once. Use the Generate Passes
                page which has bulk email mode for visitor passes.
              </Text>
              <Button
                type="primary"
                icon={<MailOutlined />}
                size="large"
                onClick={() => window.location.href = '/generate-passes'}
                style={{
                  background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                  border: 'none',
                }}
              >
                Go to Generate Passes Page
              </Button>
            </Card>
          </TabPane>

          {/* Bulk Upload Exhibitors Tab */}
          <TabPane tab="📤 Bulk Upload Exhibitors" key="4">
            <Alert
              message="CSV Format Required"
              description={
                <div>
                  <p style={{ marginBottom: 12 }}>Upload a CSV file with exhibitor details to automatically create entries and generate passes.</p>
                  <p style={{ marginBottom: 8, fontWeight: 'bold' }}>CSV Column Structure:</p>
                  <ul style={{ paddingLeft: 20, marginBottom: 0 }}>
                    <li><strong>Column 1:</strong> Firm Name</li>
                    <li><strong>Column 2:</strong> Email Address</li>
                    <li><strong>Column 3:</strong> Mobile Number (10 digits)</li>
                    <li><strong>Column 4:</strong> Attendee 1 Name</li>
                    <li><strong>Column 5:</strong> Attendee 1 Aadhar Number (12 digits)</li>
                    <li><strong>Column 6:</strong> Attendee 2 Name</li>
                    <li><strong>Column 7:</strong> Attendee 2 Aadhar Number (12 digits)</li>
                    <li><strong>... and so on</strong> (alternating Name/Aadhar for additional attendees)</li>
                  </ul>
                </div>
              }
              type="info"
              showIcon
              style={{ marginBottom: 24 }}
            />

            <Upload.Dragger
              name="file"
              accept=".csv"
              maxCount={1}
              beforeUpload={(file) => {
                const reader = new FileReader();
                reader.onload = async (e) => {
                  const text = e.target?.result as string;
                  await handleExhibitorCSVUpload(text);
                };
                reader.readAsText(file);
                return false; // Prevent default upload
              }}
              showUploadList={false}
            >
              <p className="ant-upload-drag-icon">
                <FileTextOutlined style={{ fontSize: 48, color: '#4facfe' }} />
              </p>
              <p className="ant-upload-text" style={{ color: '#e2e8f0', fontSize: 18 }}>
                Click or drag CSV file to upload
              </p>
              <p className="ant-upload-hint" style={{ color: '#94a3b8' }}>
                Upload exhibitors CSV file with firm details and attendees
              </p>
            </Upload.Dragger>
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
                label="Max Entries (Bulk Upload)"
                name="max_entries"
                rules={[{ required: true, message: 'Please enter max entries' }]}
              >
                <InputNumber min={1} max={999} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Title level={6} style={{ marginTop: 16, marginBottom: 12 }}>
            Pass Quotas (per type)
          </Title>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Exhibition Day 1 Quota"
                name="quota_ex_day1"
                rules={[{ required: true, message: 'Please enter quota' }]}
              >
                <InputNumber
                  min={0}
                  max={999}
                  style={{ width: '100%' }}
                  placeholder="0"
                  disabled={!Form.useWatch('exhibition_day1', form)}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Exhibition Day 2 Quota"
                name="quota_ex_day2"
                rules={[{ required: true, message: 'Please enter quota' }]}
              >
                <InputNumber
                  min={0}
                  max={999}
                  style={{ width: '100%' }}
                  placeholder="0"
                  disabled={!Form.useWatch('exhibition_day2', form)}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Interactive Sessions Quota"
                name="quota_interactive"
                rules={[{ required: true, message: 'Please enter quota' }]}
              >
                <InputNumber
                  min={0}
                  max={999}
                  style={{ width: '100%' }}
                  placeholder="0"
                  disabled={!Form.useWatch('interactive_sessions', form)}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Plenary Session Quota"
                name="quota_plenary"
                rules={[{ required: true, message: 'Please enter quota' }]}
              >
                <InputNumber
                  min={0}
                  max={999}
                  style={{ width: '100%' }}
                  placeholder="0"
                  disabled={!Form.useWatch('plenary', form)}
                />
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
