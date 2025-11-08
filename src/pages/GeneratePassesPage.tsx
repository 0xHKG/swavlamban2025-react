import { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Typography,
  Space,
  Tag,
  Checkbox,
  message,
  Row,
  Col,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  MailOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import { mockApiService } from '../services/mockApi';
import type { Entry } from '../types';
import Layout from '../components/Layout';

const { Title, Text } = Typography;

export default function GeneratePassesPage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [sendingEmail, setSendingEmail] = useState(false);

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    try {
      const data = await mockApiService.getMyEntries();
      setEntries(data);
    } catch (error) {
      console.error('Failed to load entries:', error);
      message.error('Failed to load entries');
    } finally {
      setLoading(false);
    }
  };

  const handleSendEmail = async (entry: Entry) => {
    setSendingEmail(true);
    try {
      await mockApiService.generatePasses(entry.id, true);
      message.success(`Passes sent successfully to ${entry.email}!`);
      loadEntries();
    } catch (error) {
      message.error('Failed to send email');
    } finally {
      setSendingEmail(false);
    }
  };

  const handleBulkSendEmail = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning('Please select entries to send emails');
      return;
    }

    setSendingEmail(true);
    try {
      // Simulate bulk email sending
      await new Promise((resolve) => setTimeout(resolve, 2000));
      message.success(`Sent emails to ${selectedRowKeys.length} attendees!`);
      setSelectedRowKeys([]);
      loadEntries();
    } catch (error) {
      message.error('Failed to send bulk emails');
    } finally {
      setSendingEmail(false);
    }
  };

  const columns: ColumnsType<Entry> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 70,
      render: (id) => <Text style={{ color: '#94a3b8' }}>{id}</Text>,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      render: (name) => <Text style={{ color: '#e2e8f0', fontWeight: 500 }}>{name}</Text>,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: 220,
      render: (email) => <Text style={{ color: '#94a3b8' }}>{email}</Text>,
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
      width: 150,
      render: (phone) => <Text style={{ color: '#94a3b8' }}>{phone}</Text>,
    },
    {
      title: 'Passes',
      key: 'passes',
      width: 350,
      render: (_, record) => (
        <Space size={[8, 8]} wrap>
          {record.exhibition_day1 && <Tag color="blue">Exh Day 1</Tag>}
          {record.exhibition_day2 && <Tag color="purple">Exh Day 2</Tag>}
          {record.interactive_sessions && <Tag color="cyan">Interactive</Tag>}
          {record.plenary && <Tag color="green">Plenary</Tag>}
        </Space>
      ),
    },
    {
      title: 'Generated',
      key: 'generated',
      width: 120,
      align: 'center',
      render: (_, record) => {
        const hasGenerated =
          record.pass_generated_exhibition_day1 ||
          record.pass_generated_exhibition_day2 ||
          record.pass_generated_interactive_sessions ||
          record.pass_generated_plenary;

        return hasGenerated ? (
          <Tag icon={<CheckCircleOutlined />} color="success">
            Yes
          </Tag>
        ) : (
          <Tag icon={<CloseCircleOutlined />} color="default">
            No
          </Tag>
        );
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 100,
      fixed: 'right',
      render: (_, record) => (
        <Button
          type="primary"
          size="small"
          icon={<MailOutlined />}
          onClick={() => handleSendEmail(record)}
          loading={sendingEmail}
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            border: 'none',
          }}
        >
          Send
        </Button>
      ),
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };

  return (
    <Layout>
      {/* Page Header */}
      <div style={{ marginBottom: 32 }}>
        <Title level={2} style={{ marginBottom: 8, color: '#e2e8f0' }}>
          <FileTextOutlined style={{ marginRight: 12 }} />
          Generate & Email Passes
        </Title>
        <Text style={{ fontSize: 16, color: '#94a3b8' }}>
          Generate QR code passes and send them via email to attendees
        </Text>
      </div>

      {/* Stats Cards */}
      <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
        <Col xs={24} sm={8}>
          <Card
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: 16,
              border: 'none',
              boxShadow: '0 8px 24px rgba(102, 126, 234, 0.25)',
            }}
            styles={{ body: { padding: '20px' } }}
          >
            <div style={{ textAlign: 'center' }}>
              <Title level={2} style={{ color: 'white', margin: 0, fontWeight: 700 }}>
                {entries.length}
              </Title>
              <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14 }}>
                Total Entries
              </Text>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={8}>
          <Card
            style={{
              background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
              borderRadius: 16,
              border: 'none',
              boxShadow: '0 8px 24px rgba(67, 233, 123, 0.25)',
            }}
            styles={{ body: { padding: '20px' } }}
          >
            <div style={{ textAlign: 'center' }}>
              <Title level={2} style={{ color: 'white', margin: 0, fontWeight: 700 }}>
                {
                  entries.filter(
                    (e) =>
                      e.pass_generated_exhibition_day1 ||
                      e.pass_generated_exhibition_day2 ||
                      e.pass_generated_interactive_sessions ||
                      e.pass_generated_plenary
                  ).length
                }
              </Title>
              <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14 }}>
                Passes Generated
              </Text>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={8}>
          <Card
            style={{
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              borderRadius: 16,
              border: 'none',
              boxShadow: '0 8px 24px rgba(245, 87, 108, 0.25)',
            }}
            styles={{ body: { padding: '20px' } }}
          >
            <div style={{ textAlign: 'center' }}>
              <Title level={2} style={{ color: 'white', margin: 0, fontWeight: 700 }}>
                {selectedRowKeys.length}
              </Title>
              <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14 }}>
                Selected
              </Text>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Bulk Actions */}
      {selectedRowKeys.length > 0 && (
        <Card
          style={{
            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
            borderRadius: 16,
            border: '1px solid rgba(102, 126, 234, 0.3)',
            marginBottom: 24,
          }}
          styles={{ body: { padding: '20px 24px' } }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ color: '#e2e8f0', fontSize: 16 }}>
              {selectedRowKeys.length} {selectedRowKeys.length === 1 ? 'entry' : 'entries'} selected
            </Text>
            <Button
              type="primary"
              icon={<MailOutlined />}
              onClick={handleBulkSendEmail}
              loading={sendingEmail}
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
              }}
            >
              Send Bulk Emails
            </Button>
          </div>
        </Card>
      )}

      {/* Entries Table */}
      <div
        style={{
          background: 'rgba(30, 41, 59, 0.5)',
          borderRadius: 16,
          border: '1px solid rgba(255,255,255,0.1)',
          padding: 24,
        }}
      >
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={entries}
          loading={loading}
          rowKey="id"
          scroll={{ x: 1200 }}
          pagination={{
            pageSize: 10,
            showTotal: (total) => `Total ${total} entries`,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50'],
          }}
          style={{
            background: 'transparent',
          }}
        />
      </div>
    </Layout>
  );
}
