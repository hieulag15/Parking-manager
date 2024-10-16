import { CarOutlined, LineChartOutlined } from '@ant-design/icons';
import { Flex, Image, Layout, Menu, Typography, theme } from 'antd';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import LOGO from '~/assets/logo/main.svg';
import { publicRoutes } from '~/routes';

function Sider({ ...props }) {
  const { token } = theme.useToken();
  const location = useLocation();
  const navigate = useNavigate();
  const [current, setCurrent] = useState();

  const handleChangePage = ({ item }) => {
    navigate(item.props.path);
    setCurrent({
      ...current,
      selectedKeys: item.props.path.split('/').filter(Boolean),
      path: item.props.path
    });
  };

  useEffect(() => {
    if (location) {
      if (location.pathname != current?.path) {
        setCurrent({
          selectedKeys: location.pathname.split('/').filter(Boolean),
          openKeys: location.pathname.split('/').filter(Boolean),
          path: location.pathname
        });
      }
    }
  }, [location]);

  return (
    <Layout.Sider {...props} width={200} className="py-4">
      <Flex justify="space-between"  vertical className="h-100">
        <Flex vertical className="px-2 mt-1" justify="space-between" align="center">
          <Image src={LOGO} width={40} />
          <Typography.Title level={4} className="text-center" style={{ color: token.colorPrimary }}>
            Parking Management
          </Typography.Title>
        </Flex>
        <Menu
          id="menuSider"
          className="mt-5"
          items={publicRoutes}
          selectedKeys={current?.selectedKeys}
          openKeys={current?.openKeys}
          onSelect={handleChangePage}
        />
        <div className="container text-center d-flex flex-column justify-content-end" style={{minHeight: 200}}>
          <Typography.Text strong>{`Phiên bản ${import.meta.env.VITE_VERSION}`}</Typography.Text>
        </div>
      </Flex>
    </Layout.Sider>
  );
}

export default Sider;
