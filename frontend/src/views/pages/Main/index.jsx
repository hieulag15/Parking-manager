import React, { useContext, useMemo } from 'react';
import { Layout, Modal, theme } from 'antd';
import { Content, Footer, Header, Sider } from '~/views/layouts';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import Home from './Home';
import Map from './Map';
import Driver from './Driver';
import { driverRoutes, publicRoutes } from '~/routes';
import AppContext from '~/context';
import { PasswordForm } from '~/views/components/Form';
import socket from '~/socket';
import { useEffect } from 'react';
import RequireAuth from '~/routes/RequireAuth';

function Authencation({ children }) {
  const { state } = useContext(AppContext);
  const { auth, authorize } = state;

  if (auth.isLogin) {
    return children;
  }

  return <Navigate to={'/authentication'} />;
}

function Authorize({ children }) {
  const { state, actions } = useContext(AppContext);
  const { auth, authorize } = state;

  useEffect(() => {
    actions.onAuthorize({
      onError: () => {
        actions.logout();
      }
    });
  }, []);

  return children;
}

function Main({}) {
  const { token } = theme.useToken();
  const { state, actions } = useContext(AppContext);
  const { auth } = state;

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

  const currRoutes = useMemo(() => {
    let rs;
    console.log('role: ', auth.role);
    switch (auth.role) {
      case 'Admin':
        rs = [...publicRoutes];
        break;
      case 'driver':
        rs = [...driverRoutes];
        break;
    }
    return rs;
  }, [JSON.stringify(state.auth)]);

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
      <Sider style={{ background: token.colorBgContainer }} items={currRoutes} />
      <Routes>
            {currRoutes.map((route, ix) => {
              if (route.children) {
                return route.children.map((subRoute) => <Route {...subRoute} key={subRoute.key} />);
              }
              return <Route {...route} key={'route' + ix} />;
            })}
            <Route path="*" element={<Navigate to={currRoutes[0].path} />} />
          </Routes>
    </Layout>
  );
}

export default Main;
