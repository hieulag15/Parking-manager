import React, { useContext } from 'react';
import { Layout, Modal, theme } from 'antd';
import { Content, Footer, Header, Sider } from '~/views/layouts';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import Home from './Home';
import Map from './Map';
import Driver from './Driver';
import { publicRoutes } from '~/routes';
import AppContext from '~/context';
import { PasswordForm } from '~/views/components/Form';
import socket from '~/socket';
import { useEffect } from 'react';
import Cookies from 'js-cookie';
import { addManyDriver } from './data';
import { AccountApi } from '~/api';

function Main({}) {
  const { token } = theme.useToken();
  const { state, actions } = useContext(AppContext);
  const { auth } = state;
  const navigate = useNavigate();

  useEffect(() => {
    const hanldeNotiParking = (event) => {
      actions.onEventParking(event);
    };
    //config websocket
    socket.on('connect', () => {
      console.log('socket successful');
    });

    socket.on('notification-parking', hanldeNotiParking);

    return () => {
      socket.off('connect', () => {
        console.log('socket close');
      });
      socket.off('notification-parking', hanldeNotiParking);
    };
  }, []);
  // addManyDriver();
  return (
    <Layout className="vh-100">
      <Modal
        title={'Thay đổi mật khẩu'}
        open={state.onChangePassword}
        onCancel={() => {
          actions.onSetChangePassword();
        }}
        destroyOnClose={true}
        classNames={{ footer: 'd-none' }}>
        <PasswordForm
          account={state.auth?.info?.account}
          isOpen={state.onChangePassword}
          onClose={({ afterAction }) => {
            actions.onSetChangePassword();
            afterAction();
          }}
          noChangeAccount
        />
      </Modal>
      <Sider style={{ background: token.colorBgContainer }} />
      <Routes>
        {publicRoutes.map((route, ix) => (
          <Route {...route} key={'route' + ix} />
        ))}
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Layout>
  );
}

export default Main;
