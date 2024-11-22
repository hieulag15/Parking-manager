import React, { useContext, useEffect, useRef, useState } from 'react';
import { Badge, Card, Layout, Row, Typography, Space, Button, Modal, Pagination } from 'antd';
import { Content, Footer, Header } from '~/views/layouts';
import { PlusOutlined, EditOutlined, DeleteOutlined, DeleteFilled, FilterOutlined } from '@ant-design/icons';
import { UserApi } from '~/api';
import dayjs from 'dayjs';
import DriverForm from './DriverForm';
import { useSearchParams } from 'react-router-dom';
import AppContext from '~/context';
import { ErrorService } from '~/services';
import CustomedTable from '~/views/components/Table';
import Filter from '~/views/components/Filter';

const { Title } = Typography;

function Driver() {
  const [data, setData] = useState({
    data: [],
    totalCount: 0,
    totalPage: 0
  });
  const { totalCount, totalPage } = data;
  const [formAction, setFormAction] = useState({});
  const [openForm, setOpenForm] = useState(false);
  const { actions } = useContext(AppContext);
  const [searchParams, setSearchParams] = useSearchParams({
    pageSize: '10',
    pageIndex: '1'
  });
  const pageIndex = Number(searchParams.get('pageIndex'));
  const pageSize = Number(searchParams.get('pageSize'));
  const params = { pageSize, pageIndex };
  for (let [key, value] of searchParams.entries()) {
    params[key] = value;
  }
  const [loading, setLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const isMounted = useRef(false);

  const callApi = async () => {
    try {
      setLoading(true);
      const api = await UserApi.getDrivers({ ...params, pageSize, pageIndex });
      setData(api);
      isMounted.current = true;
    } catch (error) {
      ErrorService.handleError(error, actions.onNoti);
      setData({ data: [], pageSize: 0, pageIndex: 0 });
    } finally {
      setLoading(false);
      setSelectedRows([]);
    }
  };

  useEffect(() => {
    callApi();
  }, [searchParams.toString()]);

  useEffect(() => {
    if (isMounted.current) {
      if (pageIndex > totalPage && pageIndex > 1) {
        setSearchParams({ ...params, pageIndex: totalPage });
      }
    }
  }, [data]);

  const expandedRowRender = (subData) => {
    const columns = [
      { title: 'Biển số xe', dataIndex: 'licensePlate', key: 'licensePlate' },
      { title: 'Loại xe', dataIndex: 'type', key: 'type' },
      {
        title: 'Trạng thái',
        key: 'status',
        render: (_, record) => {
          let config = {
            status: 'success',
            text: 'Còn hoạt động'
          };
          if (record._destroy) {
            config = {
              status: 'error',
              text: 'Dừng hoạt động'
            };
          }
          return <Badge {...config} />;
        }
      },
      {
        title: 'Ngày đăng ký',
        dataIndex: 'createdAt',
        key: 'createdAt',
        render: (_, record) => dayjs(record.createdAt).format('L')
      }
    ];
    const newData = subData?.driver?.vehicleIds || [];

    return (
      <div className="container-fluid">
        <Typography.Title type="primary" level={5}>
          Danh sách xe:
        </Typography.Title>
        <CustomedTable
          columns={columns}
          dataSource={newData}
          pagination={false}
          rowKey={(record) => record._id}
        />
      </div>
    );
  };

  const onAdd = () => {
    setFormAction({ action: 'add', actionText: 'Thêm', title: 'Thêm chủ xe mới' });
    setOpenForm(true);
  };

  const onEdit = (values) => {
    values.licensePlate = values.driver?.vehicleIds[0]?.licensePlate || null;
    values = {
      ...values,
      ...values?.driver
    };
    setFormAction({
      action: 'edit',
      actionText: 'Chỉnh sửa',
      title: 'Chỉnh sửa thông tin chủ xe',
      payload: { ...values }
    });
    setOpenForm(true);
  };

  const onDelete = async (values) => {
    try {
      actions.onMess({
        content: 'Đang xóa',
        type: 'loading',
        duration: 1
      });
      console.log("id: " + values._id);
      const api = await UserApi.deleteDriver(values._id);
      setData(api);
      actions.onMess({
        content: 'Xóa thành công',
        type: 'success'
      });
      callApi();
    } catch (error) {
      ErrorService.handleError(error, actions.onNoti);
    }
  };

  const onDeleteMany = async () => {
    try {
      actions.onMess({
        content: 'Đang xóa',
        type: 'loading',
        duration: 1
      });
      const ids = selectedRows.map((e) => e._id);
      const api = await UserApi.deleteManyDriver(ids);
      setData(api);
      actions.onMess({
        content: 'Xóa tất cả thành công',
        type: 'success'
      });
      callApi();
    } catch (error) {
      ErrorService.handleError(error, actions.onNoti);
    }
  };

  const handleCloseForm = ({ reload }) => {
    setOpenForm(false);
    if (reload) callApi();
  };

  const columns = [
    {
      title: '#',
      dataIndex: 'key',
      width: 60,
      render: (_, prop, index) => (pageIndex - 1) * pageSize + index + 1
    },
    { title: 'Tên', dataIndex: 'name', key: 'name', sorter: (a, b) => a.name - b.name },
    { title: 'Số điện thoại', dataIndex: 'phone', key: 'phone' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Địa chỉ', dataIndex: 'address', key: 'address' },
    { 
      title: 'Nghề nghiệp', 
      dataIndex: ['driver', 'job'], 
      key: 'job',
      render: (text) => text
    },
    { 
      title: 'Đơn vị (Khoa)', 
      dataIndex: ['driver', 'department'], 
      key: 'department',
      render: (text) => text
    },
    {
      title: 'Ngày tham gia',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180,
      render: (_, record) => dayjs(record.createdAt).format('L')
    },
    {
      title: '',
      dataIndex: 'actions',
      width: 120,
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            type="text"
            onClick={() => onEdit(record)}
          />
          <Button
            icon={<DeleteOutlined />}
            type="text"
            onClick={() => onDelete(record)}
          />
        </Space>
      )
    }
  ];

  const onChangeFilter = (values) => {
    setSearchParams(values);
  };

  const rowSelection = {
    onChange: (_, selectedRows) => {
      setSelectedRows(selectedRows);
    },
    getCheckboxProps: (record) => ({
      disabled: record.name === 'Disabled User',
      name: record.name
    })
  };

  return (
    <Layout className="px-4">
      <Header className="border-1" title={'Quản lý chủ xe'} />
      <Content className="w-100 py-3">
        <Modal
          title={formAction.title}
          open={openForm}
          onCancel={() => setOpenForm(false)}
          destroyOnClose={true}
          footer={null}>
          <DriverForm
            formAction={formAction}
            isOpen={openForm}
            onClose={handleCloseForm}
            onNoti={actions.onNoti}
            onMess={actions.onMess}
          />
        </Modal>
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
                label: 'Tên',
                name: 'name',
                type: 'input',
                inputProps: {
                  placeholder: 'Nhập'
                }
              },
              {
                label: 'Số điện thoại',
                name: 'phone',
                type: 'input',
                inputProps: {
                  placeholder: 'Nhập'
                }
              },
              {
                label: 'Email',
                name: 'email',
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
              }
            ]}
          />
        </Card>
        <Card className="shadow-md">
          <Space className="mb-4">
            {selectedRows.length > 0 && (
              <Button type="primary" icon={<DeleteFilled />} onClick={onDeleteMany} danger>
                Xóa
              </Button>
            )}
            <Button type="primary" icon={<PlusOutlined />} onClick={onAdd}>
              Thêm chủ xe
            </Button>
          </Space>
          <CustomedTable
            columns={columns}
            expandable={{
              expandedRowRender,
              defaultExpandedRowKeys: ['0']
            }}
            rowSelection={{
              type: 'checkbox',
              ...rowSelection
            }}
            loading={loading}
            dataSource={data.data || []}
            filter={params}
            totalCount={totalCount}
            totalPage={totalPage}
            pageSize={pageSize}
            pageIndex={pageIndex}
            onChange={onChangeFilter}
            rowKey={(record) => record._id}
            scroll={{ y: 'calc(100vh - 450px)', scrollToFirstRowOnChange: true }}
          />
        </Card>
      </Content>
    </Layout>
  );
}

export default Driver;

