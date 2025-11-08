import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Row, Col, Button, Typography, Progress } from 'antd';
import {
  PlusOutlined,
  UnorderedListOutlined,
  MailOutlined,
  UserOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  TrophyOutlined,
  CalendarOutlined,
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
      {/* Header Section - Dark Mode */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1e3a8a 0%, #1e293b 100%)',
          borderRadius: 16,
          padding: '48px 32px',
          marginBottom: 32,
          boxShadow: '0 10px 40px rgba(30, 58, 138, 0.4)',
        }}
      >
        <Title level={2} style={{ color: 'white', margin: 0, textAlign: 'center' }}>
          🇮🇳 Swavlamban 2025
        </Title>
        <Title
          level={4}
          style={{ color: '#fbbf24', margin: '8px 0 0 0', fontWeight: 400, textAlign: 'center' }}
        >
          November 25-26, 2025 | Registration System
        </Title>
      </div>

      {/* Welcome Section */}
      <div style={{ marginBottom: 32 }}>
        <Title level={3} style={{ marginBottom: 8, color: '#e2e8f0' }}>
          Dashboard Overview
        </Title>
        <Text style={{ fontSize: 16, color: '#94a3b8' }}>
          Monitor your registration metrics and manage entries efficiently
        </Text>
      </div>

      {/* Stats Cards - Colorful and Modern */}
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
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              borderRadius: 16,
              border: 'none',
              boxShadow: '0 8px 24px rgba(245, 87, 108, 0.25)',
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
                  Remaining Quota
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

      {/* Quota Progress Section */}
      <Card
        style={{
          borderRadius: 16,
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
          background: 'rgba(30, 41, 59, 0.5)',
          marginBottom: 32,
        }}
        styles={{ body: { padding: '32px' } }}
      >
        <Title level={4} style={{ marginBottom: 24, color: '#e2e8f0' }}>
          📊 Quota Usage
        </Title>

        {/* Overall Quota Progress */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
            <Text style={{ color: '#e2e8f0', fontSize: 16, fontWeight: 500 }}>
              Overall Entry Quota
            </Text>
            <Text style={{ color: '#94a3b8', fontSize: 14 }}>
              {stats?.total_entries || 0} / {stats?.max_entries || 0} used
            </Text>
          </div>
          <Progress
            percent={stats ? Math.round((stats.total_entries / stats.max_entries) * 100) : 0}
            strokeColor={{
              '0%': '#667eea',
              '100%': '#764ba2',
            }}
            trailColor="rgba(255,255,255,0.1)"
            strokeWidth={12}
            status={stats && stats.remaining_quota === 0 ? 'exception' : 'active'}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
            <Text style={{ color: '#94a3b8', fontSize: 13 }}>
              {stats?.remaining_quota || 0} slots remaining
            </Text>
            <Text style={{ color: stats && stats.remaining_quota < 10 ? '#f5576c' : '#43e97b', fontSize: 13, fontWeight: 600 }}>
              {stats && stats.remaining_quota < 10 ? '⚠️ Low availability' : '✅ Good availability'}
            </Text>
          </div>
        </div>

        {/* Per-Pass-Type Breakdown */}
        <Title level={5} style={{ marginBottom: 20, color: '#e2e8f0' }}>
          Pass Type Breakdown
        </Title>

        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12}>
            <Card
              size="small"
              style={{
                background: 'rgba(102, 126, 234, 0.1)',
                borderRadius: 12,
                border: '1px solid rgba(102, 126, 234, 0.3)',
              }}
              styles={{ body: { padding: 16 } }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <Text style={{ color: '#e2e8f0', fontSize: 14 }}>
                  <CalendarOutlined style={{ marginRight: 8, color: '#667eea' }} />
                  Exhibition Day 1
                </Text>
                <Text style={{ color: '#667eea', fontWeight: 600, fontSize: 16 }}>
                  {stats?.exhibition_day1_count || 0}
                </Text>
              </div>
              <Progress
                percent={stats && stats.max_entries > 0 ? Math.round((stats.exhibition_day1_count / stats.max_entries) * 100) : 0}
                strokeColor="#667eea"
                trailColor="rgba(102, 126, 234, 0.2)"
                size="small"
                showInfo={false}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12}>
            <Card
              size="small"
              style={{
                background: 'rgba(118, 75, 162, 0.1)',
                borderRadius: 12,
                border: '1px solid rgba(118, 75, 162, 0.3)',
              }}
              styles={{ body: { padding: 16 } }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <Text style={{ color: '#e2e8f0', fontSize: 14 }}>
                  <CalendarOutlined style={{ marginRight: 8, color: '#764ba2' }} />
                  Exhibition Day 2
                </Text>
                <Text style={{ color: '#764ba2', fontWeight: 600, fontSize: 16 }}>
                  {stats?.exhibition_day2_count || 0}
                </Text>
              </div>
              <Progress
                percent={stats && stats.max_entries > 0 ? Math.round((stats.exhibition_day2_count / stats.max_entries) * 100) : 0}
                strokeColor="#764ba2"
                trailColor="rgba(118, 75, 162, 0.2)"
                size="small"
                showInfo={false}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12}>
            <Card
              size="small"
              style={{
                background: 'rgba(79, 172, 254, 0.1)',
                borderRadius: 12,
                border: '1px solid rgba(79, 172, 254, 0.3)',
              }}
              styles={{ body: { padding: 16 } }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <Text style={{ color: '#e2e8f0', fontSize: 14 }}>
                  <CalendarOutlined style={{ marginRight: 8, color: '#4facfe' }} />
                  Interactive Sessions
                </Text>
                <Text style={{ color: '#4facfe', fontWeight: 600, fontSize: 16 }}>
                  {stats?.interactive_sessions_count || 0}
                </Text>
              </div>
              <Progress
                percent={stats && stats.max_entries > 0 ? Math.round((stats.interactive_sessions_count / stats.max_entries) * 100) : 0}
                strokeColor="#4facfe"
                trailColor="rgba(79, 172, 254, 0.2)"
                size="small"
                showInfo={false}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12}>
            <Card
              size="small"
              style={{
                background: 'rgba(67, 233, 123, 0.1)',
                borderRadius: 12,
                border: '1px solid rgba(67, 233, 123, 0.3)',
              }}
              styles={{ body: { padding: 16 } }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <Text style={{ color: '#e2e8f0', fontSize: 14 }}>
                  <CalendarOutlined style={{ marginRight: 8, color: '#43e97b' }} />
                  Plenary Session
                </Text>
                <Text style={{ color: '#43e97b', fontWeight: 600, fontSize: 16 }}>
                  {stats?.plenary_count || 0}
                </Text>
              </div>
              <Progress
                percent={stats && stats.max_entries > 0 ? Math.round((stats.plenary_count / stats.max_entries) * 100) : 0}
                strokeColor="#43e97b"
                trailColor="rgba(67, 233, 123, 0.2)"
                size="small"
                showInfo={false}
              />
            </Card>
          </Col>
        </Row>
      </Card>

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
              Add New Entry
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
              View My Entries
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
              Generate & Email Passes
            </Button>
          </Col>
        </Row>
      </Card>
    </Layout>
  );
}
