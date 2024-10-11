import { Col, Layout, Row } from 'antd'
import React from 'react'
import { Content, Footer } from '~/views/layouts';

function Home() {
  return (
    <Layout className="px-4">
      {/* <Header className="border-1" title={'Dashboard'} /> */}
      <Content className="w-100 py-3">
        <Row id="dashboard-block" gutter={16}>
          <Col className="gutter-row" span={16}>
            DashBoard
          </Col>
          <Col className="gutter-row" span={8}>
            Event
          </Col>
        </Row>
      </Content>
      <Footer />
    </Layout>
  );
}

export default Home