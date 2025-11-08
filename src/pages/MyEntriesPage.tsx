import { useEffect, useState } from 'react';
import {
  Card,
  Button,
  Typography,
  Space,
  message,
  Form,
  Input,
  Checkbox,
  Row,
  Col,
  Divider,
  Spin,
  Select,
} from 'antd';
import {
  DeleteOutlined,
  MailOutlined,
  CheckCircleOutlined,
  EditOutlined,
  DownloadOutlined,
} from '@ant-design/icons';
import { mockApiService } from '../services/mockApi';
import type { Entry } from '../types';
import Layout from '../components/Layout';
import { useAuth } from '../hooks/useAuth';

const { Title, Text } = Typography;
const { Option } = Select;

export default function MyEntriesPage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [form] = Form.useForm();
  const currentUser = useAuth();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [entriesData, statsData] = await Promise.all([
        mockApiService.getMyEntries(),
        mockApiService.getDashboardStats(),
      ]);
      setEntries(entriesData);
      setStats(statsData);
    } catch (error) {
      message.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (values: any) => {
    if (!editingId) return;

    try {
      await mockApiService.updateEntry(editingId, values);
      message.success('Entry updated successfully!');
      setEditingId(null);
      form.resetFields();
      loadData();
    } catch (error) {
      message.error('Failed to update entry');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await mockApiService.deleteEntry(id);
      message.success('Entry deleted successfully!');
      setConfirmDeleteId(null);
      loadData();
    } catch (error) {
      message.error('Failed to delete entry');
    }
  };

  const handleGeneratePasses = async (entry: Entry) => {
    try {
      message.loading('Generating passes and sending email...', 0);
      await mockApiService.generatePasses(entry.id, true);
      message.destroy();
      message.success(`Passes generated and emailed to ${entry.email}!`);
      loadData();
    } catch (error) {
      message.destroy();
      message.error('Failed to generate passes');
    }
  };

  const handleDownloadCSV = () => {
    if (entries.length === 0) {
      message.warning('No entries to download');
      return;
    }

    const csvContent = [
      [
        'ID',
        'Name',
        'Email',
        'Phone',
        'ID Type',
        'ID Number',
        'Exhibition Day 1',
        'Exhibition Day 2',
        'Interactive Sessions',
        'Plenary',
        'Pass Generated',
        'Created At',
      ],
      ...entries.map((entry) => [
        entry.id,
        `"${entry.name}"`,
        `"${entry.email}"`,
        `"${entry.phone}"`,
        `"${entry.id_type}"`,
        `"${entry.id_number}"`,
        entry.exhibition_day1 ? 'Yes' : 'No',
        entry.exhibition_day2 ? 'Yes' : 'No',
        entry.interactive_sessions ? 'Yes' : 'No',
        entry.plenary ? 'Yes' : 'No',
        entry.pass_generated_exhibition_day1 ||
        entry.pass_generated_exhibition_day2 ||
        entry.pass_generated_interactive_sessions ||
        entry.pass_generated_plenary
          ? 'Yes'
          : 'No',
        new Date(entry.created_at).toLocaleString(),
      ]),
    ]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    const timestamp = new Date().toISOString().split('T')[0];
    link.setAttribute('href', url);
    link.setAttribute('download', `swavlamban2025_entries_${currentUser?.username}_${timestamp}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    message.success('CSV file downloaded successfully!');
  };

  return (
    <Layout>
      {/* Header Section */}
      <div style={{ marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Title level={2} style={{ margin: 0, color: '#e2e8f0' }}>
            📝 My Entries
          </Title>
          <Text style={{ fontSize: 16, color: '#94a3b8' }}>Manage your registered attendees</Text>
        </div>
        <Button type="primary" icon={<DownloadOutlined />} onClick={handleDownloadCSV} size="large"
          style={{
            background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
            border: 'none',
          }}
        >
          Download CSV
        </Button>
      </div>

      {/* Info Banner - Matching Streamlit */}
      {stats && (
        <div
          style={{
            padding: '16px 20px',
            borderRadius: 12,
            background: 'rgba(79, 172, 254, 0.15)',
            border: '1px solid rgba(79, 172, 254, 0.3)',
            marginBottom: 24,
          }}
        >
          <Text style={{ color: '#4facfe', fontSize: 16, fontWeight: 500 }}>
            📊 Total Entries: {stats.total_entries} / {stats.max_entries} | Remaining: {stats.remaining_quota}
          </Text>
        </div>
      )}

      {/* No Entries Message */}
      {!loading && entries.length === 0 && (
        <Card
          style={{
            borderRadius: 16,
            border: '1px solid rgba(79, 172, 254, 0.3)',
            background: 'rgba(79, 172, 254, 0.05)',
            textAlign: 'center',
            padding: 40,
          }}
        >
          <Text style={{ color: '#4facfe', fontSize: 16 }}>
            No entries yet. Click 'Add Entry' to register attendees.
          </Text>
        </Card>
      )}

      {/* Entry Cards - Matching Streamlit Expandable Layout */}
      {loading ? (
        <Card style={{ borderRadius: 16, padding: 40, textAlign: 'center', background: 'rgba(30, 41, 59, 0.5)' }}>
          <Spin size="large" />
        </Card>
      ) : (
        <Space direction="vertical" size={16} style={{ width: '100%' }}>
          {entries.map((entry) => (
            <Card
              key={entry.id}
              style={{
                borderRadius: 16,
                border: '1px solid rgba(255,255,255,0.1)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                background: 'rgba(30, 41, 59, 0.5)',
              }}
              title={
                <span style={{ color: '#e2e8f0', fontSize: 16 }}>
                  👤 {entry.name} - ID: {entry.id}
                </span>
              }
            >
              {/* Two Column Layout - Matching Streamlit */}
              <Row gutter={24}>
                <Col xs={24} md={12}>
                  <Space direction="vertical" size={8} style={{ width: '100%' }}>
                    <Text style={{ color: '#94a3b8' }}>
                      <strong style={{ color: '#e2e8f0' }}>Email:</strong> {entry.email}
                    </Text>
                    <Text style={{ color: '#94a3b8' }}>
                      <strong style={{ color: '#e2e8f0' }}>Phone:</strong> {entry.phone}
                    </Text>
                    <Text style={{ color: '#94a3b8' }}>
                      <strong style={{ color: '#e2e8f0' }}>ID Type:</strong> {entry.id_type}
                    </Text>
                    <Text style={{ color: '#94a3b8' }}>
                      <strong style={{ color: '#e2e8f0' }}>ID Number:</strong> {entry.id_number}
                    </Text>
                  </Space>
                </Col>

                <Col xs={24} md={12}>
                  <Space direction="vertical" size={8} style={{ width: '100%' }}>
                    <Text style={{ color: '#94a3b8' }}>
                      <strong style={{ color: '#e2e8f0' }}>Pass Type:</strong> 👤 Visitor Pass
                    </Text>
                    <div>
                      <Text style={{ color: '#e2e8f0', fontWeight: 600 }}>Passes Selected:</Text>
                      <div style={{ marginTop: 8 }}>
                        {entry.exhibition_day1 && (
                          <div style={{ color: '#43e97b', marginBottom: 4 }}>✅ Exhibition Day 1</div>
                        )}
                        {entry.exhibition_day2 && (
                          <div style={{ color: '#43e97b', marginBottom: 4 }}>✅ Exhibition Day 2</div>
                        )}
                        {entry.interactive_sessions && (
                          <div style={{ color: '#43e97b', marginBottom: 4 }}>✅ Interactive Sessions</div>
                        )}
                        {entry.plenary && <div style={{ color: '#43e97b', marginBottom: 4 }}>✅ Plenary Session</div>}
                      </div>
                    </div>
                  </Space>
                </Col>
              </Row>

              <Divider style={{ margin: '16px 0', borderColor: 'rgba(255,255,255,0.1)' }} />

              {/* Action Buttons - Matching Streamlit */}
              {editingId !== entry.id && confirmDeleteId !== entry.id && (
                <Row gutter={16}>
                  <Col xs={12} sm={8}>
                    <Button
                      type="default"
                      icon={<EditOutlined />}
                      onClick={() => {
                        setEditingId(entry.id);
                        form.setFieldsValue({
                          name: entry.name,
                          email: entry.email,
                          phone: entry.phone,
                          id_type: entry.id_type,
                          id_number: entry.id_number,
                          exhibition_day1: entry.exhibition_day1,
                          exhibition_day2: entry.exhibition_day2,
                          interactive_sessions: entry.interactive_sessions,
                          plenary: entry.plenary,
                        });
                      }}
                      block
                    >
                      ✏️ Edit
                    </Button>
                  </Col>
                  <Col xs={12} sm={8}>
                    <Button
                      type="default"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => setConfirmDeleteId(entry.id)}
                      block
                    >
                      🗑️ Delete
                    </Button>
                  </Col>
                  <Col xs={24} sm={8}>
                    <Button
                      type="primary"
                      icon={<MailOutlined />}
                      onClick={() => handleGeneratePasses(entry)}
                      block
                      style={{
                        background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                        border: 'none',
                      }}
                    >
                      📧 Generate & Send
                    </Button>
                  </Col>
                </Row>
              )}

              {/* Delete Confirmation - Matching Streamlit */}
              {confirmDeleteId === entry.id && (
                <div
                  style={{
                    padding: 16,
                    borderRadius: 12,
                    background: 'rgba(245, 87, 108, 0.1)',
                    border: '1px solid rgba(245, 87, 108, 0.3)',
                  }}
                >
                  <Text style={{ color: '#f5576c', fontSize: 15, fontWeight: 500 }}>
                    ⚠️ Are you sure you want to delete <strong>{entry.name}</strong>? This action cannot be undone!
                  </Text>
                  <Row gutter={16} style={{ marginTop: 16 }}>
                    <Col span={12}>
                      <Button
                        type="primary"
                        danger
                        onClick={() => handleDelete(entry.id)}
                        block
                        icon={<CheckCircleOutlined />}
                      >
                        ✅ Yes, Delete
                      </Button>
                    </Col>
                    <Col span={12}>
                      <Button onClick={() => setConfirmDeleteId(null)} block>
                        ❌ Cancel
                      </Button>
                    </Col>
                  </Row>
                </div>
              )}

              {/* Edit Form - Matching Streamlit Inline Form */}
              {editingId === entry.id && (
                <div>
                  <Divider style={{ margin: '16px 0', borderColor: 'rgba(255,255,255,0.1)' }} />
                  <Title level={5} style={{ color: '#e2e8f0', marginBottom: 16 }}>
                    ✏️ Edit Entry
                  </Title>
                  <Form form={form} layout="vertical" onFinish={handleEdit}>
                    <Row gutter={16}>
                      <Col xs={24} md={12}>
                        <Form.Item
                          label={<span style={{ color: '#e2e8f0' }}>Full Name *</span>}
                          name="name"
                          rules={[{ required: true, message: 'Please enter full name' }]}
                        >
                          <Input placeholder="Enter full name" />
                        </Form.Item>
                        <Form.Item
                          label={<span style={{ color: '#e2e8f0' }}>Phone *</span>}
                          name="phone"
                          rules={[{ required: true, message: 'Please enter phone number' }]}
                        >
                          <Input placeholder="+91-XXXXXXXXXX" />
                        </Form.Item>
                        <Form.Item
                          label={<span style={{ color: '#e2e8f0' }}>Email *</span>}
                          name="email"
                          rules={[{ required: true, type: 'email', message: 'Please enter valid email' }]}
                        >
                          <Input placeholder="email@example.com" />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={12}>
                        <Form.Item
                          label={<span style={{ color: '#e2e8f0' }}>ID Type *</span>}
                          name="id_type"
                          rules={[{ required: true, message: 'Please select ID type' }]}
                        >
                          <Select placeholder="Select ID type">
                            <Option value="Aadhaar">Aadhaar</Option>
                            <Option value="PAN">PAN</Option>
                            <Option value="Passport">Passport</Option>
                            <Option value="Driving License">Driving License</Option>
                            <Option value="Voter ID">Voter ID</Option>
                          </Select>
                        </Form.Item>
                        <Form.Item
                          label={<span style={{ color: '#e2e8f0' }}>ID Number *</span>}
                          name="id_number"
                          rules={[{ required: true, message: 'Please enter ID number' }]}
                        >
                          <Input placeholder="Enter ID number" />
                        </Form.Item>
                      </Col>
                    </Row>

                    <Text style={{ color: '#e2e8f0', fontWeight: 600, fontSize: 15 }}>Update Passes:</Text>
                    <Row gutter={16} style={{ marginTop: 12 }}>
                      <Col xs={24} md={12}>
                        <Form.Item name="exhibition_day1" valuePropName="checked">
                          <Checkbox style={{ color: '#94a3b8' }}>🗓️ Exhibition Day 1 - 25 Nov</Checkbox>
                        </Form.Item>
                        <Form.Item name="exhibition_day2" valuePropName="checked">
                          <Checkbox style={{ color: '#94a3b8' }}>🗓️ Exhibition Day 2 - 26 Nov</Checkbox>
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={12}>
                        <Form.Item name="interactive_sessions" valuePropName="checked">
                          <Checkbox style={{ color: '#94a3b8' }}>🎤 Interactive Sessions (I & II)</Checkbox>
                        </Form.Item>
                        <Form.Item name="plenary" valuePropName="checked">
                          <Checkbox style={{ color: '#94a3b8' }}>🏛️ Plenary Session</Checkbox>
                        </Form.Item>
                      </Col>
                    </Row>

                    <Row gutter={16} style={{ marginTop: 16 }}>
                      <Col span={12}>
                        <Button type="primary" htmlType="submit" block icon={<CheckCircleOutlined />}>
                          💾 Save Changes
                        </Button>
                      </Col>
                      <Col span={12}>
                        <Button
                          onClick={() => {
                            setEditingId(null);
                            form.resetFields();
                          }}
                          block
                        >
                          ❌ Cancel
                        </Button>
                      </Col>
                    </Row>
                  </Form>
                </div>
              )}
            </Card>
          ))}
        </Space>
      )}
    </Layout>
  );
}
