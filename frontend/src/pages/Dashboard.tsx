import { Row, Col, Card, Progress, Statistic, Table, Tag, Timeline } from 'antd';
import {
  FileTextOutlined,
  AlertOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';
import { mockProject, mockWriters, mockDisqualifyRules, mockBidHistory } from '../mock/data';

export default function Dashboard() {
  return (
    <div className="page-container">
      <div className="page-header">
        <h2>仪表盘</h2>
        <span style={{ fontSize: 13, color: '#8c8c8c' }}>项目总览与进度监控</span>
      </div>

      <Row gutter={[16, 16]}>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title="项目进度"
              value={mockProject.progress}
              suffix="%"
              prefix={<ThunderboltOutlined />}
            />
            <Progress percent={mockProject.progress} showInfo={false} style={{ marginTop: 8 }} />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title="预算金额"
              value={mockProject.budget / 10000}
              suffix="万元"
              precision={0}
              prefix={<DollarIcon />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title="Writer Agent 活跃"
              value={mockWriters.filter(w => w.status === 'running').length}
              suffix={`/ ${mockWriters.length}`}
              prefix={<EditIcon />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title="截止日期"
              value={mockProject.deadline}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ fontSize: 18 }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col span={12}>
          <Card title="Writer Agent 状态" size="small">
            {mockWriters.map((w) => (
              <div key={w.name} style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
                  <span>
                    <Tag color={w.status === 'done' ? 'green' : w.status === 'running' ? 'blue' : 'default'}>
                      {w.status === 'done' ? '已完成' : w.status === 'running' ? '撰写中' : '等待中'}
                    </Tag>
                    {w.section}
                  </span>
                  <span style={{ color: '#8c8c8c' }}>{w.progress}% · {w.wordCount.toLocaleString()}字</span>
                </div>
                <Progress
                  percent={w.progress}
                  showInfo={false}
                  strokeColor={w.status === 'done' ? '#52c41a' : '#1677ff'}
                  size="small"
                />
              </div>
            ))}
          </Card>
        </Col>
        <Col span={12}>
          <Card title="废标红线预警" size="small">
            {mockDisqualifyRules.map((rule) => (
              <div key={rule.id} style={{
                padding: '8px 12px',
                marginBottom: 8,
                borderRadius: 6,
                fontSize: 13,
                background: rule.risk === 'critical' ? '#fff1f0' : rule.risk === 'high' ? '#fff2e8' : '#fffbe6',
                border: `1px solid ${rule.risk === 'critical' ? '#ffa39e' : rule.risk === 'high' ? '#ffbb96' : '#ffe58f'}`,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>
                    <span style={{
                      display: 'inline-block',
                      width: 8, height: 8, borderRadius: 4,
                      background: rule.risk === 'critical' ? '#cf1322' : rule.risk === 'high' ? '#d4380d' : '#d48806',
                      marginRight: 8,
                    }} />
                    {rule.rule}
                  </span>
                  <Tag color={rule.risk === 'critical' ? 'red' : rule.risk === 'high' ? 'orange' : 'gold'}>
                    {rule.risk === 'critical' ? '致命' : rule.risk === 'high' ? '高风险' : '中风险'}
                  </Tag>
                </div>
              </div>
            ))}
          </Card>
        </Col>
      </Row>

      <Card title="历史投标记录" size="small" style={{ marginTop: 16 }}>
        <Table
          dataSource={mockBidHistory}
          rowKey="id"
          pagination={false}
          columns={[
            { title: '项目名称', dataIndex: 'project', key: 'project' },
            { title: '客户', dataIndex: 'client', key: 'client' },
            { title: '预算(万)', dataIndex: 'budget', key: 'budget', render: (v: number) => `¥${v}` },
            { title: '结果', dataIndex: 'result', key: 'result',
              render: (v: string) => <Tag color={v === '中标' ? 'green' : 'red'}>{v}</Tag>
            },
            { title: '得分', dataIndex: 'score', key: 'score' },
            { title: '日期', dataIndex: 'date', key: 'date' },
          ]}
          size="small"
        />
      </Card>
    </div>
  );
}

function DollarIcon() {
  return <span style={{ fontSize: 14, fontWeight: 700 }}>¥</span>;
}

function EditIcon() {
  return <FileTextOutlined />;
}