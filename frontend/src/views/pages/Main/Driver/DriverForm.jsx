import React, { useEffect, useState } from 'react';
import { Form, Modal, Input, Select, Button, Space, Card } from 'antd';
import { MinusCircleOutlined, PlusOutlined, CloseOutlined } from '@ant-design/icons';
import { ErrorService, ValidateService } from '~/services';
import { UserApi } from '~/api';
import { useAddDriver, useEditDriver } from '~/hook/hookUser';

const formItemLayout = {
  labelCol: {
    sm: { span: 6 }
  },
  wrapperCol: {
    sm: { span: 18 }
  }
};

function DriverForm({ isOpen, onClose, formAction, onNoti, onMess }) {
  const [form] = Form.useForm();
  // const [loading, setLoading] = useState(false);

  const { mutate: addDriver, isLoading: isAddLoading } = useAddDriver();
  const { mutate: editDriver, isLoading: isEditLoading } = useEditDriver();

  const hanldeClose = () => {
    form.resetFields();
    onClose({});
  };

  useEffect(() => {
    if (formAction.action === 'edit') {
      form.setFieldsValue({ ...formAction.payload });
    }
  }, [formAction]);

  // const handleEdit = async (values) => {
  //   try {
  //     setLoading(true);
  //     const api = await UserApi.editDriver(formAction.payload._id, values);
  //     if (api) {
  //       onMess({ content: 'Chỉnh sửa chủ xe thành công', type: 'success' });
  //     }
  //     onClose({ reload: true });
  //   } catch (error) {
  //     ErrorService.hanldeError(error, onNoti);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleEdit = (values) => {
    console.log('_id update', formAction.payload._id);
    editDriver(
      { _id: formAction.payload._id, payload: values },
      {
        onSuccess: () => {
          onMess({ content: 'Chỉnh sửa chủ xe thành công', type: 'success' });
          onClose({ reload: true });
        },
        onError: (error) => {
          ErrorService.hanldeError(error, onNoti);
        }
      }
    );
  };

  // const handleAdd = async (values) => {
  //   try {
  //     setLoading(true);
  //     const api = await UserApi.addDriver(values);
  //     if (api) {
  //       onMess({ content: 'Thêm chủ xe thành công', type: 'success' });
  //     }
  //     onClose({ reload: true });
  //   } catch (error) {
  //     ErrorService.hanldeError(error, onNoti);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleAdd = (values) => {
    addDriver(values, {
      onSuccess: () => {
        onMess({ content: 'Thêm chủ xe thành công', type: 'success' });
        onClose({ reload: true });
      },
      onError: (error) => {
        ErrorService.hanldeError(error, onNoti);
      }
    });
  };

  const onFinish = (values) => {
    if (formAction.action === 'add') {
      handleAdd(values);
    } else {
      handleEdit(values);
    }
  };

  const isLoading = isAddLoading || isEditLoading;

  return (
    <div className="container-fluid pt-3">
      <Form
        form={form}
        onFinish={onFinish}
        disabled={isLoading}
        {...formItemLayout}
        style={{ maxWidth: 4000 }}>
        <Form.Item name={'name'} label="Họ và tên" rules={[{ required: true }]}>
          <Input placeholder="Nguyễn Văn A" id="nameInput" />
        </Form.Item>

        <Form.Item
          name={'email'}
          label="Email"
          rules={[{ required: true, message: false }, { type: 'email' }]}>
          <Input placeholder="example@gmail.com" id="emailInput" />
        </Form.Item>

        <Form.Item
          name={'phone'}
          label="Số điện thoại"
          validateDebounce={1000}
          rules={[
            { required: true, message: false },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (ValidateService.phone(value)) {
                  return Promise.resolve();
                }

                return Promise.reject();
              }
            })
          ]}>
          <Input placeholder="0357647771" id="phoneInput" addonBefore={'+84'} />
        </Form.Item>
        <Form.Item name={'address'} label="Địa chỉ" rules={[{ required: true, message: false }]}>
          <Input placeholder="Số 1 Võ Văn Ngân, Linh Chiểu" id="addressInput" />
        </Form.Item>
        <Form.Item label="Nghề nghiệp" name={['driver', 'job']} rules={[{ required: true }]}>
          <Select>
            <Select.Option value="Teacher">Giảng viên</Select.Option>
            <Select.Option value="Student">Sinh viên</Select.Option>
            <Select.Option value="Employee">Nhân viên</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="Đơn vị" name={['driver', 'department']} rules={[{ required: true }]}>
          <Input placeholder="Công nghệ thông tin" />
        </Form.Item>
        {/* <Form.Item
          label="Biển số xe"
          name={formAction === 'add' ? ['driver', 'licensePlate', 0] : ['licensePlate']}
          rules={[
            { required: true, message: false },
            ({}) => ({
              validator(_, value) {
                if (ValidateService.licensePlate(value)) {
                  return Promise.resolve();
                }
                return Promise.reject({ message: 'Sai định dạng (VD: 12A-2184)' });
              }
            })
          ]}>
          <Input placeholder="12A-2184" />
        </Form.Item> */}
        <Form.List name="vehicles">
          {(fields, { add, remove }) => (
            <div
              style={{
                display: 'flex',
                rowGap: 16,
                flexDirection: 'column'
              }}>
              {fields.map((field) => (
                <Card
                  size="small"
                  title={`Xe ${field.name + 1}`}
                  key={field.key}
                  extra={
                    <CloseOutlined
                      onClick={() => {
                        remove(field.name);
                      }}
                    />
                  }>
                  <Form.Item
                    label="Biển số xe"
                    name={[field.name, 'licensePlate']}
                    rules={[
                      { required: true, message: false },
                      ({}) => ({
                        validator(_, value) {
                          if (ValidateService.licensePlate(value)) {
                            return Promise.resolve();
                          }
                          return Promise.reject({ message: 'Sai định dạng (VD: 12A-2184)' });
                        }
                      })
                    ]}
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 18 }}>
                    <Input />
                  </Form.Item>
                  <Form.Item
                    label="Loại xe"
                    name={[field.name, 'type']}
                    rules={[{ required: true }]}
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 18 }}>
                    <Select>
                      <Select.Option value="Car">Ô tô</Select.Option>
                      <Select.Option value="Motorbike">Xe máy</Select.Option>
                    </Select>
                  </Form.Item>
                </Card>
              ))}

              <Form.Item
                shouldUpdate={(pre, curr) => pre.vehicle !== curr.vehicle}
                wrapperCol={{ span: 24 }}>
                {({ getFieldValue }) => {
                  const currVeh = getFieldValue('vehicle');
                  const disabled = (currVeh?.length || 0) >= 2;
                  return (
                    <Button disabled={disabled} type="dashed" onClick={() => add()} block>
                      + Thêm một xe
                    </Button>
                  );
                }}
              </Form.Item>
            </div>
          )}
        </Form.List>

        <Form.Item
          wrapperCol={{
            span: 8,
            offset: 16
          }}
          className="mt-4">
          <Space>
            <Button onClick={hanldeClose}>Hủy</Button>
            <Button htmlType="submit" type="primary">
              {formAction.actionText}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
}

export default DriverForm;