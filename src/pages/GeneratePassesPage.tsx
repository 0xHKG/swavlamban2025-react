import { useState, useEffect } from 'react';
import {
  Card,
  Button,
  Typography,
  Space,
  App,
  Select,
  Row,
  Col,
  Checkbox,
  Progress,
  Spin,
} from 'antd';
import {
  MailOutlined,
  FileTextOutlined,
  DownloadOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import { apiService } from '../services';
import type { Entry } from '../types';
import Layout from '../components/Layout';
import { useAuth } from '../hooks/useAuth';

const { Title, Text } = Typography;
const { Option } = Select;

export default function GeneratePassesPage() {
  const { message } = App.useApp(); // Use App hook for notifications
  const { user } = useAuth();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEntryId, setSelectedEntryId] = useState<number | null>(null);
  const [generatedPasses, setGeneratedPasses] = useState<string[]>([]);
  const [emailStage, setEmailStage] = useState<number>(0); // 0: idle, 1: generating, 2: updating, 3: sending
  const [emailProgress, setEmailProgress] = useState(false);
  const [generateLoading, setGenerateLoading] = useState(false); // Separate loading for Generate Passes button
  const [bulkMode, setBulkMode] = useState(false);
  const [selectedBulkIds, setSelectedBulkIds] = useState<number[]>([]);
  const [passFilters, setPassFilters] = useState({
    exhibition_day1: true,
    exhibition_day2: true,
    interactive_sessions: true,
    plenary: true,
  });
  const [adminPassSelection, setAdminPassSelection] = useState({
    exhibition_day1: true,
    exhibition_day2: true,
    interactive_sessions: true,
    plenary: true,
  });
  const [bulkProgress, setBulkProgress] = useState({ current: 0, total: 0 });
  const [bulkStats, setBulkStats] = useState({ elapsed: 0, avgTime: 0, remaining: 0 });

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    try {
      const data = await apiService.getMyEntries();
      // Sort entries by ID descending (most recent first)
      const sortedData = data.sort((a, b) => b.id - a.id);
      setEntries(sortedData);
      if (sortedData.length > 0) {
        setSelectedEntryId(sortedData[0].id);
      }
    } catch (error) {
      console.error('Failed to load entries:', error);
      message.error('Failed to load entries');
    } finally {
      setLoading(false);
    }
  };

  const selectedEntry = entries.find((e) => e.id === selectedEntryId);

  const handleGeneratePasses = async () => {
    if (!selectedEntry) return;

    try {
      setGenerateLoading(true);
      const result = await apiService.generatePasses(selectedEntry.id, false);
      // Filter out invitation files - only show QR pass files
      const passFiles = result.pass_files.filter(f => !f.toLowerCase().includes('inv-'));
      setGeneratedPasses(passFiles);
      message.success(`✅ Generated ${passFiles.length} pass${passFiles.length === 1 ? '' : 'es'}!`, 10);
      loadEntries();
    } catch (error) {
      console.error('Generate passes error:', error);
      message.error('Failed to generate passes');
    } finally {
      setGenerateLoading(false);
    }
  };

  const handleDownloadPass = async (filename: string) => {
    if (!selectedEntry) return;

    try {
      // Download pass file from backend
      const response = await apiService.api.get(`/api/v1/passes/download/${selectedEntry.id}/${filename}`, {
        responseType: 'blob'
      });

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      message.success(`Downloaded ${filename}`);
    } catch (error) {
      console.error('Download error:', error);
      message.error('Failed to download pass');
    }
  };

  const handleSendEmail = async () => {
    if (!selectedEntry) return;

    try {
      setEmailProgress(true);

      // Stage 1: Generating passes
      setEmailStage(1);
      await new Promise((resolve) => setTimeout(resolve, 500));
      await apiService.generatePasses(selectedEntry.id, false);

      // Stage 2: Updating database
      setEmailStage(2);
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Stage 3: Sending email
      setEmailStage(3);
      await apiService.generatePasses(selectedEntry.id, true);

      setEmailStage(0);
      message.success(`✅ Email sent successfully to ${selectedEntry.email}!`, 10);
      loadEntries();
    } catch (error) {
      message.error('Failed to send email');
      setEmailStage(0);
    } finally {
      setEmailProgress(false);
    }
  };

  const handleBulkSendEmail = async () => {
    if (selectedBulkIds.length === 0) {
      message.warning('Please select entries to send emails');
      return;
    }

    const selectedEntries = entries.filter((e) => selectedBulkIds.includes(e.id));
    const total = selectedEntries.length;

    try {
      setBulkProgress({ current: 0, total });
      const startTime = Date.now();

      for (let i = 0; i < selectedEntries.length; i++) {
        const entry = selectedEntries[i];
        const elapsed = (Date.now() - startTime) / 1000;
        const avgTime = i > 0 ? elapsed / (i + 1) : 10;
        const remaining = (total - (i + 1)) * avgTime;

        setBulkProgress({ current: i + 1, total });
        setBulkStats({ elapsed, avgTime, remaining });

        await apiService.generatePasses(entry.id, true);
      }

      message.success(`✅ Sent emails to ${total} attendees!`);
      setSelectedBulkIds([]);
      setBulkProgress({ current: 0, total: 0 });
      loadEntries();
    } catch (error) {
      message.error('Failed to send bulk emails');
    }
  };

  const filteredEntries = entries.filter((entry) => {
    if (!bulkMode) return false;

    let matches = false;
    if (passFilters.exhibition_day1 && entry.exhibition_day1) matches = true;
    if (passFilters.exhibition_day2 && entry.exhibition_day2) matches = true;
    if (passFilters.interactive_sessions && entry.interactive_sessions) matches = true;
    if (passFilters.plenary && entry.plenary) matches = true;

    return matches;
  });

  const getEmailStageText = () => {
    switch (emailStage) {
      case 1:
        return '🎫 Generating passes...';
      case 2:
        return '💾 Updating database...';
      case 3:
        return '📧 Sending email...';
      default:
        return '';
    }
  };

  if (loading) {
    return (
      <Layout>
        <div style={{ textAlign: 'center', padding: 40 }}>
          <Spin size="large" />
        </div>
      </Layout>
    );
  }

  if (entries.length === 0) {
    return (
      <Layout>
        <Card style={{ textAlign: 'center', padding: 40 }}>
          <Text style={{ color: '#4facfe', fontSize: 16 }}>
            No entries yet. Add entries first to generate passes.
          </Text>
        </Card>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Page Header */}
      <div style={{ marginBottom: 32 }}>
        <Title level={2} style={{ marginBottom: 8, color: '#e2e8f0' }}>
          <FileTextOutlined style={{ marginRight: 12 }} />
          🎫 Generate & Email Passes
        </Title>
        <Text style={{ fontSize: 16, color: '#94a3b8' }}>
          Generate QR code passes and send them via email to attendees
        </Text>
      </div>

      {/* Total Entries Info */}
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
          📊 Total Entries: {entries.length}
        </Text>
      </div>

      <div style={{ height: 24 }} />

      {/* Individual Mode */}
      {!bulkMode && (
        <div>
          {/* Attendee Selector */}
          <Card
            style={{
              background: 'rgba(30, 41, 59, 0.5)',
              borderRadius: 16,
              border: '1px solid rgba(255,255,255,0.1)',
              marginBottom: 24,
            }}
            styles={{ body: { padding: 24 } }}
          >
            <Text style={{ color: '#e2e8f0', display: 'block', marginBottom: 12 }}>
              Select Attendee
            </Text>
            <Select
              size="large"
              value={selectedEntryId}
              onChange={setSelectedEntryId}
              style={{ width: '100%' }}
              placeholder="Select an attendee"
            >
              {entries.map((entry) => (
                <Option key={entry.id} value={entry.id}>
                  {entry.name} (ID: {entry.id})
                </Option>
              ))}
            </Select>
          </Card>

          {/* Attendee Details Display */}
          {selectedEntry && (
            <Card
              style={{
                background: 'rgba(30, 41, 59, 0.5)',
                borderRadius: 16,
                border: '1px solid rgba(255,255,255,0.1)',
                marginBottom: 24,
              }}
              styles={{ body: { padding: 24 } }}
            >
              <Row gutter={24}>
                <Col xs={24} md={12}>
                  <Title level={5} style={{ color: '#e2e8f0', marginBottom: 16 }}>
                    Attendee Details
                  </Title>
                  <Space direction="vertical" size={8}>
                    <Text style={{ color: '#94a3b8' }}>
                      <strong style={{ color: '#e2e8f0' }}>Name:</strong> {selectedEntry.name}
                    </Text>
                    <Text style={{ color: '#94a3b8' }}>
                      <strong style={{ color: '#e2e8f0' }}>Email:</strong> {selectedEntry.email}
                    </Text>
                    <Text style={{ color: '#94a3b8' }}>
                      <strong style={{ color: '#e2e8f0' }}>Phone:</strong> {selectedEntry.phone}
                    </Text>
                  </Space>
                </Col>

                <Col xs={24} md={12}>
                  <Title level={5} style={{ color: '#e2e8f0', marginBottom: 16 }}>
                    Passes Selected
                  </Title>
                  <Space direction="vertical" size={8}>
                    <Text style={{ color: '#94a3b8' }}>
                      <strong style={{ color: '#e2e8f0' }}>Pass Type:</strong>{' '}
                      {selectedEntry.is_exhibitor_pass ? '🏢 Exhibitor Pass' : '👤 Visitor Pass'}
                    </Text>
                    {selectedEntry.is_exhibitor_pass ? (
                      <Text style={{ color: '#43e97b' }}>✅ Exhibitor Pass (25-26 Nov)</Text>
                    ) : (
                      <>
                        {selectedEntry.exhibition_day1 && (
                          <Text style={{ color: '#43e97b' }}>✅ Exhibition Day 1</Text>
                        )}
                        {selectedEntry.exhibition_day2 && (
                          <Text style={{ color: '#43e97b' }}>✅ Exhibition Day 2</Text>
                        )}
                      </>
                    )}
                    {selectedEntry.interactive_sessions && (
                      <Text style={{ color: '#43e97b' }}>✅ Interactive Sessions</Text>
                    )}
                    {selectedEntry.plenary && (
                      <Text style={{ color: '#43e97b' }}>✅ Plenary Session</Text>
                    )}
                  </Space>
                </Col>
              </Row>
            </Card>
          )}

          <div style={{ height: 24 }} />

          {/* Generate Passes Button */}
          <Card
            style={{
              background: 'rgba(30, 41, 59, 0.5)',
              borderRadius: 16,
              border: '1px solid rgba(255,255,255,0.1)',
              marginBottom: 24,
            }}
            styles={{ body: { padding: 24 } }}
          >
            <Button
              type="primary"
              size="large"
              block
              icon={<FileTextOutlined />}
              onClick={handleGeneratePasses}
              loading={generateLoading}
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
              }}
            >
              🎫 Generate Passes
            </Button>
          </Card>

          {/* Download Section */}
          {generatedPasses.length > 0 && (
            <Card
              style={{
                background: 'rgba(30, 41, 59, 0.5)',
                borderRadius: 16,
                border: '1px solid rgba(255,255,255,0.1)',
                marginBottom: 24,
              }}
              styles={{ body: { padding: 24 } }}
            >
              <Title level={4} style={{ color: '#e2e8f0', marginBottom: 16 }}>
                📥 Download Passes
              </Title>
              <Space direction="vertical" size={12} style={{ width: '100%' }}>
                {generatedPasses.map((filename) => (
                  <div
                    key={filename}
                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                  >
                    <Text style={{ color: '#94a3b8' }}>📄 {filename}</Text>
                    <Button
                      icon={<DownloadOutlined />}
                      size="small"
                      onClick={() => handleDownloadPass(filename)}
                    >
                      Download
                    </Button>
                  </div>
                ))}
              </Space>
            </Card>
          )}

          <div style={{ height: 24 }} />

          {/* Email Section */}
          <Card
            style={{
              background: 'rgba(30, 41, 59, 0.5)',
              borderRadius: 16,
              border: '1px solid rgba(255,255,255,0.1)',
              marginBottom: 24,
            }}
            styles={{ body: { padding: 24 } }}
          >
            <Title level={4} style={{ color: '#e2e8f0', marginBottom: 16 }}>
              📧 Generate Passes & Send Email
            </Title>
            {selectedEntry && (
              <div
                style={{
                  padding: '12px 16px',
                  borderRadius: 8,
                  background: 'rgba(79, 172, 254, 0.15)',
                  border: '1px solid rgba(79, 172, 254, 0.3)',
                  marginBottom: 16,
                }}
              >
                <Text style={{ color: '#4facfe' }}>
                  📧 Email will be sent to: <strong>{selectedEntry.email}</strong>
                </Text>
              </div>
            )}

            {emailProgress && emailStage > 0 && (
              <div style={{ marginBottom: 16 }}>
                <Text style={{ color: '#e2e8f0', display: 'block', marginBottom: 8 }}>
                  {getEmailStageText()}
                </Text>
                <Spin />
              </div>
            )}

            <Button
              type="primary"
              size="large"
              block
              icon={<MailOutlined />}
              onClick={handleSendEmail}
              loading={emailProgress}
              style={{
                background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                border: 'none',
              }}
            >
              📧 Generate Passes & Send Email
            </Button>
          </Card>
        </div>
      )}

      <div style={{ height: 24 }} />

      {/* Bulk Email Mode Toggle */}
      <Card
        style={{
          background: 'rgba(30, 41, 59, 0.5)',
          borderRadius: 16,
          border: '1px solid rgba(255,255,255,0.1)',
          marginBottom: 24,
        }}
        styles={{ body: { padding: 24 } }}
      >
        <Title level={4} style={{ color: '#e2e8f0', marginBottom: 16 }}>
          📨 Bulk Email Mode
        </Title>
        <Checkbox checked={bulkMode} onChange={(e) => setBulkMode(e.target.checked)}>
          <Text style={{ color: '#94a3b8' }}>📨 Enable Bulk Email Mode</Text>
        </Checkbox>
      </Card>

      {/* Bulk Mode Content */}
      {bulkMode && (
        <div>
          <div
            style={{
              padding: '12px 16px',
              borderRadius: 8,
              background: 'rgba(79, 172, 254, 0.15)',
              border: '1px solid rgba(79, 172, 254, 0.3)',
              marginBottom: 24,
            }}
          >
            <Text style={{ color: '#4facfe' }}>
              💡 Select multiple attendees below and send all passes in one operation
            </Text>
          </div>

          {/* Pass Type Filters */}
          <Card
            style={{
              background: 'rgba(30, 41, 59, 0.5)',
              borderRadius: 16,
              border: '1px solid rgba(255,255,255,0.1)',
              marginBottom: 24,
            }}
            styles={{ body: { padding: 24 } }}
          >
            <Title level={5} style={{ color: '#e2e8f0', marginBottom: 16 }}>
              🎯 Filter by Pass Type
            </Title>
            <Text style={{ color: '#94a3b8', display: 'block', marginBottom: 16 }}>
              Select which pass types to include:
            </Text>
            <Row gutter={16}>
              <Col xs={12} sm={6}>
                <Checkbox
                  checked={passFilters.exhibition_day1}
                  onChange={(e) =>
                    setPassFilters({ ...passFilters, exhibition_day1: e.target.checked })
                  }
                >
                  <Text style={{ color: '#94a3b8' }}>Exhibition Day 1</Text>
                </Checkbox>
              </Col>
              <Col xs={12} sm={6}>
                <Checkbox
                  checked={passFilters.exhibition_day2}
                  onChange={(e) =>
                    setPassFilters({ ...passFilters, exhibition_day2: e.target.checked })
                  }
                >
                  <Text style={{ color: '#94a3b8' }}>Exhibition Day 2</Text>
                </Checkbox>
              </Col>
              <Col xs={12} sm={6}>
                <Checkbox
                  checked={passFilters.interactive_sessions}
                  onChange={(e) =>
                    setPassFilters({ ...passFilters, interactive_sessions: e.target.checked })
                  }
                >
                  <Text style={{ color: '#94a3b8' }}>Interactive Sessions</Text>
                </Checkbox>
              </Col>
              <Col xs={12} sm={6}>
                <Checkbox
                  checked={passFilters.plenary}
                  onChange={(e) => setPassFilters({ ...passFilters, plenary: e.target.checked })}
                >
                  <Text style={{ color: '#94a3b8' }}>Plenary</Text>
                </Checkbox>
              </Col>
            </Row>
          </Card>

          <div style={{ height: 24 }} />

          {/* Filtered Entries */}
          <div
            style={{
              padding: '12px 16px',
              borderRadius: 8,
              background: 'rgba(79, 172, 254, 0.15)',
              border: '1px solid rgba(79, 172, 254, 0.3)',
              marginBottom: 16,
            }}
          >
            <Text style={{ color: '#4facfe' }}>
              🔍 Showing {filteredEntries.length} attendee(s) matching filters (out of {entries.length}{' '}
              total)
            </Text>
          </div>

          <Card
            style={{
              background: 'rgba(30, 41, 59, 0.5)',
              borderRadius: 16,
              border: '1px solid rgba(255,255,255,0.1)',
              marginBottom: 24,
            }}
            styles={{ body: { padding: 24 } }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <Text style={{ color: '#e2e8f0', fontWeight: 500 }}>Select Attendees:</Text>
              <Checkbox
                checked={selectedBulkIds.length === filteredEntries.length && filteredEntries.length > 0}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedBulkIds(filteredEntries.map((entry) => entry.id));
                  } else {
                    setSelectedBulkIds([]);
                  }
                }}
              >
                <Text style={{ color: '#94a3b8' }}>Select All (filtered)</Text>
              </Checkbox>
            </div>

            <Space direction="vertical" size={12} style={{ width: '100%' }}>
              {filteredEntries.map((entry) => {
                const passes = [];
                if (entry.exhibition_day1) passes.push('Ex-1');
                if (entry.exhibition_day2) passes.push('Ex-2');
                if (entry.interactive_sessions) passes.push('Int');
                if (entry.plenary) passes.push('Ple');

                return (
                  <Checkbox
                    key={entry.id}
                    checked={selectedBulkIds.includes(entry.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedBulkIds([...selectedBulkIds, entry.id]);
                      } else {
                        setSelectedBulkIds(selectedBulkIds.filter((id) => id !== entry.id));
                      }
                    }}
                  >
                    <Text style={{ color: '#94a3b8' }}>
                      {entry.name} - {entry.email} [{passes.join(', ')}]
                    </Text>
                  </Checkbox>
                );
              })}
            </Space>
          </Card>

          {selectedBulkIds.length > 0 && (
            <div
              style={{
                padding: '12px 16px',
                borderRadius: 8,
                background: 'rgba(67, 233, 123, 0.15)',
                border: '1px solid rgba(67, 233, 123, 0.3)',
                marginBottom: 24,
              }}
            >
              <Text style={{ color: '#43e97b' }}>
                ✅ Selected {selectedBulkIds.length} attendee(s)
              </Text>
            </div>
          )}

          {/* Admin Pass Selection */}
          {user?.role === 'admin' && selectedBulkIds.length > 0 && (
            <Card
              style={{
                background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                borderRadius: 16,
                border: '1px solid rgba(102, 126, 234, 0.3)',
                marginBottom: 24,
              }}
              styles={{ body: { padding: 24 } }}
            >
              <Title level={5} style={{ color: '#e2e8f0', marginBottom: 16 }}>
                🎫 Select Passes to Send (Admin Only)
              </Title>
              <div
                style={{
                  padding: '12px 16px',
                  borderRadius: 8,
                  background: 'rgba(79, 172, 254, 0.15)',
                  border: '1px solid rgba(79, 172, 254, 0.3)',
                  marginBottom: 16,
                }}
              >
                <Text style={{ color: '#4facfe' }}>
                  💡 Choose which specific passes to generate and send to the selected attendees
                </Text>
              </div>
              <Row gutter={16}>
                <Col xs={12} sm={6}>
                  <Checkbox
                    checked={adminPassSelection.exhibition_day1}
                    onChange={(e) =>
                      setAdminPassSelection({ ...adminPassSelection, exhibition_day1: e.target.checked })
                    }
                  >
                    <Text style={{ color: '#94a3b8' }}>📅 Exhibition Day 1</Text>
                  </Checkbox>
                </Col>
                <Col xs={12} sm={6}>
                  <Checkbox
                    checked={adminPassSelection.exhibition_day2}
                    onChange={(e) =>
                      setAdminPassSelection({ ...adminPassSelection, exhibition_day2: e.target.checked })
                    }
                  >
                    <Text style={{ color: '#94a3b8' }}>📅 Exhibition Day 2</Text>
                  </Checkbox>
                </Col>
                <Col xs={12} sm={6}>
                  <Checkbox
                    checked={adminPassSelection.interactive_sessions}
                    onChange={(e) =>
                      setAdminPassSelection({
                        ...adminPassSelection,
                        interactive_sessions: e.target.checked,
                      })
                    }
                  >
                    <Text style={{ color: '#94a3b8' }}>🎤 Interactive Sessions</Text>
                  </Checkbox>
                </Col>
                <Col xs={12} sm={6}>
                  <Checkbox
                    checked={adminPassSelection.plenary}
                    onChange={(e) =>
                      setAdminPassSelection({ ...adminPassSelection, plenary: e.target.checked })
                    }
                  >
                    <Text style={{ color: '#94a3b8' }}>🏛️ Plenary</Text>
                  </Checkbox>
                </Col>
              </Row>
            </Card>
          )}

          {/* Time Estimation */}
          {selectedBulkIds.length > 0 && (
            <div
              style={{
                padding: '12px 16px',
                borderRadius: 8,
                background: 'rgba(79, 172, 254, 0.15)',
                border: '1px solid rgba(79, 172, 254, 0.3)',
                marginBottom: 16,
              }}
            >
              <Text style={{ color: '#4facfe' }}>
                ⏱️ Estimated time: ~{((selectedBulkIds.length * 10) / 60).toFixed(1)} minutes (
                {selectedBulkIds.length * 10} seconds) via Mailjet API
              </Text>
            </div>
          )}

          {/* Bulk Send Button */}
          {selectedBulkIds.length > 0 && (
            <Card
              style={{
                background: 'rgba(30, 41, 59, 0.5)',
                borderRadius: 16,
                border: '1px solid rgba(255,255,255,0.1)',
                marginBottom: 24,
              }}
              styles={{ body: { padding: 24 } }}
            >
              <Button
                type="primary"
                size="large"
                block
                icon={<MailOutlined />}
                onClick={handleBulkSendEmail}
                disabled={bulkProgress.total > 0}
                style={{
                  background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                  border: 'none',
                }}
              >
                📧 Generate & Send Bulk Emails
              </Button>

              {bulkProgress.total > 0 && (
                <div style={{ marginTop: 16 }}>
                  <Text style={{ color: '#e2e8f0', display: 'block', marginBottom: 8 }}>
                    📤 Processing {bulkProgress.current}/{bulkProgress.total}
                  </Text>
                  <Progress
                    percent={Math.round((bulkProgress.current / bulkProgress.total) * 100)}
                    status="active"
                  />
                  <div
                    style={{
                      padding: '12px 16px',
                      borderRadius: 8,
                      background: 'rgba(79, 172, 254, 0.15)',
                      border: '1px solid rgba(79, 172, 254, 0.3)',
                      marginTop: 12,
                    }}
                  >
                    <Text style={{ color: '#4facfe' }}>
                      ⏱️ Elapsed: {bulkStats.elapsed.toFixed(1)}s | Remaining: ~
                      {bulkStats.remaining.toFixed(1)}s | Avg: {bulkStats.avgTime.toFixed(1)}s/email via
                      Mailjet API
                    </Text>
                  </div>
                </div>
              )}
            </Card>
          )}
        </div>
      )}
    </Layout>
  );
}
