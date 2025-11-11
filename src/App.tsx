import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router';
import { Layout, Typography, Row, Col, Card } from 'antd';
import MergePDF from './components/MergePDF';
import './App.css';

const { Header, Content } = Layout;
const { Title } = Typography;

const App: React.FC = () => {
  return (
    <Router basename='/pdf-lxl'>
       <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/merge-pdf" element={<MergePDF />} />
          </Routes>
      
    </Router>
  );
};

const Home: React.FC = () => {
  const features = [
    { title: '合并 PDF', path: '/merge-pdf', description: '将多个 PDF 文件合并为一个文件' },
    // 你可以在这里添加更多功能
  ];

  return (
    <Layout>
      <Header style={{ background: '#001529', color: '#fff',display:'flex',alignItems:'center',justifyContent:'center' }}>
        <Title level={2} style={{ color: '#fff', margin: 0 }}>
          PDF 处理 - 简易版
        </Title>
      </Header>
      <Content style={{ padding: '40px', background: '#f0f2f5' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <Row gutter={[24, 24]}>
            {features.map((feature, index) => (
              <Col key={index} xs={24} sm={12} md={8} lg={6}>
                <Link to={feature.path}>
                  <Card
                    title={feature.title}
                    hoverable
                    style={{
                      textAlign: 'center',
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                      transition: 'transform 0.3s, box-shadow 0.3s',
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.transform = 'translateY(-5px)';
                      (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.2)';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                      (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                    }}
                  >
                    <p style={{ color: '#595959', margin: 0,textAlign:'left' }}>{feature.description}</p>
                  </Card>
                </Link>
              </Col>
            ))}
          </Row>
        </div>
      </Content>
    </Layout>
  );
};

export default App;
