import { Card, Row, Col, Statistic, Table, Tag, Button, Space, Steps, Typography, Alert } from 'antd';
import { DownloadOutlined, CheckCircleOutlined, ClockCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { mockDeliveryFiles, mockDeliveryChecklist } from '../mock/data';

export default function BidDelivery() {
  const doneCount = mockDeliveryChecklist.filter(c => c.status === 'done').length;
  const totalCount = mockDeliveryChecklist.length;

  return (
    <div className="page-container">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2>交付与归档</h2>
          <span style={{ fontSize: 13, color: '#8c8c8c' }}>一键导出 · 最终检查 · 投标归档</span>
        </div>
        <Space>
          <Button type="primary" icon={<DownloadOutlined />} size="large">
            一键导出标书
          </Button>
        </Space>
      </div>

      <Row gutter={[16, 16]}>
        <Col span={6}>
          <Card size="small">
            <Statistic title="标书总页数" value={366} suffix="页" />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic title="文件大小" value="16.3" suffix="MB" precision={1} />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic title="检查项完成" value={`${doneCount}/${totalCount}`} />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic title="生成耗时" value="3.2" suffix="小时" precision={1} />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col span={16}>
          <Card title="交付文件清单" size="small">
            <Table
              dataSource={mockDeliveryFiles}
              rowKey="name"
              pagination={false}
              size="small"
              columns={[
                { title: '文件名', dataIndex: 'name', key: 'name' },
                { title: '页数', dataIndex: 'pages', key: 'pages', width: 80 },
                { title: '大小', dataIndex: 'size', key: 'size', width: 100 },
                {
                  title: '操作', key: 'action', width: 100,
                  render: () => <Button size="small" icon={<DownloadOutlined />}>下载</Button>,
                },
              ]}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="交付前检查清单" size="small">
            <Steps
              direction="vertical"
              size="small"
              current={doneCount - 1}
              items={mockDeliveryChecklist.map(c => ({
                title: c.item,
                status: c.status === 'done' ? 'finish' as const : 'process' as const,
                icon: c.status === 'done' ? <CheckCircleOutlined /> : <ClockCircleOutlined />,
              }))}
            />
          </Card>
        </Col>
      </Row>

      <Card title="投标归档" size="small" style={{ marginTop: 16 }}>
        <Alert
          type="info"
          message="完成交付后，系统将自动归档标书至企业资产库"
          description="包括：所有章节终稿、审查报告、中标/未中标标记、复盘分析数据。归档后可反哺 RAG 知识库，持续提升后续标书质量。"
          showIcon
          style={{ marginBottom: 16 }}
        />
        <Row gutter={16}>
          <Col span={8}>
            <div style={{ padding: 16, background: '#f6ffed', borderRadius: 8, textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#52c41a' }}>12</div>
              <div style={{ fontSize: 13, color: '#8c8c8c' }}>已归档项目</div>
            </div>
          </Col>
          <Col span={8}>
            <div style={{ padding: 16, background: '#e6f4ff', borderRadius: 8, textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#1677ff' }}>75%</div>
              <div style={{ fontSize: 13, color: '#8c8c8c' }}>历史中标率</div>
            </div>
          </Col>
          <Col span={8}>
            <div style={{ padding: 16, background: '#fffbe6', borderRadius: 8, textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#d48806' }}>3</div>
              <div style={{ fontSize: 13, color: '#8c8c8c' }}>复盘待分析</div>
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  );
}