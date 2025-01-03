import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Button, Card, Col, Form, Input, Layout, Radio, Row, Select, Space, Switch } from 'antd';
import { Content, Footer, Header } from '~/views/layouts';
import AppContext from '~/context';
import { ParkingApi, UserApi } from '~/api';
import { ErrorService, ValidateService } from '~/services';
import { SLOTS_A } from '../Map/parkingA';
import { SLOTS_B } from '../Map/parkingB';
import { SLOTS_C } from '../Map/parkingC';
import { useImportVehicle, useExportVehicle, useGetStatus } from '~/hook/hookParking';
import { useGetVehicles } from '~/hook/hookUser';
import { CarOutlined } from '@ant-design/icons';

const formItemLayout = {
  labelCol: {
    sm: { span: 6 }
  },
  wrapperCol: {
    sm: { span: 24 }
  }
};

const zones = ['A', 'B', 'C'];

function Event({}) {
  const { state, actions } = useContext(AppContext);
  const [vehiclesOutParking, setVehiclesOutParking] = useState([]);
  const [vehiclesInParking, setVehiclesInParking] = useState([]);
  const [parkings, setParkings] = useState({});
  const [importForm] = Form.useForm();
  const [exportForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isSelect, setIsSelect] = useState(false);
  const { mutate: importVehicle, isLoading: isImportLoading } = useImportVehicle();
  const { mutate: exportVehicle, isLoading: isExportLoading } = useExportVehicle();
  const occupiedSlots = useMemo(() => {
    const { A: zoneA, B: zoneB, C: zoneC } = parkings;
    return [...(zoneA?.slots || []), ...(zoneB?.slots || []), ...(zoneC?.slots || [])];
  }, [parkings]);

  const { data: vehiclesOut } = useGetVehicles({ status: 'out' });
  const { data: vehiclesIn } = useGetVehicles({ status: 'in' });
  const { data: parkingA } = useGetStatus({ zone: 'A' });
  const { data: parkingB } = useGetStatus({ zone: 'B' });
  const { data: parkingC } = useGetStatus({ zone: 'C' });

  useEffect(() => {
    if (vehiclesOut) {
      setVehiclesOutParking(vehiclesOut);
    }
  }, [vehiclesOut]);

  useEffect(() => {
    if (vehiclesIn) {
      setVehiclesInParking(vehiclesIn);
    }
  }, [vehiclesIn]);

  useEffect(() => {
    if (parkingA && parkingB && parkingC) {
      setParkings({
        A: parkingA,
        B: parkingB,
        C: parkingC
      });
    }
  }, [parkingA, parkingB, parkingC]);

  const handleImport = (values) => {
    importVehicle(values, {
      onSuccess: () => {
        actions.onNoti({
          type: 'success',
          message: 'Nhập xe thành công',
          description: values.licensePlate
        });
      },
      onError: (error) => {
        ErrorService.hanldeError(error, actions.onNoti);
      }
    });
  };

  const handleExport = (values) => {
    exportVehicle(values, {
      onSuccess: () => {
        actions.onNoti({
          type: 'success',
          message: 'Xuất xe thành công',
          description: values.licensePlate
        });
      },
      onError: (error) => {
        ErrorService.hanldeError(error, actions.onNoti);
      }
    });
  };

  return (
    <Layout className="px-4">
      <Header className="border-1" title={'Nhập xuất xe'} />
      <Content className="w-100 py-3">
        <Row gutter={16}>
          <Col span={24} lg={12}>
            <Card
              title={<Space><CarOutlined /> Thông tin xe</Space>}
              extra={
                <Switch
                  checkedChildren="Chọn"
                  unCheckedChildren="Nhập"
                  checked={isSelect}
                  onChange={(checked) => setIsSelect(checked)}
                />
              }
            >
              <Form
                form={importForm}
                onFinish={handleImport}
                layout="vertical"
              >
                <Form.Item
                  name="licensePlate"
                  label="Biển số xe"
                  rules={[
                    { required: true, message: 'Vui lòng nhập biển số xe' },
                    () => ({
                      validator(_, value) {
                        if (ValidateService.licensePlate(value)) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error('Sai định dạng (VD: 12A-2184)'));
                      }
                    })
                  ]}
                >
                  {isSelect ? (
                    <Select placeholder="Chọn biển số xe">
                      {vehiclesOutParking && Array.isArray(vehiclesOutParking) && vehiclesOutParking.map((el) => (
                        <Select.Option key={el.licensePlate} value={el.licensePlate}>
                          {el.licensePlate}
                        </Select.Option>
                      ))}
                    </Select>
                  ) : (
                    <Input placeholder="A1-013" />
                  )}
                </Form.Item>

                {!isSelect && (
                  <Form.Item
                    label="Loại xe"
                    name="type"
                    rules={[{ required: true, message: 'Vui lòng chọn loại xe' }]}
                  >
                    <Select placeholder="Chọn loại xe">
                      <Select.Option value="Car">Ô tô</Select.Option>
                      <Select.Option value="Motorbike">Xe máy</Select.Option>
                    </Select>
                  </Form.Item>
                )}

                <Form.Item name="zone" label="Khu vực" rules={[{ required: true, message: 'Vui lòng chọn khu vực' }]}>
                  <Radio.Group buttonStyle="solid">
                    {zones.map((el) => (
                      <Radio.Button key={el} value={el}>Khu {el}</Radio.Button>
                    ))}
                  </Radio.Group>
                </Form.Item>

                <Form.Item
                  noStyle
                  shouldUpdate={(prevValues, currentValues) => prevValues.zone !== currentValues.zone}
                >
                  {({ getFieldValue }) => {
                    let posList = [];
                    const currZone = getFieldValue('zone');
                    const slots = parkings[currZone]?.slots || [];
                    switch (currZone) {
                      case 'A':
                        posList = SLOTS_A;
                        break;
                      case 'B':
                        posList = SLOTS_B;
                        break;
                      case 'C':
                        posList = SLOTS_C;
                        break;
                    }

                    return (
                      <Form.Item name="position" label="Vị trí" rules={[{ required: true, message: 'Vui lòng chọn vị trí' }]}>
                        <Radio.Group>
                          <Space wrap>
                            {posList.map((el) => {
                              const { position } = el;
                              const isOccupied = slots.findIndex((e) => e.position === position) !== -1;
                              return (
                                <Radio key={position} value={position} disabled={isOccupied}>
                                  {position}
                                </Radio>
                              );
                            })}
                          </Space>
                        </Radio.Group>
                      </Form.Item>
                    );
                  }}
                </Form.Item>

                <Form.Item>
                  <Button type="primary" htmlType="submit" loading={isImportLoading} block>
                    Nhập xe
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </Col>
          <Col span={24} xl={12}>
            <Form
              name="exportVehicleForm"
              form={exportForm}
              onFinish={handleExport}
              disabled={loading}
              layout="vertical"
              {...formItemLayout}
              style={{ maxWidth: 4000 }}>
              <Card
                title="Xuất xe"
                extra={
                  <Form.Item className="mb-0">
                    <Button htmlType="submit" type="primary" danger>
                      Xuất
                    </Button>
                  </Form.Item>
                }>
                <Form.Item
                  name="licensePlate"
                  label="Biển số xe"
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
                    <Select>
                      {vehiclesInParking && Array.isArray(vehiclesInParking) && vehiclesInParking.map((el) => (
                        <Select.Option value={el.licensePlate}>
                          {el.licensePlate}
                        </Select.Option>
                      ))}
                    </Select>
                </Form.Item>
              </Card>
            </Form>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
}

export default Event;
