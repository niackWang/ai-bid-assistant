import { Row, Col, Card, Table, Tag, Descriptions, Alert, Steps, Space, Button } from 'antd';
import { UploadOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { mockScoringItems, mockDisqualifyRules, mockContractRisks, mockRequiredDocs } from '../mock/data';

export default function BidParser() {
  return (
    <div className="page-container">
      <div className="page-header">
        <h2>招标解读</h2>
        <span style={{ fontSize: 13, color: '#8c8c8c' }}>结构化解析 + 废标红线预警 + 合同风险扫描</span>
      </div>

      <Alert
        type="success"
        message="解析完成"
        description="已自动解析 156 页招标文件，提取 5 项打分维度、5 条废标红线、3 项合同风险"
        showIcon
        style={{ marginBottom: 16 }}
      />

      <Card title="项目基本信息" size="small" style={{ marginBottom: 16 }}>
        <Descriptions size="small" column={3}>
          <Descriptions.Item label="项目名称">某市政务云平台建设项目</Descriptions.Item>
          <Descriptions.Item label="采购单位">某市大数据管理局</Descriptions.Item>
          <Descriptions.Item label="预算金额">¥1,280万元</Descriptions.Item>
          <Descriptions.Item label="投标截止">2026-08-30</Descriptions.Item>
          <Descriptions.Item label="项目周期">12个月</Descriptions.Item>
          <Descriptions.Item label="采购方式">公开招标 · 综合评标法</Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title="打分项清单" size="small" style={{ marginBottom: 16 }}>
        <Table
          dataSource={mockScoringItems}
          rowKey="id"
          pagination={false}
          size="small"
          columns={[
            { title: '评分维度', dataIndex: 'dimension', key: 'dimension' },
            { title: '权重', dataIndex: 'weight', key: 'weight', render: (v: number) => `${v}%` },
            { title: '满分', dataIndex: 'maxScore', key: 'maxScore', render: (v: number) => `${v}分` },
          ]}
        />
      </Card>

      <Card title="废标红线预警" size="small" style={{ marginBottom: 16 }}>
        {mockDisqualifyRules.map((rule) => (
          <div key={rule.id} style={{
            padding: '10px 14px', marginBottom: 8, borderRadius: 6, fontSize: 13,
            background: rule.risk === 'critical' ? '#fff1f0' : rule.risk === 'high' ? '#fff2e8' : '#fffbe6',
            border: `1px solid ${rule.risk === 'critical' ? '#ffa39e' : rule.risk === 'high' ? '#ffbb96' : '#ffe58f'}`,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>
                <span style={{
                  display: 'inline-block', width: 8, height: 8, borderRadius: 4,
                  background: rule.risk === 'critical' ? '#cf1322' : rule.risk === 'high' ? '#d4380d' : '#d48806',
                  marginRight: 8,
                }} />
                {rule.rule}
              </span>
              <Space>
                <Tag color={rule.risk === 'critical' ? 'red' : rule.risk === 'high' ? 'orange' : 'gold'}>
                  {rule.risk === 'critical' ? '致命' : rule.risk === 'high' ? '高风险' : '中风险'}
                </Tag>
                <span style={{ color: '#8c8c8c', fontSize: 12 }}>第{rule.sourcePage}页</span>
              </Space>
            </div>
          </div>
        ))}
      </Card>

      <Row gutter={16}>
        {col(12, <>
          <Card title="合同履约风险" size="small">
            {mockContractRisks.map((r, i) => (
              <Alert
                key={i}
                type={r.risk === 'high' ? 'warning' : r.risk === 'medium' ? 'info' : 'success'}
                message={r.clause}
                description={r.comment}
                showIcon
                style={{ marginBottom: 8 }}
              />
            ))}
          </Card>
        </>)}
        {col(12, <>
          <Card title="必传材料清单" size="small">
            <Steps
              direction="vertical"
              size="small"
              current={-1}
              items={mockRequiredDocs.map(doc => ({
                title: doc,
                status: 'process' as const,
                icon: <CheckCircleOutlined />,
              }))}
            />
          </Card>
        </>)}
      </Row>
    </div>
  );
}

function col(span: number, children: React.ReactNode) {
  return <Col span={span}>{children}</Col>;
}