import { useContext, useEffect, useState } from 'react';
import Authen from './views/pages/Authen';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import Main from './views/pages/Main';
import AppContext from './context';
import { ConfigProvider, message, notification, theme } from 'antd';
import customAntdTheme from './shared/CustomAntdTheme';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@progress/kendo-theme-default/dist/all.css';
import { dayjsSetup } from './config';
import dayjs from 'dayjs';
import PageError from './views/pages/PageError';
import { ThemeProvider } from 'styled-components';
// import socket from './socket';

function Authencation({ children }) {
  const { state } = useContext(AppContext);
  const { auth, authorize } = state;

  if (auth.isLogin) {
    return children;
  }

  return <Navigate to={'/auth/login'} />;
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

function App() {
  //Message Function
  const { state } = useContext(AppContext);
  const { mess, noti } = state;
  const [messageApi, contextHolder] = message.useMessage();
  const [notiApi, notiContextHolder] = notification.useNotification();
  const navigate = useNavigate();
  const { token } = theme.useToken();

  dayjsSetup();

  useEffect(() => {
    if (mess) {
      const { type, content, duration = 3 } = mess;
      messageApi.open({
        type,
        content,
        duration
      });
    }
  }, [mess]);

  useEffect(() => {
    if (noti) {
      const { message, description, type = 'info', placement = 'bottomRight' } = noti;
      notiApi[type]({
        message,
        description,
        placement
      });
    }
  }, [noti]);

  return (
    <div className="app">
      {contextHolder}
      {notiContextHolder}
      <ThemeProvider theme={{ ...token }}>
        <Routes>
          <Route path="/auth/login" element={<Authen />} />
          <Route
            path="/*"
            element={
              <Authencation>
                <Authorize>
                  <Main />
                </Authorize>
              </Authencation>
            }
            errorElement={
              <PageError
                status="500"
                title={false}
                subTitle="Không tìm thấy trang"
                btn={{ text: 'Về trang chủ', onClick: () => <Navigate to={'/dashboard'} /> }}
              />
            }
          />
        </Routes>
      </ThemeProvider>
    </div>
  );
}

export default App;
