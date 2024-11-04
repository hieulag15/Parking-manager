import { Button, Divider, Flex, Popconfirm, Row, Skeleton, Space, Typography, theme } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { List } from 'antd';
import InfiniteScroll from 'react-infinite-scroll-component';
import EventCard from './EventCard';
import { MonitorApi } from '~/api';
import { ErrorService } from '~/services';
import AppContext from '~/context';
import { useContext } from 'react';
import { FileExcelOutlined } from '@ant-design/icons';
import { useEvents } from '~/hook/hookMonitor';
import socket from '~/socket';

function EventBlock({}) {
  const { state, actions } = useContext(AppContext);
  const { token } = theme.useToken();
  const [pageSize, setPageSize] = useState(50);
  const [pageIndex, setPageIndex] = useState(1);
  const isMounted = useRef(false);
  const { geekblue6, blue2, colorTextSecondary, colorText, gold2, gold7 } = token;
  const inColor = {
    primary: geekblue6,
    secondary: blue2
  };
  const outColor = {
    primary: gold7,
    secondary: gold2
  };
  const onScroll = (e) => {
    if (e.currentTarget.scrollHeight - e.currentTarget.scrollTop === 400) {
      appendData();
    }
  };

  const params = { pageSize, pageIndex };
  const { data: eventsData, refetch, isFetching: loading } = useEvents(params);

  const data = eventsData?.data || [];

  useEffect(() => {
    refetch();
  }, [state.parkingEvent]);

  //socket
  useEffect(() => {
    const handleParkingUpdated = () => {
      refetch();
    };

    // Config websocket
    socket.on('connect', () => {
      console.log('socket successful');
    });

    socket.on('parkingUpdated', handleParkingUpdated);

    return () => {
      socket.off('connect', () => {
        console.log('socket close');
      });
      socket.off('parkingUpdated', handleParkingUpdated);
    };
  }, [refetch]);

  const onExport = async () => {
    try {
      const api = await MonitorApi.export();
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(new Blob([api]));
      link.download = `output.xlsx`;
      link.click();
    } catch(error) {
      ErrorService.hanldeError(error, actions.onNoti)
    }
  };

  return (
    <div>
      <Row justify="space-between" className="pe-4">
        <Typography.Title level={4}>Sự kiện</Typography.Title>
        <Popconfirm title="Xuất báo cáo ?" onConfirm={onExport} okText="Đồng ý" cancelText="Hủy">
          <Button icon={<FileExcelOutlined />} size="large" type="text" />
        </Popconfirm>
      </Row>

      <div
        id="scrollableDiv"
        style={{
          height: 800,
          overflow: 'auto'
        }}>
        <InfiniteScroll
          dataLength={data.length}
          hasMore={data.length < 50}
          // loader={
          //   <Skeleton
          //     avatar
          //     paragraph={{
          //       rows: 1
          //     }}
          //     active
          //   />
          // }
          endMessage={<Divider plain>Không còn sự kiện khác</Divider>}
          scrollableTarget="scrollableDiv">
          <List
            dataSource={data}
            split={false}
            renderItem={(item, index) => {
              const color = item.type === 'in' ? inColor : outColor;
              return (
                <List.Item key={item.email}>
                  <EventCard item={item} />
                </List.Item>
              );
            }}
          />
        </InfiniteScroll>
      </div>
      {/* <List split={false}>
        <VirtualList
          data={data}
          height={720}
          onScroll={onScroll}
          rowKey={(d) => {
            console.log(d);
            return 1;
          }}>
          {(item, index) => {
            const color = item.type === 'in' ? inColor : outColor;
            return (
              <List.Item>

              </List.Item>
            );
          }}
        </VirtualList>
      </List> */}
    </div>
  );
}

export default EventBlock;
