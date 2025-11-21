import { Card, Row, Col, Typography, Divider, Tabs, Collapse, Button } from 'antd';
import {
  EnvironmentOutlined,
  ClockCircleOutlined,
  PhoneOutlined,
  MailOutlined,
  QuestionCircleOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import Layout from '../components/Layout';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { Panel } = Collapse;

export default function EventInfoPage() {
  return (
    <Layout>
      {/* Page Header */}
      <div style={{ marginBottom: 32 }}>
        <Title level={2} style={{ marginBottom: 8, color: '#e2e8f0' }}>
          Event Information Hub
        </Title>
        <Text style={{ fontSize: 16, color: '#94a3b8' }}>
          Your complete guide to Swavlamban 2025
        </Text>
      </div>

      {/* Main Tabs */}
      <Card
        style={{
          background: 'rgba(30, 41, 59, 0.5)',
          borderRadius: 16,
          border: '1px solid rgba(255,255,255,0.1)',
        }}
        styles={{ body: { padding: 24 } }}
      >
        <Tabs defaultActiveKey="1" size="large">
          {/* TAB 1: Venue & Directions */}
          <TabPane tab="📍 Venue & Directions" key="1">
            <Title level={4} style={{ color: '#e2e8f0', marginBottom: 24 }}>
              📍 Venue Information
            </Title>

            {/* Venue Details */}
            <Card
              style={{
                background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                borderRadius: 12,
                border: '1px solid rgba(102, 126, 234, 0.2)',
                marginBottom: 24,
              }}
              styles={{ body: { padding: 24 } }}
            >
              <Title level={5} style={{ color: '#e2e8f0', marginBottom: 16 }}>
                Manekshaw Centre
              </Title>
              <Text style={{ color: '#94a3b8', display: 'block', marginBottom: 12 }}>
                <strong style={{ color: '#e2e8f0' }}>Address:</strong> H4QW+2MW, Khyber Lines, Delhi Cantonment, New Delhi, Delhi 110010
              </Text>
              <Divider style={{ borderColor: 'rgba(255,255,255,0.1)', margin: '16px 0' }} />
              <Text style={{ color: '#94a3b8', display: 'block', marginBottom: 8 }}>
                The event will be held across two main venues within Manekshaw Centre:
              </Text>
              <ul style={{ color: '#94a3b8', marginLeft: 20 }}>
                <li><strong style={{ color: '#e2e8f0' }}>Zorawar Hall</strong> - Main sessions (Interactive Sessions, Plenary)</li>
                <li><strong style={{ color: '#e2e8f0' }}>Exhibition Hall</strong> - Industry exhibitions and booths</li>
              </ul>
            </Card>

            {/* Venue Map Image */}
            <div style={{ marginBottom: 24, textAlign: 'center' }}>
              <img
                src="/venue.png"
                alt="Manekshaw Centre Venue Map"
                style={{
                  width: '100%',
                  maxWidth: '1200px',
                  borderRadius: 12,
                  border: '1px solid rgba(255,255,255,0.2)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                }}
              />
              <Text style={{ color: '#94a3b8', display: 'block', marginTop: 8, fontSize: 13 }}>
                📍 Venue layout showing Seminar Entrance, Exhibition Area, and Parking
              </Text>
            </div>

            {/* Navigation Button */}
            <div style={{ marginBottom: 24 }}>
              <Button
                type="primary"
                size="large"
                icon={<EnvironmentOutlined />}
                href="https://www.google.com/maps/dir/?api=1&destination=28.586103304500742,77.14529897550334"
                target="_blank"
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: 'none',
                  height: 48,
                }}
              >
                📍 Open in Google Maps / Navigate
              </Button>
              <div style={{ marginTop: 12 }}>
                <Text style={{ color: '#94a3b8', fontSize: 13 }}>
                  💡 <strong style={{ color: '#e2e8f0' }}>Tip:</strong> Click the button above to open navigation in your device's default maps app (Google Maps, Apple Maps, etc.)
                </Text>
              </div>
            </div>

            {/* How to Reach */}
            <Title level={5} style={{ color: '#e2e8f0', marginBottom: 16, marginTop: 32 }}>
              🚗 How to Reach
            </Title>

            <Row gutter={24}>
              <Col xs={24} md={12}>
                <Card
                  style={{
                    background: 'rgba(15, 23, 42, 0.5)',
                    borderRadius: 12,
                    border: '1px solid rgba(255,255,255,0.1)',
                  }}
                  styles={{ body: { padding: 20 } }}
                >
                  <Title level={6} style={{ color: '#e2e8f0', marginBottom: 12 }}>By Metro:</Title>
                  <ul style={{ color: '#94a3b8', marginLeft: 20 }}>
                    <li>Nearest Metro Station: <strong style={{ color: '#e2e8f0' }}>Dhaula Kuan</strong> (Airport Express Line)</li>
                    <li>Distance: ~3 km from metro station</li>
                    <li>Auto/taxi available from station</li>
                  </ul>
                  <Divider style={{ borderColor: 'rgba(255,255,255,0.1)', margin: '12px 0' }} />
                  <Title level={6} style={{ color: '#e2e8f0', marginBottom: 12 }}>By Car:</Title>
                  <ul style={{ color: '#94a3b8', marginLeft: 20 }}>
                    <li>Well connected via Ring Road</li>
                    <li>Use GPS: <strong style={{ color: '#e2e8f0' }}>H4QW+2MW</strong> or click navigation button above</li>
                    <li>Ample parking available on premises</li>
                  </ul>
                </Card>
              </Col>

              <Col xs={24} md={12}>
                <Card
                  style={{
                    background: 'linear-gradient(135deg, rgba(240, 147, 251, 0.1) 0%, rgba(245, 87, 108, 0.1) 100%)',
                    borderRadius: 12,
                    border: '1px solid rgba(240, 147, 251, 0.2)',
                  }}
                  styles={{ body: { padding: 20 } }}
                >
                  <Title level={6} style={{ color: '#e2e8f0', marginBottom: 12 }}>Important Notes:</Title>
                  <ul style={{ color: '#94a3b8', marginLeft: 20 }}>
                    <li>⏰ Please arrive 30 minutes before your session</li>
                    <li>🎫 Keep your QR pass ready for scanning</li>
                    <li>🪪 Valid Government ID required</li>
                    <li>🚫 Security check at entrance</li>
                  </ul>
                </Card>
              </Col>
            </Row>
          </TabPane>

          {/* TAB 2: Event Schedule */}
          <TabPane tab="⏰ Event Schedule" key="2">
            <Title level={4} style={{ color: '#e2e8f0', marginBottom: 24 }}>
              ⏰ Complete Event Schedule
            </Title>

            {/* Day 1 */}
            <div style={{ marginBottom: 32 }}>
              <Title level={5} style={{ color: '#667eea', marginBottom: 16 }}>
                Day 1 - Tuesday, 25 November 2025
              </Title>

              {/* Morning Session */}
              <Text style={{ color: '#e2e8f0', display: 'block', marginBottom: 12, fontWeight: 500, fontSize: 15 }}>
                🌅 Morning Session
              </Text>
              <Text style={{ color: '#94a3b8', display: 'block', marginBottom: 16 }}>
                <strong style={{ color: '#e2e8f0' }}>Venue:</strong> Exhibition Hall, Manekshaw Centre
              </Text>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '12px 16px',
                    background: 'rgba(102, 126, 234, 0.1)',
                    borderRadius: 8,
                    border: '1px solid rgba(102, 126, 234, 0.2)',
                  }}
                >
                  <ClockCircleOutlined style={{ color: '#667eea', marginRight: 12, fontSize: 18 }} />
                  <div style={{ flex: 1 }}>
                    <Text style={{ color: '#e2e8f0', fontWeight: 500 }}>0950 - 1030 hrs - </Text>
                    <Text style={{ color: '#e2e8f0' }}>Exhibition Inauguration & CNS Walkaround</Text>
                    <Text style={{ color: '#94a3b8', display: 'block', fontSize: 13 }}>
                      Exhibition Hall
                    </Text>
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '12px 16px',
                    background: 'rgba(102, 126, 234, 0.1)',
                    borderRadius: 8,
                    border: '1px solid rgba(102, 126, 234, 0.2)',
                  }}
                >
                  <ClockCircleOutlined style={{ color: '#667eea', marginRight: 12, fontSize: 18 }} />
                  <div style={{ flex: 1 }}>
                    <Text style={{ color: '#e2e8f0', fontWeight: 500 }}>1045 - 1115 hrs - </Text>
                    <Text style={{ color: '#e2e8f0' }}>Tea & Refreshments</Text>
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '12px 16px',
                    background: 'rgba(102, 126, 234, 0.1)',
                    borderRadius: 8,
                    border: '1px solid rgba(102, 126, 234, 0.2)',
                  }}
                >
                  <ClockCircleOutlined style={{ color: '#667eea', marginRight: 12, fontSize: 18 }} />
                  <div style={{ flex: 1 }}>
                    <Text style={{ color: '#e2e8f0', fontWeight: 500 }}>1100 hrs - </Text>
                    <Text style={{ color: '#e2e8f0' }}>Exhibition Open to All</Text>
                    <Text style={{ color: '#94a3b8', display: 'block', fontSize: 13 }}>
                      Exhibition Hall
                    </Text>
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '12px 16px',
                    background: 'rgba(102, 126, 234, 0.1)',
                    borderRadius: 8,
                    border: '1px solid rgba(102, 126, 234, 0.2)',
                  }}
                >
                  <ClockCircleOutlined style={{ color: '#667eea', marginRight: 12, fontSize: 18 }} />
                  <div style={{ flex: 1 }}>
                    <Text style={{ color: '#e2e8f0', fontWeight: 500 }}>1115 - 1145 hrs - </Text>
                    <Text style={{ color: '#e2e8f0' }}>Presentation to NAs & DAs</Text>
                    <Text style={{ color: '#94a3b8', display: 'block', fontSize: 13 }}>
                      Exhibition Hall
                    </Text>
                  </div>
                </div>
              </div>

              {/* Day 1 Morning Event Flow Image */}
              <div style={{ marginTop: 24, textAlign: 'center' }}>
                <img
                  src="/EF/EF-25.png"
                  alt="Day 1 Morning Event Flow Schedule"
                  style={{
                    width: '100%',
                    maxWidth: '700px',
                    borderRadius: 12,
                    border: '1px solid rgba(102, 126, 234, 0.3)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                  }}
                />
                <Text style={{ color: '#94a3b8', display: 'block', marginTop: 8, fontSize: 13 }}>
                  📅 Morning schedule for November 25, 2025
                </Text>
              </div>

              {/* Afternoon/Evening Session */}
              <Text style={{ color: '#e2e8f0', display: 'block', marginBottom: 12, fontWeight: 500, fontSize: 15, marginTop: 32 }}>
                🌆 Afternoon & Plenary Session
              </Text>
              <Text style={{ color: '#94a3b8', display: 'block', marginBottom: 16 }}>
                <strong style={{ color: '#e2e8f0' }}>Venue:</strong> Zorawar Hall & Exhibition Hall, Manekshaw Centre
              </Text>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '12px 16px',
                    background: 'rgba(102, 126, 234, 0.1)',
                    borderRadius: 8,
                    border: '1px solid rgba(102, 126, 234, 0.2)',
                  }}
                >
                  <ClockCircleOutlined style={{ color: '#667eea', marginRight: 12, fontSize: 18 }} />
                  <div style={{ flex: 1 }}>
                    <Text style={{ color: '#e2e8f0', fontWeight: 500 }}>1500 - 1515 hrs - </Text>
                    <Text style={{ color: '#e2e8f0' }}>Inaugural Address by VCNS & Special Address by President, SIDM</Text>
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '12px 16px',
                    background: 'rgba(102, 126, 234, 0.1)',
                    borderRadius: 8,
                    border: '1px solid rgba(102, 126, 234, 0.2)',
                  }}
                >
                  <ClockCircleOutlined style={{ color: '#667eea', marginRight: 12, fontSize: 18 }} />
                  <div style={{ flex: 1 }}>
                    <Text style={{ color: '#e2e8f0', fontWeight: 500 }}>1515 - 1610 hrs - </Text>
                    <Text style={{ color: '#e2e8f0' }}>Session on 'Innovation & Self-Reliance'</Text>
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '12px 16px',
                    background: 'rgba(102, 126, 234, 0.1)',
                    borderRadius: 8,
                    border: '1px solid rgba(102, 126, 234, 0.2)',
                  }}
                >
                  <ClockCircleOutlined style={{ color: '#667eea', marginRight: 12, fontSize: 18 }} />
                  <div style={{ flex: 1 }}>
                    <Text style={{ color: '#e2e8f0', fontWeight: 500 }}>1600 hrs - </Text>
                    <Text style={{ color: '#e2e8f0' }}>Chief Guest Arrives at Exhibition Hall</Text>
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '12px 16px',
                    background: 'rgba(102, 126, 234, 0.1)',
                    borderRadius: 8,
                    border: '1px solid rgba(102, 126, 234, 0.2)',
                  }}
                >
                  <ClockCircleOutlined style={{ color: '#667eea', marginRight: 12, fontSize: 18 }} />
                  <div style={{ flex: 1 }}>
                    <Text style={{ color: '#e2e8f0', fontWeight: 500 }}>1600 - 1615 hrs - </Text>
                    <Text style={{ color: '#e2e8f0' }}>Chief Guest Visits Exhibition</Text>
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '12px 16px',
                    background: 'rgba(102, 126, 234, 0.1)',
                    borderRadius: 8,
                    border: '1px solid rgba(102, 126, 234, 0.2)',
                  }}
                >
                  <ClockCircleOutlined style={{ color: '#667eea', marginRight: 12, fontSize: 18 }} />
                  <div style={{ flex: 1 }}>
                    <Text style={{ color: '#e2e8f0', fontWeight: 500 }}>1620 hrs - </Text>
                    <Text style={{ color: '#e2e8f0' }}>Chief Guest Arrives at Zorawar Hall</Text>
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '12px 16px',
                    background: 'rgba(102, 126, 234, 0.1)',
                    borderRadius: 8,
                    border: '1px solid rgba(102, 126, 234, 0.2)',
                  }}
                >
                  <ClockCircleOutlined style={{ color: '#667eea', marginRight: 12, fontSize: 18 }} />
                  <div style={{ flex: 1 }}>
                    <Text style={{ color: '#e2e8f0', fontWeight: 500 }}>1620 - 1625 hrs - </Text>
                    <Text style={{ color: '#e2e8f0' }}>Welcome Address by CNS</Text>
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '12px 16px',
                    background: 'rgba(102, 126, 234, 0.1)',
                    borderRadius: 8,
                    border: '1px solid rgba(102, 126, 234, 0.2)',
                  }}
                >
                  <ClockCircleOutlined style={{ color: '#667eea', marginRight: 12, fontSize: 18 }} />
                  <div style={{ flex: 1 }}>
                    <Text style={{ color: '#e2e8f0', fontWeight: 500 }}>1625 - 1642 hrs - </Text>
                    <Text style={{ color: '#e2e8f0' }}>Felicitations, Release of Documents & MoUs</Text>
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '12px 16px',
                    background: 'rgba(102, 126, 234, 0.1)',
                    borderRadius: 8,
                    border: '1px solid rgba(102, 126, 234, 0.2)',
                  }}
                >
                  <ClockCircleOutlined style={{ color: '#667eea', marginRight: 12, fontSize: 18 }} />
                  <div style={{ flex: 1 }}>
                    <Text style={{ color: '#e2e8f0', fontWeight: 500 }}>1642 - 1657 hrs - </Text>
                    <Text style={{ color: '#e2e8f0' }}>Address by Chief Guest</Text>
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '12px 16px',
                    background: 'rgba(102, 126, 234, 0.1)',
                    borderRadius: 8,
                    border: '1px solid rgba(102, 126, 234, 0.2)',
                  }}
                >
                  <ClockCircleOutlined style={{ color: '#667eea', marginRight: 12, fontSize: 18 }} />
                  <div style={{ flex: 1 }}>
                    <Text style={{ color: '#e2e8f0', fontWeight: 500 }}>1657 - 1700 hrs - </Text>
                    <Text style={{ color: '#e2e8f0' }}>Vote of Thanks by VCNS</Text>
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '12px 16px',
                    background: 'rgba(102, 126, 234, 0.1)',
                    borderRadius: 8,
                    border: '1px solid rgba(102, 126, 234, 0.2)',
                  }}
                >
                  <ClockCircleOutlined style={{ color: '#667eea', marginRight: 12, fontSize: 18 }} />
                  <div style={{ flex: 1 }}>
                    <Text style={{ color: '#e2e8f0', fontWeight: 500 }}>1700 hrs - </Text>
                    <Text style={{ color: '#e2e8f0' }}>Tea & Departure</Text>
                  </div>
                </div>
              </div>

              {/* Day 1 Afternoon Event Flow Image */}
              <div style={{ marginTop: 24, textAlign: 'center' }}>
                <img
                  src="/EF/EF-PM25.png"
                  alt="Day 1 Afternoon/Plenary Event Flow Schedule"
                  style={{
                    width: '100%',
                    maxWidth: '700px',
                    borderRadius: 12,
                    border: '1px solid rgba(102, 126, 234, 0.3)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                  }}
                />
                <Text style={{ color: '#94a3b8', display: 'block', marginTop: 8, fontSize: 13 }}>
                  📅 Afternoon/Plenary schedule for November 25, 2025
                </Text>
              </div>
            </div>

            <Divider style={{ borderColor: 'rgba(255,255,255,0.1)' }} />

            {/* Day 2 */}
            <div>
              <Title level={5} style={{ color: '#f093fb', marginBottom: 16 }}>
                Day 2 - Wednesday, 26 November 2025
              </Title>

              {/* Morning Sessions */}
              <Text style={{ color: '#e2e8f0', display: 'block', marginBottom: 12, fontWeight: 500, fontSize: 15 }}>
                🌅 Morning Sessions
              </Text>
              <Text style={{ color: '#94a3b8', display: 'block', marginBottom: 16 }}>
                <strong style={{ color: '#e2e8f0' }}>Venue:</strong> Exhibition Hall & Zorawar Hall, Manekshaw Centre
              </Text>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '12px 16px',
                    background: 'rgba(240, 147, 251, 0.1)',
                    borderRadius: 8,
                    border: '1px solid rgba(240, 147, 251, 0.2)',
                  }}
                >
                  <ClockCircleOutlined style={{ color: '#f093fb', marginRight: 12, fontSize: 18 }} />
                  <div style={{ flex: 1 }}>
                    <Text style={{ color: '#e2e8f0', fontWeight: 500 }}>0930 - 1015 hrs - </Text>
                    <Text style={{ color: '#e2e8f0' }}>Registration</Text>
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '12px 16px',
                    background: 'rgba(240, 147, 251, 0.1)',
                    borderRadius: 8,
                    border: '1px solid rgba(240, 147, 251, 0.2)',
                  }}
                >
                  <ClockCircleOutlined style={{ color: '#f093fb', marginRight: 12, fontSize: 18 }} />
                  <div style={{ flex: 1 }}>
                    <Text style={{ color: '#e2e8f0', fontWeight: 500 }}>1030 - 1130 hrs - </Text>
                    <Text style={{ color: '#e2e8f0' }}>Interactive Session I</Text>
                    <Text style={{ color: '#94a3b8', display: 'block', fontSize: 13 }}>
                      Zorawar Hall - Future & Emerging Technologies
                    </Text>
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '12px 16px',
                    background: 'rgba(240, 147, 251, 0.1)',
                    borderRadius: 8,
                    border: '1px solid rgba(240, 147, 251, 0.2)',
                  }}
                >
                  <ClockCircleOutlined style={{ color: '#f093fb', marginRight: 12, fontSize: 18 }} />
                  <div style={{ flex: 1 }}>
                    <Text style={{ color: '#e2e8f0', fontWeight: 500 }}>1130 - 1200 hrs - </Text>
                    <Text style={{ color: '#e2e8f0' }}>Tea Break</Text>
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '12px 16px',
                    background: 'rgba(240, 147, 251, 0.1)',
                    borderRadius: 8,
                    border: '1px solid rgba(240, 147, 251, 0.2)',
                  }}
                >
                  <ClockCircleOutlined style={{ color: '#f093fb', marginRight: 12, fontSize: 18 }} />
                  <div style={{ flex: 1 }}>
                    <Text style={{ color: '#e2e8f0', fontWeight: 500 }}>1200 - 1330 hrs - </Text>
                    <Text style={{ color: '#e2e8f0' }}>Interactive Session II</Text>
                    <Text style={{ color: '#94a3b8', display: 'block', fontSize: 13 }}>
                      Zorawar Hall - Boosting the iDEX Ecosystem
                    </Text>
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '12px 16px',
                    background: 'rgba(240, 147, 251, 0.1)',
                    borderRadius: 8,
                    border: '1px solid rgba(240, 147, 251, 0.2)',
                  }}
                >
                  <ClockCircleOutlined style={{ color: '#f093fb', marginRight: 12, fontSize: 18 }} />
                  <div style={{ flex: 1 }}>
                    <Text style={{ color: '#e2e8f0', fontWeight: 500 }}>1330 - 1500 hrs - </Text>
                    <Text style={{ color: '#e2e8f0' }}>Lunch Break & Exhibition Visit</Text>
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '12px 16px',
                    background: 'rgba(240, 147, 251, 0.1)',
                    borderRadius: 8,
                    border: '1px solid rgba(240, 147, 251, 0.2)',
                  }}
                >
                  <ClockCircleOutlined style={{ color: '#f093fb', marginRight: 12, fontSize: 18 }} />
                  <div style={{ flex: 1 }}>
                    <Text style={{ color: '#e2e8f0', fontWeight: 500 }}>1500 - 1600 hrs - </Text>
                    <Text style={{ color: '#e2e8f0' }}>Interaction of Industry of VCs</Text>
                    <Text style={{ color: '#94a3b8', display: 'block', fontSize: 13 }}>
                      Exhibition Hall
                    </Text>
                  </div>
                </div>
              </div>

              {/* Day 2 Event Flow Image */}
              <div style={{ marginTop: 24, textAlign: 'center' }}>
                <img
                  src="/EF/EF26.png"
                  alt="Day 2 Event Flow Schedule"
                  style={{
                    width: '100%',
                    maxWidth: '700px',
                    borderRadius: 12,
                    border: '1px solid rgba(240, 147, 251, 0.3)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                  }}
                />
                <Text style={{ color: '#94a3b8', display: 'block', marginTop: 8, fontSize: 13 }}>
                  📅 Detailed schedule for November 26, 2025
                </Text>
              </div>
            </div>
          </TabPane>

          {/* TAB 3: Guidelines */}
          <TabPane tab="📋 Guidelines (DOs & DON'Ts)" key="3">
            <Title level={4} style={{ color: '#e2e8f0', marginBottom: 24 }}>
              📋 Event Guidelines - DOs & DON'Ts
            </Title>

            <Card
              style={{
                background: 'linear-gradient(135deg, rgba(240, 147, 251, 0.1) 0%, rgba(245, 87, 108, 0.1) 100%)',
                borderRadius: 12,
                border: '1px solid rgba(240, 147, 251, 0.2)',
                marginBottom: 24,
              }}
              styles={{ body: { padding: 16 } }}
            >
              <Text style={{ color: '#e2e8f0' }}>
                <WarningOutlined style={{ marginRight: 8, color: '#f093fb' }} />
                <strong>Important:</strong> Please review the guidelines carefully for a smooth event experience
              </Text>
            </Card>

            {/* Exhibition Guidelines */}
            <Title level={5} style={{ color: '#e2e8f0', marginBottom: 16 }}>
              🏛️ Exhibition Hall Guidelines
            </Title>
            <Paragraph style={{ color: '#94a3b8', marginBottom: 16 }}>
              Please follow these guidelines when visiting the Exhibition Hall.
            </Paragraph>
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
              <img
                src="/DND/DND_Exhibition.png"
                alt="Exhibition Hall Guidelines - DOs and DONTs"
                style={{
                  width: '100%',
                  maxWidth: '800px',
                  borderRadius: 12,
                  border: '1px solid rgba(102, 126, 234, 0.3)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                }}
              />
            </div>

            <Divider style={{ borderColor: 'rgba(255,255,255,0.1)', margin: '24px 0' }} />

            {/* Plenary Session Guidelines */}
            <Title level={5} style={{ color: '#e2e8f0', marginBottom: 16 }}>
              🏛️ Plenary Session Guidelines (Zorawar Hall)
            </Title>
            <Paragraph style={{ color: '#94a3b8', marginBottom: 16 }}>
              Please follow these guidelines during the Plenary Session in Zorawar Hall.
            </Paragraph>
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
              <img
                src="/DND/DND_Plenary.png"
                alt="Plenary Session Guidelines - DOs and DONTs"
                style={{
                  width: '100%',
                  maxWidth: '800px',
                  borderRadius: 12,
                  border: '1px solid rgba(67, 233, 123, 0.3)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                }}
              />
            </div>

            <Divider style={{ borderColor: 'rgba(255,255,255,0.1)', margin: '24px 0' }} />

            {/* Interactive Sessions Guidelines */}
            <Title level={5} style={{ color: '#e2e8f0', marginBottom: 16 }}>
              🎤 Interactive Sessions Guidelines (Zorawar Hall)
            </Title>
            <Paragraph style={{ color: '#94a3b8', marginBottom: 16 }}>
              Please follow these guidelines during Interactive Sessions in Zorawar Hall.
            </Paragraph>
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
              <img
                src="/DND/DND_Interactive.png"
                alt="Interactive Sessions Guidelines - DOs and DONTs"
                style={{
                  width: '100%',
                  maxWidth: '800px',
                  borderRadius: 12,
                  border: '1px solid rgba(240, 147, 251, 0.3)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                }}
              />
            </div>
          </TabPane>

          {/* TAB 4: Important Info & FAQs */}
          <TabPane tab="📞 Important Info" key="4">
            <Title level={4} style={{ color: '#e2e8f0', marginBottom: 24 }}>
              📞 Important Contacts & Information
            </Title>

            {/* Support Contact */}
            <Card
              style={{
                background: 'linear-gradient(135deg, rgba(67, 233, 123, 0.1) 0%, rgba(56, 249, 215, 0.1) 100%)',
                borderRadius: 12,
                border: '1px solid rgba(67, 233, 123, 0.2)',
                marginBottom: 32,
              }}
              styles={{ body: { padding: 24 } }}
            >
              <Title level={5} style={{ color: '#e2e8f0', marginBottom: 16 }}>
                💬 Event Support
              </Title>
              <div style={{ color: '#94a3b8' }}>
                <div style={{ marginBottom: 8 }}>
                  <PhoneOutlined style={{ marginRight: 8, color: '#43e97b' }} />
                  <strong style={{ color: '#e2e8f0' }}>Phone:</strong> 011-26771528
                </div>
                <div style={{ marginBottom: 8 }}>
                  <MailOutlined style={{ marginRight: 8, color: '#43e97b' }} />
                  <strong style={{ color: '#e2e8f0' }}>Email:</strong> niio-tdac@navy.gov.in
                </div>
                <div style={{ marginBottom: 8 }}>
                  <ClockCircleOutlined style={{ marginRight: 8, color: '#43e97b' }} />
                  <strong style={{ color: '#e2e8f0' }}>Support Hours:</strong> 0900 - 1730 hrs (Mon-Fri)
                </div>
                <Divider style={{ borderColor: 'rgba(255,255,255,0.1)', margin: '12px 0' }} />
                <Text style={{ color: '#94a3b8' }}>
                  For urgent queries during the event, please approach the <strong style={{ color: '#e2e8f0' }}>Help Desk</strong> at the venue.
                </Text>
              </div>
            </Card>

            {/* FAQs */}
            <Title level={5} style={{ color: '#e2e8f0', marginBottom: 16 }}>
              <QuestionCircleOutlined style={{ marginRight: 8 }} />
              Frequently Asked Questions (FAQs)
            </Title>

            <Collapse
              accordion
              ghost
              style={{
                background: 'transparent',
                border: 'none',
              }}
            >
              <Panel
                header={<Text style={{ color: '#e2e8f0', fontSize: 15 }}>🎫 What do I need to bring?</Text>}
                key="1"
                style={{
                  background: 'rgba(15, 23, 42, 0.5)',
                  borderRadius: 8,
                  border: '1px solid rgba(255,255,255,0.1)',
                  marginBottom: 12,
                }}
              >
                <div style={{ color: '#94a3b8' }}>
                  <strong style={{ color: '#e2e8f0' }}>Essential Items:</strong>
                  <ul style={{ marginLeft: 20, marginTop: 8 }}>
                    <li>QR Pass (printed or on mobile device)</li>
                    <li>Valid Government ID (Aadhar/PAN/Driving License/Passport)</li>
                  </ul>
                  <strong style={{ color: '#e2e8f0' }}>Optional:</strong>
                  <ul style={{ marginLeft: 20, marginTop: 8 }}>
                    <li>Pen and notepad for sessions</li>
                    <li>Business cards for networking</li>
                    <li>Mobile charger/power bank</li>
                    <li>Water bottle (allowed in exhibition area)</li>
                  </ul>
                </div>
              </Panel>

              <Panel
                header={<Text style={{ color: '#e2e8f0', fontSize: 15 }}>🚪 How does entry work?</Text>}
                key="2"
                style={{
                  background: 'rgba(15, 23, 42, 0.5)',
                  borderRadius: 8,
                  border: '1px solid rgba(255,255,255,0.1)',
                  marginBottom: 12,
                }}
              >
                <div style={{ color: '#94a3b8' }}>
                  <strong style={{ color: '#e2e8f0' }}>Entry Process:</strong>
                  <ol style={{ marginLeft: 20, marginTop: 8 }}>
                    <li>Arrive at the designated gate (see venue map)</li>
                    <li>Show your QR pass to security</li>
                    <li>Pass will be scanned and verified</li>
                    <li>Show matching Government ID</li>
                    <li>Proceed to your session/exhibition area</li>
                  </ol>
                  <Divider style={{ borderColor: 'rgba(255,255,255,0.1)', margin: '12px 0' }} />
                  <Text style={{ color: '#94a3b8' }}>
                    <strong style={{ color: '#e2e8f0' }}>Note:</strong> Each pass is valid only for the specified session(s) and date(s).
                  </Text>
                </div>
              </Panel>

              <Panel
                header={<Text style={{ color: '#e2e8f0', fontSize: 15 }}>🅿️ Where can I park?</Text>}
                key="3"
                style={{
                  background: 'rgba(15, 23, 42, 0.5)',
                  borderRadius: 8,
                  border: '1px solid rgba(255,255,255,0.1)',
                  marginBottom: 12,
                }}
              >
                <div style={{ color: '#94a3b8' }}>
                  <strong style={{ color: '#e2e8f0' }}>Parking Information:</strong>
                  <ul style={{ marginLeft: 20, marginTop: 8 }}>
                    <li>Designated parking area marked on venue map (magenta area)</li>
                    <li>Free parking for all registered attendees</li>
                    <li>Limited spaces - carpooling encouraged</li>
                    <li>Security check at parking entrance</li>
                    <li>Follow parking attendant instructions</li>
                  </ul>
                </div>
              </Panel>

              <Panel
                header={<Text style={{ color: '#e2e8f0', fontSize: 15 }}>❓ What if I lose my pass?</Text>}
                key="4"
                style={{
                  background: 'rgba(15, 23, 42, 0.5)',
                  borderRadius: 8,
                  border: '1px solid rgba(255,255,255,0.1)',
                  marginBottom: 12,
                }}
              >
                <div style={{ color: '#94a3b8' }}>
                  <strong style={{ color: '#e2e8f0' }}>Lost Pass Protocol:</strong>
                  <ol style={{ marginLeft: 20, marginTop: 8 }}>
                    <li>Contact event support immediately: niio-tdac@navy.gov.in</li>
                    <li>Visit the Help Desk at venue entrance</li>
                    <li>Present your Government ID for verification</li>
                    <li>Your entry details will be verified from the system</li>
                    <li>Temporary entry may be granted after verification</li>
                  </ol>
                  <Divider style={{ borderColor: 'rgba(255,255,255,0.1)', margin: '12px 0' }} />
                  <Text style={{ color: '#94a3b8' }}>
                    <strong style={{ color: '#e2e8f0' }}>Tip:</strong> Save your QR pass in multiple places (email, phone, cloud).
                  </Text>
                </div>
              </Panel>
            </Collapse>

            {/* Quick Reference */}
            <Title level={5} style={{ color: '#e2e8f0', marginBottom: 16, marginTop: 32 }}>
              📌 Quick Reference
            </Title>

            <Row gutter={24}>
              <Col xs={24} md={12}>
                <Card
                  style={{
                    background: 'rgba(15, 23, 42, 0.5)',
                    borderRadius: 12,
                    border: '1px solid rgba(255,255,255,0.1)',
                  }}
                  styles={{ body: { padding: 20 } }}
                >
                  <div style={{ color: '#94a3b8' }}>
                    <div style={{ marginBottom: 12 }}>
                      <strong style={{ color: '#e2e8f0' }}>Dates:</strong>
                      <ul style={{ marginLeft: 20, marginTop: 4 }}>
                        <li>Day 1: 25 November 2025 (Tuesday)</li>
                        <li>Day 2: 26 November 2025 (Wednesday)</li>
                      </ul>
                    </div>
                    <div style={{ marginBottom: 12 }}>
                      <strong style={{ color: '#e2e8f0' }}>Venue:</strong>
                      <ul style={{ marginLeft: 20, marginTop: 4 }}>
                        <li>Manekshaw Centre, Delhi Cantt</li>
                      </ul>
                    </div>
                    <div>
                      <strong style={{ color: '#e2e8f0' }}>Dress Code:</strong>
                      <ul style={{ marginLeft: 20, marginTop: 4 }}>
                        <li>Business formal / Smart casual</li>
                        <li>Plenary Session: Formal attire mandatory</li>
                      </ul>
                    </div>
                  </div>
                </Card>
              </Col>

              <Col xs={24} md={12}>
                <Card
                  style={{
                    background: 'rgba(15, 23, 42, 0.5)',
                    borderRadius: 12,
                    border: '1px solid rgba(255,255,255,0.1)',
                  }}
                  styles={{ body: { padding: 20 } }}
                >
                  <div style={{ color: '#94a3b8' }}>
                    <div style={{ marginBottom: 12 }}>
                      <strong style={{ color: '#e2e8f0' }}>Timings:</strong>
                      <ul style={{ marginLeft: 20, marginTop: 4 }}>
                        <li>Day 1: 1000-1700 hrs (Exhibition + Plenary)</li>
                        <li>Day 2: 0930-1600 hrs (Exhibition + Interactive Sessions)</li>
                        <li>Be seated by 1430 hrs (Plenary) / 0945 hrs (Interactive)</li>
                      </ul>
                    </div>
                    <div>
                      <strong style={{ color: '#e2e8f0' }}>Support:</strong>
                      <ul style={{ marginLeft: 20, marginTop: 4 }}>
                        <li>Phone: 011-26771528</li>
                        <li>Email: niio-tdac@navy.gov.in</li>
                        <li>Help Desk: At venue</li>
                      </ul>
                    </div>
                  </div>
                </Card>
              </Col>
            </Row>
          </TabPane>
        </Tabs>
      </Card>
    </Layout>
  );
}
