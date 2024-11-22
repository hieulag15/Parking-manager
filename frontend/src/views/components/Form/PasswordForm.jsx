import React, { useContext, useEffect, useState } from 'react';
import { Alert, Button, Form, Input, Space, Typography } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone, RedoOutlined } from '@ant-design/icons';
import AppContext from '~/context';
import { ErrorService, ValidateService } from '~/services';
import { UserApi } from '~/api';

function PasswordForm({ isOpen, onClose, noChangeAccount }) {
  const [form] = Form.useForm();
  const { state, actions } = useContext(AppContext);
  const { auth } = state;
  const { onNoti, onMess } = actions;
  const [loading, setLoading] = useState(false);

  const hanldeClose = (action, values) => {
    form.resetFields();
    onClose();
  };

  const onFinish = async (values) => {
    const { info } = auth;
    try {
      setLoading(true);
      delete values.confirmNewPassword;
      const payloay = {
        id: info._id,
        password: values.newPassword,
      };
      const api = await UserApi.changePassword(payloay);
      if (api) {
        onMess({ content: 'Thay đổi mật khẩu thành công', type: 'success' });
      }

      onClose({ afterAction: actions.logout() });
      // onClose();
    } catch (error) {
      ErrorService.hanldeError(error, onNoti);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      form={form}
      autoComplete="off"
      style={{
        maxWidth: 600
      }}
      disabled={loading}
      onFinish={onFinish}
      layout="vertical">
      <div className="py-2">
        {/* <Form.Item
          name={'username'}
          label="Tên tài khoản"
          validateDebounce={1000}
          rules={[{ required: true, message: false }]}>
          <Input placeholder="example" id="usernameinput" disabled={noChangeAccount} />
        </Form.Item> */}
        <Form.Item
          label="Mật khẩu cũ"
          name="password"
          rules={[
            {
              required: true
            }
          ]}>
          <Input.Password visibilityToggle={true} />
        </Form.Item>

        <Form.Item
          label="Mật khẩu mới"
          name="newPassword"
          rules={[
            {
              required: true
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (ValidateService.password(value)) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Mật khẩu không đúng định dạng'));
              }
            })
          ]}>
          <Input.Password visibilityToggle={true} />
        </Form.Item>

        {/* Field */}
        <Form.Item
          label="Xác nhận mật khẩu mới"
          name="confirmNewPassword"
          dependencies={['password']}
          rules={[
            {
              required: true
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('newPassword') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Mật khẩu không trùng khớp'));
              }
            })
          ]}>
          <Input.Password visibilityToggle={true} />
        </Form.Item>

        <Form.Item
          wrapperCol={{
            span: 8,
            offset: 16
          }}
          className="mt-4">
          <Space>
            <Button onClick={hanldeClose}>Hủy</Button>
            <Button htmlType="submit" type="primary">
              Xác nhận
            </Button>
          </Space>
        </Form.Item>
      </div>
    </Form>
  );
}

export default PasswordForm;
