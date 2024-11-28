import React, { useState, useContext, useCallback } from 'react'
import { Layout, Card, Button, message, Row, Col, Space, Typography, List } from 'antd'
import { Content, Footer, Header } from '~/views/layouts'
import { QrcodeOutlined, CarOutlined, StopOutlined } from '@ant-design/icons'
import { QrReader } from 'react-qr-reader'
import AppContext from '~/context'
import { useExportVehicle, useFindVehicleInParkingTurn } from '~/hook/hookParking'
import { ErrorService } from '~/services'
import { ParkingApi } from '~/api';

const { Title, Text } = Typography

function Export() {
  const { actions } = useContext(AppContext)
  const [scanning, setScanning] = useState(false)
  const [scannedData, setScannedData] = useState([])
  const { mutate: exportVehicle, isLoading: isExportLoading } = useExportVehicle()
  const [parkingTurns, setParkingTurns] = useState({})

  const handleScan = useCallback(async (data) => {
    if (data) {
      try {
        const parsedData = JSON.parse(data.text)
        setScannedData(prevData => {
          if (!prevData.some(item => item.licensePlate === parsedData.licensePlate)) {
            message.success(`Đã quét thành công: ${parsedData.licensePlate}`)
            return [parsedData, ...prevData]
          }
          return prevData
        })
        // const { data: parkingTurn } = useFindVehicleInParkingTurn({ licensePlate: parsedData.licensePlate })
        const parkingTurn = await ParkingApi.findVehicleInParkingTurn({ licensePlate: parsedData.licensePlate })
        setParkingTurns(prev => ({ ...prev, [parsedData.licensePlate]: parkingTurn }))
      } catch (error) {
        console.error('Error parsing QR data:', error)
        message.error('Định dạng mã QR không hợp lệ')
      }
    }
  }, [])

  const handleError = useCallback((err) => {
    console.error('Camera Error:', err)
    if (err.name === 'NotAllowedError') {
      message.error('Truy cập camera bị từ chối. Vui lòng cho phép truy cập camera trong cài đặt trình duyệt của bạn.')
    } else if (err.name === 'NotFoundError') {
      message.error('Không tìm thấy camera. Vui lòng kết nối camera và thử lại.')
    } else {
      message.error('Lỗi khi quét mã QR. Vui lòng thử lại.')
    }
  }, [])

  const handleExport = (qrData) => {
    exportVehicle(qrData, {
      onSuccess: () => {
        actions.onNoti({
          type: 'success',
          message: 'Xuất xe thành công',
          description: qrData.licensePlate
        })
        setScannedData(prevData => prevData.filter(item => item.licensePlate !== qrData.licensePlate))
        setParkingTurns(prev => {
          const newParkingTurns = { ...prev }
          delete newParkingTurns[qrData.licensePlate]
          return newParkingTurns
        })
      },
      onError: (error) => {
        ErrorService.hanldeError(error, actions.onNoti)
      }
    })
  }

  const handleDelete = (qrData) => {
    setScannedData(prevData => prevData.filter(item => item.licensePlate !== qrData.licensePlate))
  }

  const toggleScanning = useCallback(() => {
    setScanning(prev => !prev)
    if (!scanning) {
      setScannedData([])
    }
  }, [scanning])

  return (
    <Layout className="px-4">
      <Header className="border-1" title={'Xe ra'} />
      <Content className="w-100 py-3">
        <Row gutter={24}>
          <Col span={24} lg={12}>
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
          </Col>
          <Col span={24} lg={12}>
            <Card
              title={<Space><CarOutlined /> Thông tin xe</Space>}
              className="w-full"
            >
              <List
                dataSource={scannedData}
                renderItem={(item) => {
                  const parkingTurn = parkingTurns[item.licensePlate]
                  console.log('parkingTurns hi', parkingTurns)
                  console.log('parkingTurn hi', parkingTurn)
                  return (
                    <List.Item>
                      <List.Item.Meta
                        title={`Biển số xe: ${item.licensePlate}`}
                        description={
                          <Space direction="vertical" className="w-full">
                            {parkingTurn ? (
                              <>
                                <Text>Khu vực: {parkingTurn?.parking?.zone}</Text>
                                <Text>Vị trí: {parkingTurn.position}</Text>
                                <Text>Thời gian vào: {new Date(parkingTurn.start).toLocaleString()}</Text>
                              </>
                            ) : (
                              <Text type="warning">Xe không có trong bãi</Text>
                            )}
                          </Space>
                        }
                      />
                      {parkingTurn ? (
                        <Button
                          type="primary"
                          onClick={() => handleExport(item)}
                          loading={isExportLoading}
                        >
                          Xuất xe
                        </Button>
                      ) : (
                        <Button
                          type="primary"
                          onClick={() => handleDelete(item)}
                        >
                          Xóa
                        </Button>
                      )}
                    </List.Item>
                  )
                }}
                locale={{
                  emptyText: (
                    <div className="h-64 flex items-center justify-center text-gray-400">
                      Thông tin xe sẽ xuất hiện sau khi quét mã QR
                    </div>
                  )
                }}
              />
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  )
}

export default Export