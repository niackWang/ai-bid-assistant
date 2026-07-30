import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu, Typography } from 'antd';
import {
  DashboardOutlined,
  FileSearchOutlined,
  DatabaseOutlined,
  EditOutlined,
  DollarOutlined,
  AuditOutlined,
  SendOutlined,
  GithubOutlined,
} from '@ant-design/icons';

const { Sider, Content, Header } = Layout;

const menuItems = [
  { key: '/', icon: <DashboardOutlined />, label: '仪表盘' },
  { key: '/parse', icon: <FileSearchOutlined />, label: '招标解读' },
  { key: '/knowledge', icon: <DatabaseOutlined />, label: '企业资产库' },
  { key: '/write', icon: <EditOutlined />, label: '标书生成' },
  { key: '/pricing', icon: <DollarOutlined />, label: '商务报价' },
  { key: '/review', icon: <AuditOutlined />, label: '智能审查' },
  { key: '/delivery', icon: <SendOutlined />, label: '交付归档' },
];

export default function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const currentKey = '/' + (location.pathname.split('/')[1] || '');

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        theme="light"
        width={200}
        style={{ borderRight: '1px solid #f0f0f0' }}
      >
        <div style={{
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderBottom: '1px solid #f0f0f0',
        }}>
          <Typography.Title level={5} style={{ margin: 0, color: '#1677ff' }}>
            {collapsed ? 'AI' : 'AI 标书助手'}
          </Typography.Title>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[currentKey]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
          style={{ borderRight: 0, marginTop: 8 }}
        />
      </Sider>
      <Layout>
        <Header style={{
          background: '#fff',
          padding: '0 24px',
          borderBottom: '1px solid #f0f0f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: 48,
        }}>
          <Typography.Text type="secondary" style={{ fontSize: 13 }}>
            当前项目: 某市政务云平台建设项目
          </Typography.Text>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontSize: 13, color: '#8c8c8c', display: 'flex', alignItems: 'center', gap: 4 }}
          >
            <GithubOutlined /> GitHub
          </a>
        </Header>
        <Content style={{ background: '#f5f5f5', minHeight: 'calc(100vh - 48px)' }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}