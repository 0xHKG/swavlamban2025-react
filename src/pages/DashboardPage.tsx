import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Row, Col, Button, Typography, Divider } from 'antd';
import {
  PlusOutlined,
  UnorderedListOutlined,
  MailOutlined,
  UserOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  TrophyOutlined,
} from '@ant-design/icons';
import { mockApiService } from '../services/mockApi';
import type { DashboardStats } from '../types';
import Layout from '../components/Layout';

const { Title, Text } = Typography;

export default function DashboardPage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await mockApiService.getDashboardStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      {/* Simple Dashboard Title - Matching Streamlit */}
      <div style={{ marginBottom: 32 }}>
        <Title level={2} style={{ margin: 0, color: '#e2e8f0' }}>
          📊 Dashboard
        </Title>
      </div>

      {/* Stats Cards - Simple Metrics (4 Cards) */}
      <Row gutter={[24, 24]} style={{ marginBottom: 40 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card
            loading={loading}
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: 16,
              border: 'none',
              boxShadow: '0 8px 24px rgba(102, 126, 234, 0.25)',
              height: '100%',
            }}
            styles={{ body: { padding: '24px' } }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14, display: 'block', marginBottom: 8 }}>
                  Total Quota
                </Text>
                <Title level={2} style={{ color: 'white', margin: 0, fontWeight: 700 }}>
                  {stats?.max_entries || 0}
                </Title>
              </div>
              <div
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  borderRadius: 12,
                  padding: 12,
                }}
              >
                <UserOutlined style={{ fontSize: 24, color: 'white' }} />
              </div>
            </div>
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
              height: '100%',
            }}
            styles={{ body: { padding: '24px' } }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14, display: 'block', marginBottom: 8 }}>
                  Entries Added
                </Text>
                <Title level={2} style={{ color: 'white', margin: 0, fontWeight: 700 }}>
                  {stats?.total_entries || 0}
                </Title>
              </div>
              <div
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  borderRadius: 12,
                  padding: 12,
                }}
              >
                <CheckCircleOutlined style={{ fontSize: 24, color: 'white' }} />
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card
            loading={loading}
            style={{
              background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
              borderRadius: 16,
              border: 'none',
              boxShadow: '0 8px 24px rgba(251, 191, 36, 0.25)',
              height: '100%',
            }}
            styles={{ body: { padding: '24px' } }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14, display: 'block', marginBottom: 8 }}>
                  Remaining
                </Text>
                <Title level={2} style={{ color: 'white', margin: 0, fontWeight: 700 }}>
                  {stats?.remaining_quota || 0}
                </Title>
              </div>
              <div
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  borderRadius: 12,
                  padding: 12,
                }}
              >
                <ClockCircleOutlined style={{ fontSize: 24, color: 'white' }} />
              </div>
            </div>
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
              height: '100%',
            }}
            styles={{ body: { padding: '24px' } }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14, display: 'block', marginBottom: 8 }}>
                  Passes Generated
                </Text>
                <Title level={2} style={{ color: 'white', margin: 0, fontWeight: 700 }}>
                  {stats?.passes_generated || 0}
                </Title>
              </div>
              <div
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  borderRadius: 12,
                  padding: 12,
                }}
              >
                <TrophyOutlined style={{ fontSize: 24, color: 'white' }} />
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Divider - Matching Streamlit */}
      <Divider style={{ borderColor: 'rgba(255,255,255,0.1)', margin: '40px 0' }} />

      {/* Quick Actions Section */}
      <Card
        style={{
          borderRadius: 16,
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
          background: 'rgba(30, 41, 59, 0.5)',
        }}
        styles={{ body: { padding: '32px' } }}
      >
        <Title level={4} style={{ marginBottom: 24, color: '#e2e8f0' }}>
          🚀 Quick Actions
        </Title>

        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <Button
              type="primary"
              size="large"
              block
              icon={<PlusOutlined />}
              onClick={() => navigate('/add-entry')}
              style={{
                height: 64,
                fontSize: 16,
                fontWeight: 600,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                borderRadius: 12,
                boxShadow: '0 4px 16px rgba(102, 126, 234, 0.4)',
              }}
            >
              ➕ Add New Entry
            </Button>
          </Col>

          <Col xs={24} md={8}>
            <Button
              size="large"
              block
              icon={<UnorderedListOutlined />}
              onClick={() => navigate('/my-entries')}
              style={{
                height: 64,
                fontSize: 16,
                fontWeight: 600,
                borderRadius: 12,
                borderColor: 'rgba(102, 126, 234, 0.5)',
                color: '#a5b4fc',
                background: 'rgba(102, 126, 234, 0.1)',
              }}
            >
              📝 View My Entries
            </Button>
          </Col>

          <Col xs={24} md={8}>
            <Button
              size="large"
              block
              icon={<MailOutlined />}
              onClick={() => navigate('/generate-passes')}
              style={{
                height: 64,
                fontSize: 16,
                fontWeight: 600,
                borderRadius: 12,
                borderColor: 'rgba(102, 126, 234, 0.5)',
                color: '#a5b4fc',
                background: 'rgba(102, 126, 234, 0.1)',
              }}
            >
              🎫 Generate & Email Passes
            </Button>
          </Col>
        </Row>
      </Card>
    </Layout>
  );
}
