import { Card, Row, Col, Table, Tag, Progress, Statistic, Alert, Space, Typography, Descriptions } from 'antd';
import { CheckCircleOutlined, WarningOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { mockReviews, mockRiskSummary, mockScoringItems } from '../mock/data';

export default function BidReview() {
  const riskColors: Record<string, string> = { critical: '#cf1322', high: '#d4380d', medium: '#d48806', low: '#389e0d' };

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>智能审查与模拟打分</h2>
        <span style={{ fontSize: 13, color: '#8c8c8c' }}>3 个 Reviewer + Meta Reviewer 多角色审查</span>
      </div>

      <Card size="small" style={{ marginBottom: 16, background: 'linear-gradient(135deg, #f6ffed 0%, #e6f4ff 100%)' }}>
        <Row gutter={16} align="middle">
          <Col span={8}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 40, fontWeight: 700, color: '#1677ff' }}>
                {mockReviews.totalScore}
                <span style={{ fontSize: 16, color: '#8c8c8c', fontWeight: 400 }}> / {mockReviews.maxScore}</span>
              </div>
              <div style={{ fontSize: 13, color: '#8c8c8c', marginTop: 4 }}>模拟总分 · 预计中标概率 85%</div>
            </div>
          </Col>
          <Col span={8}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 16 }}>
                {mockRiskSummary.map((r) => (
                  <div key={r.level} style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 24, fontWeight: 700, color: riskColors[r.level] }}>{r.count}</div>
                    <div style={{ fontSize: 12, color: '#8c8c8c' }}>{r.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </Col>
          <Col span={8}>
            <div style={{ textAlign: 'center' }}>
              <CheckCircleOutlined style={{ fontSize: 32, color: '#52c41a' }} />
              <div style={{ fontSize: 16, fontWeight: 500, color: '#52c41a', marginTop: 4 }}>Meta 审查通过</div>
            </div>
          </Col>
        </Row>
      </Card>

      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Card title="技术评审 (TechnicalReviewer)" size="small">
            <Descriptions column={1} size="small" bordered>
              <Descriptions.Item label="得分">{mockReviews.technicalReview.score} / {mockReviews.technicalReview.max}</Descriptions.Item>
            </Descriptions>
            {mockReviews.technicalReview.items.map((item, i) => (
              <Alert
                key={i}
                type="info"
                message={`${item.item}: ${item.score}/${item.max}分`}
                description={item.comment}
                showIcon
                style={{ marginTop: 8 }}
              />
            ))}
          </Card>
        </Col>
        <Col span={12}>
          <Card title="商务评审 (CommercialReviewer)" size="small">
            <Descriptions column={1} size="small" bordered>
              <Descriptions.Item label="得分">{mockReviews.commercialReview.score} / {mockReviews.commercialReview.max}</Descriptions.Item>
            </Descriptions>
            {mockReviews.commercialReview.items.map((item, i) => (
              <Alert
                key={i}
                type="info"
                message={`${item.item}: ${item.score}/${item.max}分`}
                description={item.comment}
                showIcon
                style={{ marginTop: 8 }}
              />
            ))}
          </Card>
        </Col>
      </Row>

      <Card title="Meta 元审查 · 全局交叉检查" size="small" style={{ marginTop: 16 }}>
        <Row gutter={16}>
          <Col span={8}>
            <div style={{ padding: 12, background: '#f6ffed', borderRadius: 8, textAlign: 'center' }}>
              <CheckCircleOutlined style={{ fontSize: 24, color: '#52c41a' }} />
              <div style={{ fontSize: 14, fontWeight: 500, marginTop: 4 }}>前后一致性</div>
              <div style={{ fontSize: 12, color: '#52c41a' }}>项目名/金额/人员 全部一致</div>
            </div>
          </Col>
          <Col span={8}>
            <div style={{ padding: 12, background: '#f6ffed', borderRadius: 8, textAlign: 'center' }}>
              <CheckCircleOutlined style={{ fontSize: 24, color: '#52c41a' }} />
              <div style={{ fontSize: 14, fontWeight: 500, marginTop: 4 }}>废标红线复检</div>
              <div style={{ fontSize: 12, color: '#52c41a' }}>5/5 项通过 · 0 违规</div>
            </div>
          </Col>
          <Col span={8}>
            <div style={{ padding: 12, background: '#fffbe6', borderRadius: 8, textAlign: 'center' }}>
              <WarningOutlined style={{ fontSize: 24, color: '#d48806' }} />
              <div style={{ fontSize: 14, fontWeight: 500, marginTop: 4 }}>版式规范</div>
              <div style={{ fontSize: 12, color: '#d48806' }}>1 项需调整（图编号格式）</div>
            </div>
          </Col>
        </Row>

        <div style={{ marginTop: 16 }}>
          <Typography.Title level={5} style={{ marginBottom: 8 }}>发现的问题</Typography.Title>
          {mockReviews.metaReview.issues.map((issue, i) => (
            <Alert
              key={i}
              type={issue.severity === 'critical' ? 'error' : issue.severity === 'high' ? 'warning' : 'info'}
              message={issue.item}
              description={issue.desc}
              showIcon
              style={{ marginBottom: 8 }}
            />
          ))}
          {mockReviews.metaReview.issues.length === 0 && (
            <Alert type="success" message="未发现问题，可以交付" showIcon />
          )}
        </div>
      </Card>
    </div>
  );
}