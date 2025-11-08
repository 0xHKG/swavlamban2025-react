import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  Form,
  Input,
  Select,
  Checkbox,
  Button,
  Typography,
  Space,
  message,
  Row,
  Col,
  Upload,
  Progress,
  Divider,
  Alert,
  Table,
  Statistic,
  Modal,
} from 'antd';
import {
  UserAddOutlined,
  SaveOutlined,
  CloseOutlined,
  UploadOutlined,
  DownloadOutlined,
  FileExcelOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { mockApiService } from '../services/mockApi';
import { useAuth } from '../hooks/useAuth';
import Layout from '../components/Layout';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

export default function AddEntryPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [csvData, setCsvData] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await mockApiService.getDashboardStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      await mockApiService.createEntry(values);
      message.success('Entry created successfully!');
      setTimeout(() => navigate('/my-entries'), 1500);
    } catch (err: any) {
      message.error(err.message || 'Failed to create entry');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadTemplate = () => {
    const templateContent = [
      'Name,Email,Phone,ID_Type,ID_Number,Exhibition_Day_1,Exhibition_Day_2,Interactive_Sessions,Plenary',
      'John Doe,john@example.com,9876543210,Aadhaar,123456789012,Yes,Yes,No,No',
      'Jane Smith,jane@example.com,9876543211,PAN,234567890123,Yes,Yes,Yes,Yes',
      'Sample Name,email@example.com,9876543212,Passport,345678901234,Yes,No,Yes,No'
    ].join('\n');

    const file = new Blob([templateContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const downloadUrl = URL.createObjectURL(file);

    link.href = downloadUrl;
    link.download = `swavlamban2025_template_${user?.username}.csv`;
    link.style.display = 'none';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(downloadUrl);

    message.success('CSV template downloaded successfully!');
  };

  // Parse CSV File with better handling of quoted fields
  const parseCSV = (text: string) => {
    const lines = text.split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    const data = [];

    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue;

      // Handle quoted fields that may contain commas
      const values: string[] = [];
      let currentValue = '';
      let insideQuotes = false;

      for (let char of lines[i]) {
        if (char === '"') {
          insideQuotes = !insideQuotes;
        } else if (char === ',' && !insideQuotes) {
          values.push(currentValue.trim().replace(/^"|"$/g, ''));
          currentValue = '';
        } else {
          currentValue += char;
        }
      }
      values.push(currentValue.trim().replace(/^"|"$/g, ''));

      const row: any = {};
      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });
      data.push(row);
    }

    return data;
  };

  // Handle CSV Upload
  const uploadProps: UploadProps = {
    name: 'file',
    accept: '.csv',
    beforeUpload: (file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const parsed = parseCSV(text);
        setCsvData(parsed);
        message.success(`Loaded ${parsed.length} entries from CSV`);
      };
      reader.readAsText(file);
      return false; // Prevent auto upload
    },
    showUploadList: false,
  };

  // Process Bulk Upload with comprehensive validation
  const handleBulkUpload = async () => {
    if (csvData.length === 0) {
      message.error('No CSV data to upload');
      return;
    }

    // Check remaining quota
    if (!stats) {
      message.error('Unable to load quota information');
      return;
    }

    if (csvData.length > stats.remaining_quota) {
      message.error(`Cannot upload ${csvData.length} entries. You only have ${stats.remaining_quota} slots remaining.`);
      return;
    }

    setUploading(true);
    let successCount = 0;
    let failedCount = 0;
    const failedRows: Array<{ row: number; reason: string }> = [];

    for (let i = 0; i < csvData.length; i++) {
      const row = csvData[i];
      setUploadProgress(((i + 1) / csvData.length) * 100);

      try {
        // Validate row data
        const name = String(row.Name || '').trim();
        const email = String(row.Email || '').trim();
        const phone = String(row.Phone || '').trim();
        const id_type = String(row.ID_Type || '').trim();
        const id_number = String(row.ID_Number || '').trim();

        // Validate required fields
        if (!name || name === 'nan') {
          throw new Error('Missing name');
        }

        if (!email || email === 'nan' || !email.includes('@')) {
          throw new Error(`Invalid email: ${email}`);
        }

        const phoneClean = phone.replace(/\D/g, '');
        if (!phoneClean || phoneClean.length !== 10) {
          throw new Error(`Invalid phone (must be 10 digits): ${phone}`);
        }

        // Validate ID type
        const validIdTypes = ['Aadhaar', 'PAN', 'Passport', 'Driving License', 'Voter ID'];
        if (!validIdTypes.includes(id_type)) {
          throw new Error(`Invalid ID type: ${id_type}`);
        }

        if (!id_number || id_number === 'nan') {
          throw new Error('Missing ID number');
        }

        // Parse pass selections
        const exhibition_day1 = String(row.Exhibition_Day_1 || '').trim().toLowerCase() === 'yes';
        const exhibition_day2 = String(row.Exhibition_Day_2 || '').trim().toLowerCase() === 'yes';
        const interactive_sessions = String(row.Interactive_Sessions || '').trim().toLowerCase() === 'yes';
        const plenary = String(row.Plenary || '').trim().toLowerCase() === 'yes';

        // Check if at least one pass is selected
        if (!exhibition_day1 && !exhibition_day2 && !interactive_sessions && !plenary) {
          throw new Error('No passes selected');
        }

        // Get user's allowed passes
        const allowed_passes = user?.allowed_passes || {};

        // Check permissions
        if (exhibition_day1 && !allowed_passes.exhibition_day1) {
          throw new Error('Not allowed to create Exhibition Day 1 passes');
        }

        if (exhibition_day2 && !allowed_passes.exhibition_day2) {
          throw new Error('Not allowed to create Exhibition Day 2 passes');
        }

        if (interactive_sessions && !allowed_passes.interactive_sessions) {
          throw new Error('Not allowed to create Interactive Sessions passes');
        }

        if (plenary && !allowed_passes.plenary) {
          throw new Error('Not allowed to create Plenary passes');
        }

        // Create entry
        const entry = {
          name,
          email,
          phone: phoneClean.startsWith('+91') ? phoneClean : `+91-${phoneClean}`,
          id_type,
          id_number,
          exhibition_day1,
          exhibition_day2,
          interactive_sessions,
          plenary,
        };

        await mockApiService.createEntry(entry);
        successCount++;
      } catch (error: any) {
        failedCount++;
        failedRows.push({ row: i + 2, reason: error.message || 'Unknown error' });
      }
    }

    setUploading(false);
    setUploadProgress(0);
    setCsvData([]);

    if (successCount > 0) {
      message.success(`✅ Successfully uploaded ${successCount} entries!`);
    }

    if (failedCount > 0) {
      message.error(`❌ Failed to upload ${failedCount} entries`);
      console.log('Failed rows:', failedRows);

      // Show detailed error modal
      Modal.error({
        title: 'Upload Errors',
        content: (
          <div style={{ maxHeight: 400, overflow: 'auto' }}>
            <p><strong>Failed rows:</strong></p>
            {failedRows.map((item, idx) => (
              <div key={idx} style={{ marginBottom: 8, fontSize: 13 }}>
                <strong>Row {item.row}:</strong> {item.reason}
              </div>
            ))}
          </div>
        ),
        width: 600,
      });
    }

    if (successCount > 0) {
      await loadStats(); // Reload stats
      setTimeout(() => navigate('/my-entries'), 2000);
    }
  };

  return (
    <Layout>
      {/* Page Header */}
      <div style={{ marginBottom: 32 }}>
        <Title level={2} style={{ marginBottom: 8, color: '#e2e8f0' }}>
          <UserAddOutlined style={{ marginRight: 12 }} />
          Add Entry
        </Title>
        <Text style={{ fontSize: 16, color: '#94a3b8' }}>
          Fill in the details to create a new registration entry
        </Text>
      </div>

      {/* Your Pass Quotas Section */}
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
          📊 Your Pass Quotas
        </Title>

        <Row gutter={24}>
          <Col xs={12} sm={6}>
            <div
              style={{
                padding: 20,
                borderRadius: 12,
                background: 'rgba(79, 172, 254, 0.1)',
                border: '1px solid rgba(79, 172, 254, 0.3)',
                textAlign: 'center',
              }}
            >
              <Text style={{ color: '#4facfe', display: 'block', marginBottom: 8, fontWeight: 500 }}>
                Ex Day 1
              </Text>
              <Title level={3} style={{ color: '#e2e8f0', margin: '0 0 8px 0' }}>
                {stats?.exhibition_day1_count || 0}/{stats?.max_entries || 0}
              </Title>
              <Text style={{ color: '#43e97b', fontSize: 14 }}>
                ↑ {stats ? stats.max_entries - stats.exhibition_day1_count : 0} left
              </Text>
            </div>
          </Col>

          <Col xs={12} sm={6}>
            <div
              style={{
                padding: 20,
                borderRadius: 12,
                background: 'rgba(102, 126, 234, 0.1)',
                border: '1px solid rgba(102, 126, 234, 0.3)',
                textAlign: 'center',
              }}
            >
              <Text style={{ color: '#667eea', display: 'block', marginBottom: 8, fontWeight: 500 }}>
                Ex Day 2
              </Text>
              <Title level={3} style={{ color: '#e2e8f0', margin: '0 0 8px 0' }}>
                {stats?.exhibition_day2_count || 0}/{stats?.max_entries || 0}
              </Title>
              <Text style={{ color: '#43e97b', fontSize: 14 }}>
                ↑ {stats ? stats.max_entries - stats.exhibition_day2_count : 0} left
              </Text>
            </div>
          </Col>

          <Col xs={12} sm={6}>
            <div
              style={{
                padding: 20,
                borderRadius: 12,
                background: 'rgba(67, 233, 123, 0.1)',
                border: '1px solid rgba(67, 233, 123, 0.3)',
                textAlign: 'center',
              }}
            >
              <Text style={{ color: '#43e97b', display: 'block', marginBottom: 8, fontWeight: 500 }}>
                Interactive
              </Text>
              <Title level={3} style={{ color: '#e2e8f0', margin: '0 0 8px 0' }}>
                {stats?.interactive_sessions_count || 0}/{stats?.max_entries || 0}
              </Title>
              <Text style={{ color: '#43e97b', fontSize: 14 }}>
                ↑ {stats ? stats.max_entries - stats.interactive_sessions_count : 0} left
              </Text>
            </div>
          </Col>

          <Col xs={12} sm={6}>
            <div
              style={{
                padding: 20,
                borderRadius: 12,
                background: 'rgba(245, 87, 108, 0.1)',
                border: '1px solid rgba(245, 87, 108, 0.3)',
                textAlign: 'center',
              }}
            >
              <Text style={{ color: '#f5576c', display: 'block', marginBottom: 8, fontWeight: 500 }}>
                Plenary
              </Text>
              <Title level={3} style={{ color: '#e2e8f0', margin: '0 0 8px 0' }}>
                {stats?.plenary_count || 0}/{stats?.max_entries || 0}
              </Title>
              <Text style={{ color: '#43e97b', fontSize: 14 }}>
                ↑ {stats ? stats.max_entries - stats.plenary_count : 0} left
              </Text>
            </div>
          </Col>
        </Row>
      </Card>

      {/* Divider */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', margin: '32px 0' }} />

      {/* Individual Entry Form Card */}
      <Card
        style={{
          background: 'rgba(30, 41, 59, 0.5)',
          borderRadius: 16,
          border: '1px solid rgba(255,255,255,0.1)',
        }}
        styles={{ body: { padding: 32 } }}
      >
        <Title level={4} style={{ color: '#e2e8f0', marginBottom: 24 }}>
          Individual Entry Form
        </Title>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            id_type: 'Aadhaar',
            exhibition_day1: false,
            exhibition_day2: false,
            interactive_sessions: false,
            plenary: false,
          }}
        >
          <Row gutter={24}>
            {/* Personal Information */}
            <Col xs={24}>
              <Title level={5} style={{ color: '#e2e8f0', marginBottom: 16 }}>
                Personal Information
              </Title>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label={<span style={{ color: '#e2e8f0' }}>Full Name</span>}
                name="name"
                rules={[{ required: true, message: 'Please enter full name' }]}
              >
                <Input
                  placeholder="Enter full name"
                  size="large"
                  style={{
                    background: 'rgba(15, 23, 42, 0.5)',
                    borderColor: 'rgba(255,255,255,0.2)',
                    color: '#e2e8f0',
                  }}
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label={<span style={{ color: '#e2e8f0' }}>Phone Number</span>}
                name="phone"
                rules={[{ required: true, message: 'Please enter phone number' }]}
              >
                <Input
                  placeholder="+91-9876543210"
                  size="large"
                  style={{
                    background: 'rgba(15, 23, 42, 0.5)',
                    borderColor: 'rgba(255,255,255,0.2)',
                    color: '#e2e8f0',
                  }}
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label={<span style={{ color: '#e2e8f0' }}>Email Address</span>}
                name="email"
                rules={[
                  { required: true, message: 'Please enter email' },
                  { type: 'email', message: 'Please enter valid email' },
                ]}
              >
                <Input
                  placeholder="example@domain.com"
                  size="large"
                  style={{
                    background: 'rgba(15, 23, 42, 0.5)',
                    borderColor: 'rgba(255,255,255,0.2)',
                    color: '#e2e8f0',
                  }}
                />
              </Form.Item>
            </Col>

            {/* ID Details */}
            <Col xs={24}>
              <Title level={5} style={{ color: '#e2e8f0', marginTop: 16, marginBottom: 16 }}>
                ID Details
              </Title>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label={<span style={{ color: '#e2e8f0' }}>ID Type</span>}
                name="id_type"
                rules={[{ required: true, message: 'Please select ID type' }]}
              >
                <Select
                  size="large"
                  style={{
                    width: '100%',
                  }}
                  dropdownStyle={{
                    background: '#1e293b',
                  }}
                >
                  <Option value="Aadhaar">Aadhaar</Option>
                  <Option value="PAN">PAN Card</Option>
                  <Option value="Passport">Passport</Option>
                  <Option value="Driving License">Driving License</Option>
                  <Option value="Voter ID">Voter ID</Option>
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label={<span style={{ color: '#e2e8f0' }}>ID Number</span>}
                name="id_number"
                rules={[{ required: true, message: 'Please enter ID number' }]}
              >
                <Input
                  placeholder="1111-2222-3333"
                  size="large"
                  style={{
                    background: 'rgba(15, 23, 42, 0.5)',
                    borderColor: 'rgba(255,255,255,0.2)',
                    color: '#e2e8f0',
                  }}
                />
              </Form.Item>
            </Col>

            {/* Pass Selection */}
            <Col xs={24}>
              <Title level={5} style={{ color: '#e2e8f0', marginBottom: 8 }}>
                Select Event Passes
              </Title>
              <Text style={{ color: '#94a3b8', display: 'block', marginBottom: 16 }}>
                Choose the sessions this attendee will participate in
              </Text>
            </Col>

            <Col xs={24}>
              <div
                style={{
                  background: 'rgba(15, 23, 42, 0.3)',
                  borderRadius: 12,
                  padding: 24,
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                <Row gutter={[16, 16]}>
                  {user?.allowed_passes.exhibition_day1 && (
                    <Col xs={24} sm={12} md={6}>
                      <Form.Item name="exhibition_day1" valuePropName="checked" style={{ marginBottom: 0 }}>
                        <Checkbox
                          style={{
                            color: '#e2e8f0',
                            fontSize: 15,
                          }}
                        >
                          <div>
                            <div style={{ fontWeight: 500 }}>Exhibition Day 1</div>
                            <div style={{ fontSize: 13, color: '#94a3b8' }}>25 Nov 2025</div>
                          </div>
                        </Checkbox>
                      </Form.Item>
                    </Col>
                  )}

                  {user?.allowed_passes.exhibition_day2 && (
                    <Col xs={24} sm={12} md={6}>
                      <Form.Item name="exhibition_day2" valuePropName="checked" style={{ marginBottom: 0 }}>
                        <Checkbox
                          style={{
                            color: '#e2e8f0',
                            fontSize: 15,
                          }}
                        >
                          <div>
                            <div style={{ fontWeight: 500 }}>Exhibition Day 2</div>
                            <div style={{ fontSize: 13, color: '#94a3b8' }}>26 Nov 2025</div>
                          </div>
                        </Checkbox>
                      </Form.Item>
                    </Col>
                  )}

                  {user?.allowed_passes.interactive_sessions && (
                    <Col xs={24} sm={12} md={6}>
                      <Form.Item name="interactive_sessions" valuePropName="checked" style={{ marginBottom: 0 }}>
                        <Checkbox
                          style={{
                            color: '#e2e8f0',
                            fontSize: 15,
                          }}
                        >
                          <div>
                            <div style={{ fontWeight: 500 }}>Interactive Sessions</div>
                            <div style={{ fontSize: 13, color: '#94a3b8' }}>26 Nov 2025 (AM)</div>
                          </div>
                        </Checkbox>
                      </Form.Item>
                    </Col>
                  )}

                  {user?.allowed_passes.plenary && (
                    <Col xs={24} sm={12} md={6}>
                      <Form.Item name="plenary" valuePropName="checked" style={{ marginBottom: 0 }}>
                        <Checkbox
                          style={{
                            color: '#e2e8f0',
                            fontSize: 15,
                          }}
                        >
                          <div>
                            <div style={{ fontWeight: 500 }}>Plenary Session</div>
                            <div style={{ fontSize: 13, color: '#94a3b8' }}>26 Nov 2025 (PM)</div>
                          </div>
                        </Checkbox>
                      </Form.Item>
                    </Col>
                  )}
                </Row>
              </div>
            </Col>

            {/* Form Actions */}
            <Col xs={24}>
              <div style={{ marginTop: 32, display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                <Button
                  size="large"
                  icon={<CloseOutlined />}
                  onClick={() => navigate('/my-entries')}
                  disabled={loading}
                  style={{
                    borderColor: 'rgba(255,255,255,0.2)',
                    color: '#94a3b8',
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="primary"
                  size="large"
                  icon={<SaveOutlined />}
                  htmlType="submit"
                  loading={loading}
                  style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    border: 'none',
                    minWidth: 150,
                  }}
                >
                  Create Entry
                </Button>
              </div>
            </Col>
          </Row>
        </Form>
      </Card>

      {/* Divider */}
      <Divider style={{ borderColor: 'rgba(255,255,255,0.1)', margin: '48px 0' }} />

      {/* Bulk Upload Section */}
      <Card
        style={{
          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
          borderRadius: 16,
          border: '1px solid rgba(102, 126, 234, 0.3)',
          marginBottom: 32,
        }}
        styles={{ body: { padding: 32 } }}
      >
        <Title level={4} style={{ color: '#e2e8f0', marginBottom: 24 }}>
          <FileExcelOutlined style={{ marginRight: 12 }} />
          Bulk Upload Entries via CSV
        </Title>

        <Row gutter={24}>
          <Col xs={24} md={12}>
            <Alert
              message="Quick Bulk Upload"
              description={
                <div>
                  <Paragraph style={{ color: '#94a3b8', marginBottom: 12 }}>
                    Download the CSV template, fill it with attendee details, and upload to create multiple entries at once!
                  </Paragraph>
                  <Paragraph style={{ color: '#94a3b8', marginBottom: 8 }}>
                    <strong>Template includes:</strong>
                  </Paragraph>
                  <ul style={{ color: '#94a3b8', marginLeft: 16 }}>
                    <li>Pre-configured ID type options</li>
                    <li>All required fields (Name, Email, Phone, ID Type, ID Number)</li>
                    <li>Pass selection columns (Exhibition Day 1/2, Interactive, Plenary)</li>
                  </ul>
                </div>
              }
              type="info"
              style={{
                background: 'rgba(79, 172, 254, 0.1)',
                border: '1px solid rgba(79, 172, 254, 0.3)',
              }}
            />

            <Button
              type="primary"
              icon={<DownloadOutlined />}
              onClick={handleDownloadTemplate}
              size="large"
              block
              style={{
                marginTop: 16,
                background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                border: 'none',
                height: 48,
              }}
            >
              Download CSV Template
            </Button>

            <Paragraph style={{ color: '#94a3b8', marginTop: 16, fontSize: 13 }}>
              <strong>Instructions:</strong>
              <br />
              1. Download the template CSV
              <br />
              2. Open in Excel/Google Sheets
              <br />
              3. Replace sample data with actual attendee details
              <br />
              4. For ID_Type: Use Aadhaar/PAN/Passport/Driving License/Voter ID
              <br />
              5. For pass columns: Use "Yes" or "No"
              <br />
              6. Save and upload below
            </Paragraph>
          </Col>

          <Col xs={24} md={12}>
            <div
              style={{
                background: 'rgba(15, 23, 42, 0.5)',
                borderRadius: 12,
                padding: 24,
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              <Title level={5} style={{ color: '#e2e8f0', marginBottom: 16 }}>
                Upload Filled CSV
              </Title>

              <Upload {...uploadProps}>
                <Button
                  icon={<UploadOutlined />}
                  size="large"
                  block
                  style={{
                    height: 64,
                    borderColor: 'rgba(102, 126, 234, 0.5)',
                    color: '#a5b4fc',
                    background: 'rgba(102, 126, 234, 0.1)',
                  }}
                >
                  Click to Select CSV File
                </Button>
              </Upload>

              {csvData.length > 0 && (
                <>
                  <Alert
                    message={`📊 ${csvData.length} entries loaded | ${stats?.remaining_quota || 0} slots remaining`}
                    type="success"
                    style={{ marginTop: 16 }}
                  />

                  {/* Preview table - first 5 rows */}
                  <div style={{ marginTop: 16 }}>
                    <Text style={{ color: '#e2e8f0', fontWeight: 500, marginBottom: 8, display: 'block' }}>
                      Preview (First 5 rows):
                    </Text>
                    <Table
                      dataSource={csvData.slice(0, 5)}
                      columns={[
                        { title: 'Name', dataIndex: 'Name', key: 'Name', width: 150, ellipsis: true },
                        { title: 'Email', dataIndex: 'Email', key: 'Email', width: 150, ellipsis: true },
                        { title: 'Phone', dataIndex: 'Phone', key: 'Phone', width: 100 },
                        { title: 'ID Type', dataIndex: 'ID_Type', key: 'ID_Type', width: 80 },
                      ]}
                      pagination={false}
                      size="small"
                      scroll={{ x: true }}
                      style={{ marginTop: 8 }}
                    />
                  </div>

                  {csvData.length > (stats?.remaining_quota || 0) && (
                    <Alert
                      message={`⚠️ Cannot upload ${csvData.length} entries. You only have ${stats?.remaining_quota || 0} slots remaining.`}
                      type="error"
                      showIcon
                      style={{ marginTop: 16 }}
                    />
                  )}

                  <Button
                    type="primary"
                    icon={<SaveOutlined />}
                    onClick={handleBulkUpload}
                    loading={uploading}
                    disabled={csvData.length > (stats?.remaining_quota || 0)}
                    size="large"
                    block
                    style={{
                      marginTop: 16,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      border: 'none',
                      height: 48,
                    }}
                  >
                    {uploading ? 'Processing...' : '🚀 Process & Upload Entries'}
                  </Button>

                  {uploading && (
                    <Progress
                      percent={Math.round(uploadProgress)}
                      status="active"
                      style={{ marginTop: 16 }}
                    />
                  )}
                </>
              )}
            </div>
          </Col>
        </Row>
      </Card>
    </Layout>
  );
}
