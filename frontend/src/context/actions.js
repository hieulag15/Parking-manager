import { AuthApi } from '../api';
import dayjs from 'dayjs';
import { ErrorService } from '~/services';

export const changeState = async (params = { type: null, payload }) => params;

export const onLogin = async (params) => {
  let isLogin = false;
  let type = 'error';
  let content = '';
  let info = {};
  const { username, password, onComplete } = params;
  let role = null;
  try {
    const rs = await AuthApi.authentication({ username, password, onNoti });
    role = rs.person.account.role;
    if (rs) {
      isLogin = true;
      info = rs?.person || {};
      type = 'success';
      content = 'Đăng nhập thành công';
      localStorage.setItem('access_token', rs.accessToken);

      const expirationTime = dayjs().unix() + 5;
      localStorage.setItem(
        'auth',
        JSON.stringify({
          isLogin,
          info,
          role,
          expDate: expirationTime
        })
      );
    } else {
      content = 'Tên đăng nhập hoặc mật khẩu không đúng';
    }
  } catch (error) {
    type = 'error';
    content = 'Login Error';
    ErrorService.hanldeError(error, onNoti)
  } finally {
    onComplete(type, content);
  }

  return {
    type: 'auth',
    payload: {
      isLogin,
      info,
      role
    }
  };
};

export const editProfile = async (state, payload) => {
  const newValues = {
    ...state.auth,
    info: payload
  };

  localStorage.setItem(
    'auth',
    JSON.stringify({
      ...newValues
    })
  );
  return {
    type: 'auth',
    payload: newValues
  };
};

export const checkAuthenSevice = async ({ onError = null, onFinish = null }) => {
  let result = await AuthApi.reAuthentication();
  if (result) {
    let account_data = {
      homepage: '/',
      profile: {}
    };
    let data = { ...account_data, isLogin: true };
    onFinish && onFinish();
    return {
      type: 'auth',
      payload: data
    };
  } else {
    // onError && onError({ error: error.data || error });
    onFinish && onFinish();
    return {
      type: 'auth',
      payload: { isLogin: false }
    };
  }
};

export const onAuthorize = async ({ onError }) => {
  let payload = null;
  try {
    const api = await AuthApi.reAuthentication();
    payload = api;
  } catch {
    onError();
  } finally {
  }

  return {
    type: 'authorize',
    payload
  };
};

export const logout = async () => {
  localStorage.removeItem('auth');
  localStorage.removeItem('access_token');

  return {
    type: 'auth',
    payload: { isLogin: false }
  };
};

export const onMess = async (payload) => {
  return {
    type: 'mess',
    payload
  };
};

export const onNoti = async (payload) => {
  return {
    type: 'noti',
    payload
  };
};

export const onSetChangePassword = async (payload) => {
  return {
    type: 'onChangePassword',
    payload: !payload
  };
};

export const onEventParking = async (payload) => {
  console.log(onEventParking, payload);
  return {
    type: 'parkingEvent',
    payload: payload
  };
};
