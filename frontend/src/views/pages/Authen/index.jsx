import React, { useContext, useEffect, useState } from 'react';
import { Button, Form, Image, Input, Layout, Radio, Row, Space } from 'antd';
import LOGO from '~/assets/logo/full-logo.svg';
import { useNavigate } from 'react-router-dom';
import { Content, Footer } from '~/views/layouts';

const roles = [
  {
    value: 'Admin',
    label: 'Admin'
  },
  {
    value: 'Manager',
    label: 'Quản lý'
  }
  // {
  //   value: 'Employee',
  //   label: 'Nhân viên'
  // }
];

function Authen() {
  return (
    <Layout className="vh-100">
      <Content className="d-flex justify-content-center align-items-center w-100">
        <Space direction="vertical" size="large">
          <Row justify="center">
            <Image src={LOGO} preview={false} />
          </Row>
          <Row>
            <Form
              name="loginForm"
              style={{
                width: 400
              }}
              initialValues={{ role: 'Admin' }}
              // onFinish={onFinish}
              // onFinishFailed={onFinishFailed}
              >
              <Form.Item
                name="role"
                className="w-100 d-flex justify-content-center"
                label=""
                wrapperCol={24}>
                <Radio.Group>
                  {roles.map((role) => (
                    <Radio value={role.value}>{role.label}</Radio>
                  ))}
                </Radio.Group>
              </Form.Item>
              <Form.Item
                name="username"
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng không bỏ trống'
                  }
                ]}>
                <Input size="large" placeholder="Tên đăng nhập" />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng không bỏ trống'
                  }
                ]}>
                <Input.Password size="large" placeholder="Mật khẩu" />
              </Form.Item>

              <Form.Item>
                <Button size="large" type="primary" htmlType="submit" block 
                // loading={loading}
                >
                  Đăng nhập
                </Button>
              </Form.Item>
            </Form>
          </Row>
        </Space>
      </Content>
      {/* <Footer /> */}
    </Layout>
  );
}

export default Authen;