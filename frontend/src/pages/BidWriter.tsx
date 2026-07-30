import { Card, Row, Col, Progress, Tag, Table, Timeline, Button, Space, Typography } from 'antd';
import { PlayCircleOutlined, PauseCircleOutlined, CheckCircleOutlined, SyncOutlined } from '@ant-design/icons';
import { mockWriters, mockChapterOutline } from '../mock/data';

export default function BidWriter() {
  const totalWords = mockWriters.reduce((s, w) => s + w.wordCount, 0);
  const totalExpected = 120800;
  const overallProgress = Math.round((totalWords / totalExpected) * 100);

  return (
    <div className="page-container">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2>标书生成</h2>
          <span style={{ fontSize: 13, color: '#8c8c8c' }}>6 个 Writer Agent 并行撰写 · 预期 303 页 / 120,800 字</span>
        </div>
        <Space>
          <Button type="primary" icon={<PlayCircleOutlined />}>全部启动</Button>
          <Button icon={<PauseCircleOutlined />}>暂停</Button>
        </Space>
      </div>

      <Card size="small" style={{ marginBottom: 16, background: 'linear-gradient(135deg, #e6f4ff 0%, #f0f5ff 100%)' }}>
        <Row gutter={16}>
          <Col span={8}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 32, fontWeight: 700, color: '#1677ff' }}>{overallProgress}%</div>
              <div style={{ fontSize: 13, color: '#8c8c8c', marginTop: 4 }}>总体进度</div>
              <Progress percent={overallProgress} showInfo={false} style={{ marginTop: 8 }} />
            </div>
          </Col>
          <Col span={8}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 32, fontWeight: 700, color: '#52c41a' }}>{totalWords.toLocaleString()}</div>
              <div style={{ fontSize: 13, color: '#8c8c8c', marginTop: 4 }}>已生成字数 / {totalExpected.toLocaleString()}</div>
            </div>
          </Col>
          <Col span={8}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 32, fontWeight: 700, color: '#722ed1' }}>
                {mockWriters.filter(w => w.status === 'done').length} / {mockWriters.length}
              </div>
              <div style={{ fontSize: 13, color: '#8c8c8c', marginTop: 4 }}>已完成章节</div>
            </div>
          </Col>
        </Row>
      </Card>

      <Row gutter={[16, 16]}>
        <Col span={14}>
          <Card title="Agent 实时状态" size="small">
            {mockWriters.map((w, i) => (
              <div key={w.name} style={{
                padding: '12px',
                marginBottom: 8,
                borderRadius: 8,
                background: w.status === 'done' ? '#f6ffed' : w.status === 'running' ? '#e6f4ff' : '#fafafa',
                border: `1px solid ${w.status === 'done' ? '#b7eb8f' : w.status === 'running' ? '#91caff' : '#f0f0f0'}`,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      width: 28, height: 28, borderRadius: 14,
                      background: w.status === 'done' ? '#52c41a' : w.status === 'running' ? '#1677ff' : '#d9d9d9',
                      color: '#fff', fontSize: 13, fontWeight: 600,
                    }}>{i + 1}</span>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 500 }}>{w.section}</div>
                      <div style={{ fontSize: 12, color: '#8c8c8c' }}>{w.name}</div>
                    </div>
                  </div>
                  <Space>
                    <Tag color={w.status === 'done' ? 'green' : w.status === 'running' ? 'blue' : 'default'}
                         icon={w.status === 'done' ? <CheckCircleOutlined /> : w.status === 'running' ? <SyncOutlined spin /> : undefined}>
                      {w.status === 'done' ? '已完成' : w.status === 'running' ? '撰写中...' : '等待中'}
                    </Tag>
                  </Space>
                </div>
                <Progress
                  percent={w.progress}
                  showInfo={true}
                  strokeColor={w.status === 'done' ? '#52c41a' : '#1677ff'}
                  size="small"
                  format={(p) => `${p}% · ${w.wordCount.toLocaleString()}字`}
                />
              </div>
            ))}
          </Card>
        </Col>
        <Col span={10}>
          <Card title="章节大纲与规划" size="small">
            <Table
              dataSource={mockChapterOutline}
              rowKey="id"
              pagination={false}
              size="small"
              columns={[
                { title: '#', dataIndex: 'id', key: 'id', width: 40 },
                { title: '章节', dataIndex: 'title', key: 'title', ellipsis: true },
                { title: '页数', dataIndex: 'pages', key: 'pages', width: 50 },
                {
                  title: '状态', dataIndex: 'status', key: 'status', width: 80,
                  render: (s: string) => (
                    <Tag color={s === 'done' ? 'green' : s === 'running' ? 'blue' : 'default'}>
                      {s === 'done' ? '完成' : s === 'running' ? '进行中' : '待写'}
                    </Tag>
                  ),
                },
              ]}
            />
          </Card>
          <Card title="技术特性" size="small" style={{ marginTop: 16 }}>
            <Typography.Paragraph style={{ fontSize: 13 }}>
              <ul style={{ paddingLeft: 20, margin: 0 }}>
                <li>Map-Reduce 策略突破长文本瓶颈，支持 700+ 页输出</li>
                <li>共享项目摘要表确保跨章节上下文一致性</li>
                <li>章节级并发，6 个 Agent 独立 context window</li>
                <li>人工润色接口：段落级改写/扩写/缩写</li>
              </ul>
            </Typography.Paragraph>
          </Card>
        </Col>
      </Row>
    </div>
  );
}