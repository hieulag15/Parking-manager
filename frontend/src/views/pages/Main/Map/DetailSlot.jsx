import React from 'react';
import { Image, Row, Col, Flex, Typography, theme } from 'antd';
import IMG_LISENCE from '~/assets/images/lisence.png';
import { InnerDetailFloorStyled } from './style';

const eventNames = {
  in: 'Xe vào',
  out: 'Xe ra'
};

const personInfo = {
  name: 'Chủ xe',
  job: 'Nghề nghiệp',
  department: 'Đơn vị',
  phone: 'SĐT'
};

function DetailSlot({ position, zone, vehicle, driver }) {
  const { token } = theme.useToken();
  const { colorTextSecondary } = token;

  // driver = {
  //   name: 'fjgsljgs',
  //   adress: 'TP HCM',
  //   phone: '1234567890',
  //   email: 'minhtc1910@gmail.com',
  //   job: 'Giảng viên'
  // };

  // vehicle = {
  //   _id: '654a1fd36a0751a7e7c0b9ef',
  //   driverId: '6555eeb9e570d29a3c1f67ab',
  //   licenePlate: '12A-2171',
  //   type: 'Car',
  //   createdAt: 1699356625436,
  //   updatedAt: null,
  //   _destroy: false
  // };

  let driverInfo = [];

  driver = {
    ...driver,
    ...driver?.driver
  };
  let i = 0;
  for (const [key, value] of Object.entries(personInfo)) {
    driverInfo.push(
      <Typography.Text key={'info' + i}>
        <span className="label">{value}</span>
        <span className="value">
          {': '} {(driver && driver[key]) || 'Không xác định'}
        </span>
      </Typography.Text>
    );
    i++;
  }

  return (
    <InnerDetailFloorStyled>
      <Row className="detail-slot" gutter={{ xs: 4, sm: 8, md: 12 }}>
        <Col span={8}>
          <Flex vertical={true} align="center" gap={4}>
            <Image id="eventLisenceImg" src={IMG_LISENCE} preview={false} />
            <Typography.Text id="eventLisencePlate" strong>
              {vehicle.licensePlate}
            </Typography.Text>
          </Flex>
        </Col>
        <Col span={16}>
          <Flex justify="space-evenly" vertical={true} align="start">
            {driverInfo}
          </Flex>
        </Col>
      </Row>
    </InnerDetailFloorStyled>
  );
}

export default DetailSlot;
