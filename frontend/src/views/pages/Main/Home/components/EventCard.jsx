import { Card, Col, Flex, Image, Row, Typography, theme } from 'antd';
import dayjs from 'dayjs';
import React from 'react';
import IMG_DEVELOPING from '~/assets/images/developing.png';
import CustomedTag from '~/components/CustomedTag';

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

function EventCard({ item }) {
  const { token } = theme.useToken();
  const { geekblue6, blue2, colorTextSecondary, colorText, gold2, gold7 } = token;
  const inColor = {
    primary: geekblue6,
    secondary: blue2
  };
  const outColor = {
    primary: gold7,
    secondary: gold2
  };

  let { name, position, licensePlate, driverName, driverId = {} } = item;
  const color = name === 'in' ? inColor : outColor;
  let rs = [];
  let i = 0;

  //get Driver info: Department and job
  if (driverId && driverId.driver) {
    const { driver } = driverId;
    driverId = {
      ...driverId,
      ...driver
    };
    delete driverId.driver;
  }

  for (const [key, value] of Object.entries(personInfo)) {
    rs.push(
      <Typography.Text key={'info' + i}>
        <span className="label">{value}</span>
        <span className="value">
          {': '} {(driverId && driverId[key]) || 'Không xác định'}
        </span>
      </Typography.Text>
    );
    i++;
  }

  return (
    <Card
      title={dayjs(item.createdAt).format('L LTS')}
      className="event-card"
      style={{
        width: '99%',
        backgroundColor: color.secondary,
        border: `2px solid ${color.primary}`
      }}>
      <div id="eventTag" className="event-tag">
        <CustomedTag entity={name} entityType="event">
          {eventNames[name]}
        </CustomedTag>
      </div>
      <Row gutter={{ xs: 4, sm: 8, md: 12 }}>
        <Col span={8}>
          <Flex vertical={true} align="center" gap={4}>
            <Image
              id="eventLisenceImg"
              src={IMG_DEVELOPING}
              className="p-2"
              preview={false}
              style={{ background: '#FFF', width: 120, height: 120 }}
            />
            <Typography.Text id="eventLisencePlate" strong>{licensePlate}</Typography.Text>
          </Flex>
        </Col>
        <Col span={16}>
          <Flex justify="space-evenly" vertical={true} align="start">
            <Typography.Title
              id="eventZone"
              level={5}
              className="mb-0"
              style={{ color: color.primary }}>
              {'Khu ' + item.zone}
            </Typography.Title>
            {rs}
            {/* <Typography.Text id="eventDriverName">
              <span className="label">Chủ xe: </span>
              <span className="value">{item.driver.name}</span>
            </Typography.Text>
            <Typography.Text id="eventDriverJob">
              <span className="label">Nghề nghiệp: </span>
              <span className="value">{item.driver.job}</span>
            </Typography.Text>
            <Typography.Text id="eventDriverDepartment">
              <span className="label">Đơn vị: </span>
              <span className="value">{item.driver.department}</span>
            </Typography.Text>
            <Typography.Text id="eventDriverPhone">
              <span className="label">SĐT: </span>
              <span className="value">{item.driver.phone}</span>
            </Typography.Text> */}
          </Flex>
        </Col>
      </Row>
    </Card>
  );
}

export default EventCard;
