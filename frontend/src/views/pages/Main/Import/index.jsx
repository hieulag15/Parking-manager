import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Button, Card, Col, Form, Input, Layout, Radio, Row, Select, Switch, Space, Typography, message } from 'antd';
import { Content, Footer, Header } from '~/views/layouts';
import AppContext from '~/context';
import { ErrorService, ValidateService } from '~/services';
import { SLOTS_A } from '../Map/parkingA';
import { SLOTS_B } from '../Map/parkingB';
import { SLOTS_C } from '../Map/parkingC';
import { useImportVehicle, useGetStatus } from '~/hook/hookParking';
import { useGetVehicles } from '~/hook/hookUser';
import { QRCodeSVG } from 'qrcode.react';
import { CarOutlined, QrcodeOutlined, StopOutlined } from '@ant-design/icons';
import { QrReader } from 'react-qr-reader';

const { Title, Text } = Typography;

const zones = ['A', 'B', 'C'];

function Import() {
  const { actions } = useContext(AppContext);
  const [vehiclesOutParking, setVehiclesOutParking] = useState([]);
  const [parkings, setParkings] = useState({});
  const [importForm] = Form.useForm();
  const [inputMethod, setInputMethod] = useState('input');
  const [qrData, setQrData] = useState(null);
  const [licensePlate, setLicensePlate] = useState(''); // Thêm trạng thái để lưu trữ giá trị của licensePlate
  const { mutate: importVehicle, isLoading: isImportLoading } = useImportVehicle();

  const { data: vehiclesOut } = useGetVehicles({ status: 'out' });
  const { data: parkingA } = useGetStatus({ zone: 'A' });
  const { data: parkingB } = useGetStatus({ zone: 'B' });
  const { data: parkingC } = useGetStatus({ zone: 'C' });

  const [scanning, setScanning] = useState(false);

  const handleScan = useCallback((result) => {
    if (result) {
      try {
        const parsedData = JSON.parse(result.text);
        importForm.setFieldsValue(parsedData);
        setLicensePlate(parsedData.licensePlate); // Cập nhật giá trị của licensePlate
        setScanning(false);
        message.success(`Đã quét thành công: ${parsedData.licensePlate}`);
      } catch (error) {
        console.error('Error parsing QR data:', error);
        message.error('Định dạng mã QR không hợp lệ');
      }
    }
  }, [importForm]);

  const handleError = useCallback((err) => {
    console.error('Camera Error:', err);
    if (err.name === 'NotAllowedError') {
      message.error('Truy cập camera bị từ chối. Vui lòng cho phép truy cập camera trong cài đặt trình duyệt của bạn.');
    } else if (err.name === 'NotFoundError') {
      message.error('Không tìm thấy camera. Vui lòng kết nối camera và thử lại.');
    } else {
      message.error('Lỗi khi quét mã QR. Vui lòng thử lại.');
    }
  }, []);

  const toggleScanning = useCallback(() => {
    setScanning(prev => !prev);
  }, []);

  useEffect(() => {
    if (vehiclesOut) {
      setVehiclesOutParking(vehiclesOut);
    }
  }, [vehiclesOut]);

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
    const currentTime = new Date().toISOString();
    const qrCodeData = {
      licensePlate: values.licensePlate,
    //   zone: values.zone,
    //   position: values.position,
    //   time: currentTime
    };
    setQrData(qrCodeData);

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

  return (
    <Layout className="px-4">
      <Header className="border-1" title={'Xe vào'} />
      <Content className="w-100 py-3">
        <Row gutter={24}>
        <Col span={24} lg={12}>
          {inputMethod === 'qr' ? (
            <Card
            title={<Space><QrcodeOutlined /> Quét mã QR</Space>}
            className="w-full"
            >
            <div className="relative">
                {scanning ? (
                <>
                    <QrReader
                    onResult={handleScan}
                    onError={handleError}
                    constraints={{
                        facingMode: 'environment'
                    }}
                    className="w-full aspect-square"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative w-48 h-48 border-2 border-red-500">
                        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-red-500" />
                        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-red-500" />
                        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-red-500" />
                        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-red-500" />
                    </div>
                    </div>
                    <div className="text-center mt-4">
                    <Text className="text-gray-500">Đặt mã QR vào khung để quét</Text>
                    </div>
                </>
                ) : (
                <div className="h-64 flex items-center justify-center text-gray-400">
                    Camera đã tắt
                </div>
                )}
                <Button 
                type={scanning ? "default" : "primary"} 
                onClick={toggleScanning} 
                icon={scanning ? <StopOutlined /> : <QrcodeOutlined />}
                className="mt-4"
                block
                >
                {scanning ? "Dừng quét" : "Bắt đầu quét"}
                </Button>
            </div>
            </Card>
            ) : (
            <Card title={<Space><QrcodeOutlined />Mã QR</Space>}>
              {qrData ? (
                <div className="flex justify-center">
                  <QRCodeSVG value={JSON.stringify(qrData)} size={500} />
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center text-gray-400">
                  QR code sẽ xuất hiện sau khi nhập thông tin xe
                </div>
              )}
            </Card>
            )}
          </Col>
          <Col span={24} lg={12}>
            <Card
              title={<Space><CarOutlined /> Thông tin xe</Space>}
              extra={
                <Radio.Group
                  value={inputMethod}
                  onChange={(e) => 
                  {
                    setInputMethod(e.target.value)
                    console.log(inputMethod)
                  }
                  }
                >
                  <Radio.Button value="input">Nhập</Radio.Button>
                  <Radio.Button value="select">Chọn</Radio.Button>
                  <Radio.Button value="qr">Quét mã QR</Radio.Button>
                </Radio.Group>
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
                  {inputMethod === 'qr' ? (
                    <Input placeholder="A1-013" value={licensePlate} readOnly />
                  ) : inputMethod === 'select' ? (
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

                {inputMethod === 'input' && (
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
        </Row>
      </Content>
    </Layout>
  );
}

export default Import;