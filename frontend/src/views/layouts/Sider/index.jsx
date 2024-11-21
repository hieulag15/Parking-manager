import { CarOutlined, LineChartOutlined } from '@ant-design/icons';
import { Flex, Image, Layout, Menu, Typography, theme } from 'antd';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import LOGO from '~/assets/logo/main.svg';

function Sider({ ...props }) {
  const { token } = theme.useToken();
  const location = useLocation();
  const navigate = useNavigate();
  const [current, setCurrent] = useState();
  const [currentTime, setCurrentTime] = useState(new Date()); // State để lưu ngày giờ hiện tại

  const handleChangePage = ({ item }) => {
    navigate(item.props.path);
    setCurrent({
      ...current,
      selectedKeys: item.props.path.split('/').filter(Boolean),
      path: item.props.path,
    });
  };

  useEffect(() => {
    if (location) {
      if (location.pathname !== current?.path) {
        setCurrent({
          selectedKeys: location.pathname.split('/').filter(Boolean),
          openKeys: location.pathname.split('/').filter(Boolean),
          path: location.pathname,
        });
      }
    }
  }, [location]);

  useEffect(() => {
    // Cập nhật thời gian mỗi giây
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Dọn dẹp interval khi component unmount
    return () => clearInterval(interval);
  }, []);

  // Hàm định dạng ngày giờ theo kiểu dd/MM/yyyy hh:mm:ss
  const formatDateTime = (date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  };

  return (
    <Layout.Sider {...props} width={200} className="pt-4 pb-2">
      <Flex justify="space-between" vertical className="h-100">
        <Flex vertical className="px-2 mt-1" justify="space-between" align="center">
          <Image src={LOGO} width={40} />
          <Typography.Title level={4} className="text-center" style={{ color: token.colorPrimary }}>
            Parking Management
          </Typography.Title>
        </Flex>
        <Menu
          className="flex-1 overflow-y-auto border-r-0"
          items={props.items}
          selectedKeys={current?.selectedKeys}
          openKeys={current?.openKeys}
          onSelect={handleChangePage}
        />
        <div className="p-4 border-t border-gray-200">
          <Flex align="center" justify="center" className="text-sm text-gray-500">
            <Typography.Text>{formatDateTime(currentTime)}</Typography.Text>
          </Flex>
        </div>
      </Flex>
    </Layout.Sider>
  );
}

export default Sider;
