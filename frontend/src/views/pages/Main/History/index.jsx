import React, { useContext, useEffect, useState } from 'react';
import { Card, Layout, Row, Table, Typography, Space } from 'antd';
import { Content, Footer, Header } from '~/views/layouts';
import { getColumns } from './data';
import { useSearchParams } from 'react-router-dom';
import CustomedTable from '~/views/components/Table';
import Filter from '~/views/components/Filter';
import { useTranslation } from 'react-i18next';
import { useEvents } from '~/hook/hookMonitor';
import socket from '~/socket';
import { HistoryOutlined, FilterOutlined } from '@ant-design/icons';

const { Title } = Typography;

function History({}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const { t: lag } = useTranslation();
  const pageIndex = Number(searchParams.get('pageIndex')) || 1;
  const pageSize = Number(searchParams.get('pageSize')) || 10;
  const params = { pageSize, pageIndex };
  for (let [key, value] of searchParams.entries()) {
    params[key] = value;
  }

  const { data: eventsData, refetch, isLoading: loading } = useEvents(params);

  const data = eventsData?.data || [];
  const totalCount = eventsData?.totalCount || 0;
  const totalPage = eventsData?.totalPage || 0;

  console.log('data', data);

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

  useEffect(() => {
    refetch();
  }, [JSON.stringify(params)]);

  const onChangeFilter = (values) => {
    setSearchParams(values);
  };

  const events = [
    {
      label: 'Xe vào',
      value: 'in'
    },
    {
      label: 'Xe ra',
      value: 'out'
    }
  ];

  return (
    <Layout className="px-4">
      <Header className="border-1" title={'Lịch sử sự kiện'} />
      <Content className="w-100 py-3">
        <Card className="mb-6 shadow-md">
          <Space className="mb-4" align="center">
            <FilterOutlined className="text-lg text-blue-500" />
            <Title level={4} className="m-0">Bộ lọc</Title>
          </Space>
          <Filter
            filter={params}
            onChange={onChangeFilter}
            filterList={[
              {
                label: 'Sự kiện',
                name: 'name',
                type: 'select',
                inputProps: {
                  options: events.map((event) => ({
                    label: event.label,
                    value: event.value
                  })),
                  allowClear: true,
                  placeholder: 'Chọn'
                }
              },
              {
                label: 'Vị trí',
                name: 'position',
                type: 'input',
                inputProps: {
                  placeholder: 'Nhập'
                }
              },
              {
                label: 'Biển số xe',
                name: 'licensePlate',
                type: 'input',
                inputProps: {
                  placeholder: 'Nhập'
                }
              },
              {
                label: 'Khoảng thời gian',
                name: 'rangeDate',
                type: 'range',
                inputProps: {
                  allowClear: true,
                  format: 'L'
                }
              },
              {
                label: 'Thời gian',
                name: 'timePickerRange',
                type: 'timePickerRange',
                inputProps: {
                  format: 'HH:mm',
                  allowClear: true
                }
              },
              {
                label: 'Tên chủ xe',
                name: 'driverName',
                type: 'input',
                inputProps: {
                  placeholder: 'Nhập'
                }
              }
            ]}
            events={events}
          />
        </Card>
        <Card className="shadow-md">
          <CustomedTable
            dataSource={data}
            filter={params}
            columns={getColumns({ pageSize, pageIndex }, lag)}
            loading={loading}
            totalCount={totalCount}
            totalPage={totalPage}
            pageSize={pageSize}
            pageIndex={pageIndex}
            onChange={onChangeFilter}
            scroll={{ y: 'calc(100vh - 400px)', scrollToFirstRowOnChange: true }}
          />
        </Card>
      </Content>
    </Layout>
  );
}

export default History;