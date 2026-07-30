import { useState } from 'react';
import { Card, Row, Col, Input, Table, Tag, Statistic, Select, Tabs, List, Typography, Space } from 'antd';
import { SearchOutlined, DatabaseOutlined, FileTextOutlined } from '@ant-design/icons';
import { mockRAGResults, mockRAGStats } from '../mock/data';

export default function RAGKnowledge() {
  const [searchQuery, setSearchQuery] = useState('');
  const [assetType, setAssetType] = useState('all');

  const filtered = searchQuery
    ? mockRAGResults.filter(r => r.title.includes(searchQuery) || r.type.includes(searchQuery))
    : mockRAGResults;

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>企业资产库</h2>
        <span style={{ fontSize: 13, color: '#8c8c8c' }}>历史方案 · 资质证书 · 人员 · 财务 · 案例</span>
      </div>

      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col span={4}>
          <Card size="small"><Statistic title="总文档" value={mockRAGStats.totalDocs} prefix={<DatabaseOutlined />} /></Card>
        </Col>
        <Col span={4}>
          <Card size="small"><Statistic title="历史方案" value={mockRAGStats.solutions} /></Card>
        </Col>
        <Col span={4}>
          <Card size="small"><Statistic title="资质证书" value={mockRAGStats.certificates} /></Card>
        </Col>
        <Col span={4}>
          <Card size="small"><Statistic title="项目案例" value={mockRAGStats.cases} /></Card>
        </Col>
        <Col span={4}>
          <Card size="small"><Statistic title="人员资质" value={mockRAGStats.personnel} /></Card>
        </Col>
        <Col span={4}>
          <Card size="small"><Statistic title="财务报表" value={mockRAGStats.financial} /></Card>
        </Col>
      </Row>

      <Card size="small" style={{ marginBottom: 16 }}>
        <Row gutter={16} align="middle">
          <Col flex="auto">
            <Input.Search
              placeholder="搜索企业知识库（如：政务云、CMMI、审计报告）..."
              enterButton={<><SearchOutlined /> 检索</>}
              size="large"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onSearch={v => setSearchQuery(v)}
            />
          </Col>
          <Col>
            <Select
              value={assetType}
              onChange={setAssetType}
              style={{ width: 140 }}
              options={[
                { value: 'all', label: '全部类型' },
                { value: 'solution', label: '历史方案' },
                { value: 'cert', label: '资质证书' },
                { value: 'case', label: '项目案例' },
                { value: 'person', label: '人员资质' },
                { value: 'finance', label: '财务报表' },
              ]}
            />
          </Col>
        </Row>
      </Card>

      <Tabs
        items={[
          {
            key: 'retrieve',
            label: '语义检索结果',
            children: (
              <Card size="small">
                <List
                  dataSource={filtered}
                  renderItem={(item) => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={<FileTextOutlined style={{ fontSize: 20, color: '#1677ff' }} />}
                        title={item.title}
                        description={
                          <Space>
                            <Tag color="blue">{item.type}</Tag>
                            <span style={{ color: '#8c8c8c', fontSize: 12 }}>
                              相似度: {(item.score * 100).toFixed(0)}%
                            </span>
                          </Space>
                        }
                      />
                    </List.Item>
                  )}
                />
              </Card>
            ),
          },
          {
            key: 'graph',
            label: '知识图谱',
            children: (
              <Card size="small" style={{ minHeight: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography.Text type="secondary">
                  知识图谱可视化 — 展示 客户-行业-产品-案例-人员 多跳关联关系（接入 Neo4j / GraphRAG 后可用）
                </Typography.Text>
              </Card>
            ),
          },
        ]}
      />
    </div>
  );
}