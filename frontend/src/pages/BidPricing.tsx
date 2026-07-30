import { Card, Row, Col, Table, Statistic, Descriptions, Alert, Space, Tag, Typography } from 'antd';
import { mockProject } from '../mock/data';

const pricingItems = [
  { id: 1, category: "云平台软件授权", item: "政务云平台 V3.0", quantity: 1, unitPrice: 3200000, total: 3200000 },
  { id: 2, category: "硬件设备", item: "服务器集群 (20台)", quantity: 1, unitPrice: 2800000, total: 2800000 },
  { id: 3, category: "实施服务", item: "部署与集成服务", quantity: 1, unitPrice: 1800000, total: 1800000 },
  { id: 4, category: "数据迁移", item: "历史数据迁移", quantity: 1, unitPrice: 800000, total: 800000 },
  { id: 5, category: "培训服务", item: "管理员 + 用户培训", quantity: 1, unitPrice: 300000, total: 300000 },
  { id: 6, category: "运维服务", item: "12个月运维支持", quantity: 1, unitPrice: 600000, total: 600000 },
];

const totalPrice = pricingItems.reduce((s, i) => s + i.total, 0);

export default function BidPricing() {
  return (
    <div className="page-container">
      <div className="page-header">
        <h2>商务报价</h2>
        <span style={{ fontSize: 13, color: '#8c8c8c' }}>分项报价 · 综合汇总 · 策略分析</span>
      </div>

      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card size="small"><Statistic title="投标总价" value={totalPrice / 10000} suffix="万元" precision={0} /></Card>
        </Col>
        <Col span={6}>
          <Card size="small"><Statistic title="预算上限" value={mockProject.budget / 10000} suffix="万元" precision={0} /></Card>
        </Col>
        <Col span={6}>
          <Card size="small"><Statistic title="利润率" value={16.8} suffix="%" precision={1} /></Card>
        </Col>
        <Col span={6}>
          <Card size="small"><Statistic title="评分最优区间" value="¥900-1050" suffix="万" valueStyle={{ fontSize: 16 }} /></Card>
        </Col>
      </Row>

      <Card title="分项报价表" size="small" style={{ marginBottom: 16 }}>
        <Table
          dataSource={pricingItems}
          rowKey="id"
          pagination={false}
          size="small"
          summary={() => (
            <Table.Summary.Row>
              <Table.Summary.Cell index={0} colSpan={4}>
                <strong>合计</strong>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={1}>
                <strong style={{ color: '#1677ff', fontSize: 15 }}>¥{totalPrice.toLocaleString()}</strong>
              </Table.Summary.Cell>
            </Table.Summary.Row>
          )}
          columns={[
            { title: '类别', dataIndex: 'category', key: 'category' },
            { title: '明细', dataIndex: 'item', key: 'item' },
            { title: '数量', dataIndex: 'quantity', key: 'quantity', width: 60 },
            { title: '单价(元)', dataIndex: 'unitPrice', key: 'unitPrice', render: (v: number) => `¥${v.toLocaleString()}` },
            { title: '小计(元)', dataIndex: 'total', key: 'total', render: (v: number) => `¥${v.toLocaleString()}` },
          ]}
        />
      </Card>

      <Row gutter={16}>
        <Col span={12}>
          <Card title="历史参考" size="small">
            <Descriptions column={1} size="small">
              <Descriptions.Item label="同类项目均值">¥980万</Descriptions.Item>
              <Descriptions.Item label="同类最低中标">¥820万</Descriptions.Item>
              <Descriptions.Item label="同类最高中标">¥1,180万</Descriptions.Item>
              <Descriptions.Item label="行业平均利润率">15-18%</Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="报价策略建议" size="small">
            <Alert
              type="info"
              message="价格分权重 20%，建议报价在 ¥900-1050万区间"
              description="历史数据显示该区间中标率最高（78%），同时保持 15%+ 利润率。考虑本项目技术方案竞争力强，可适当偏高报价。"
              showIcon
              style={{ marginBottom: 12 }}
            />
            <Typography.Text type="secondary" style={{ fontSize: 13 }}>
              注意：最终报价需经商务负责人审批确认，此分析仅为 AI 辅助参考。
            </Typography.Text>
          </Card>
        </Col>
      </Row>
    </div>
  );
}