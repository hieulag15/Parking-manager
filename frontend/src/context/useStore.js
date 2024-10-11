import create from 'zustand';
import Cookies from 'js-cookie';
import { AccountApi } from '../api';
import dayjs from 'dayjs';
import { ErrorService } from '~/services';

const getIsLogin = () => {
  let auth = localStorage.getItem("auth");
  if(auth) {
    auth = JSON.parse(auth);
  } else {
    auth = {
      isLogin: false,
    }
  }
  return auth;
};

const useStore = create((set, get) => ({
  auth: getIsLogin(),
  mess: null,
  noti: null,
  onChangePassword: false,
  parkingEvent: null,
  authorize: null,

  logout: async (params) => {
    localStorage.removeItem('isLogin');
    Cookies.remove('access_token');
    set({ auth: { isLogin: false } });
  },

  onLogin: async (params) => {
    let isLogin = false;
    let type = 'error';
    let content = '';
    let info = {};
    const { username, password, onComplete, role } = params;
    try {
      const rs = await AccountApi.login({ username, password, role, onNoti });
      if (rs) {
        isLogin = true;
        info = rs?.person || {};
        type = 'success';
        content = 'Đăng nhập thành công';
        Cookies.set('access_token', rs.accessToken, { expires: 7 });

        const expirationTime = dayjs().unix() + 5;
        localStorage.setItem(
          'auth',
          JSON.stringify({
            isLogin,
            info,
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

    set({ auth: { isLogin, info } });
  },

  checkAuthenSevice: async ({ onError = null, onFinish = null }) => {
    let result = await AccountApi.checkToken();
    if (result) {
      let account_data = {
        homepage: '/',
        profile: {}
      };
      let data = { ...account_data, isLogin: true };
      onFinish && onFinish();
      set({ auth: data });
    } else {
      onFinish && onFinish();
      set({ auth: { isLogin: false } });
    }
  },

  onAuthorize: async ({ onError }) => {
    let payload = null;
    try {
      const api = await AccountApi.checkToken();
      payload = api;
    } catch {
      onError();
    } finally {
      set({ authorize: payload });
    }
  },

  editProfile: async (params) => {
    const newValues = {
      ...get().auth,
      info: params
    };

    localStorage.setItem(
      'auth',
      JSON.stringify({
        ...newValues
      })
    );
    set({ auth: newValues });
  },

  onMess: async (payload) => {
    set({ mess: payload });
  },

  onNoti: async (payload) => {
    set({ noti: payload });
  },

  onSetChangePassword: async () => {
    set({ onChangePassword: !get().onChangePassword });
  },

  onEventParking: async (payload) => {
    console.log(onEventParking, payload);
    set({ parkingEvent: payload });
  }
}));

export default useStore;