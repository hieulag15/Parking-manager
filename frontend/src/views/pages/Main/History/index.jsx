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
import AppContext from '~/context';
import VehicleApi from '~/api/Collections/VehicleApi';
import { use } from 'i18next';
import { useGetVehicleById } from '~/hook/hookVehicle';

const { Title } = Typography;

function History({}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const pageIndex = Number(searchParams.get('pageIndex')) || 1;
  const pageSize = Number(searchParams.get('pageSize')) || 10;
  const params = { pageSize, pageIndex };
  const { state, actions } = useContext(AppContext);
  const { auth } = state;
  const [vehicles, setVehicles] = useState([]);
  const [selectedLicensePlate, setSelectedLicensePlate] = useState('');

  for (let [key, value] of searchParams.entries()) {
    params[key] = value;
  }

  useEffect(() => {
    const fetchVehicles = async () => {
      const vehicleIds = auth.info?.driver?.vehicleIds;
      console.log('vehicleIds', vehicleIds);
      if (vehicleIds) {
        const vehiclePromises = vehicleIds.map(vehicleId => VehicleApi.getById(vehicleId));
        const vehicleResults = await Promise.all(vehiclePromises);
        setVehicles(vehicleResults);
        if (vehicleResults.length > 0) {
          setSelectedLicensePlate(vehicleResults[0]?.licensePlate);
        }
      }
    };

    fetchVehicles();
  }, [auth]);

  const licensePlates = vehicles.map(vehicle => vehicle?.licensePlate);
  console.log('license', licensePlates);

  const { data: eventsData, refetch, isLoading: loading } = useEvents(auth.role === 'Admin' ? params : { ...params, licensePlate: selectedLicensePlate });

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
  }, [JSON.stringify(params), selectedLicensePlate]);

  const onChangeFilter = (values) => {
    setSearchParams(values);
    if (values.licensePlate) {
      setSelectedLicensePlate(values.licensePlate);
    }
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

  const baseFilters = [
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
      label: 'Biển số xe',
      name: 'licensePlate',
      type: 'select',
      inputProps: {
        options: licensePlates.map((licensePlate) => ({
          label: licensePlate,
          value: licensePlate
        })),
        allowClear: true,
        placeholder: 'Chọn'
      }
    }
  ];
  
  const adminFilters = [
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
      label: 'Biển số xe',
      name: 'licensePlate',
      type: 'input',
      inputProps: {
        placeholder: 'Nhập'
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
  ];

  const filterList = auth.role === 'Admin' ? adminFilters : baseFilters;

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
            filterList={filterList}
            events={events}
          />
        </Card>
        <Card className="shadow-md">
          <CustomedTable
            dataSource={data}
            filter={params}
            columns={getColumns({ pageSize, pageIndex })}
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