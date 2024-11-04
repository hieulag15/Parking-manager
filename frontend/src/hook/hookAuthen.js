import { useMutation, useQueryClient } from 'react-query';
import { AuthApi } from '~/api';
import Cookies from 'js-cookie';
import dayjs from 'dayjs';
import ErrorService from '~/services/ErrorService';
import { useNavigate } from 'react-router-dom';
import { on } from 'events';

export const useLogin = ({ onNoti, onComplete }) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation(
    async ({ username, password, role }) => {
      const rs = await AuthApi.authentication({ username, password, role, onNoti });
      return rs;
    },
    {
      onSuccess: (rs) => {
        let isLogin = false;
        let type = 'error';
        let content = '';
        let info = {};

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

          onComplete(type, content);
          // Navigate to the dashboard after successful login
          navigate('/');
        } else {
          content = 'Tên đăng nhập hoặc mật khẩu không đúng';
        }

        
      },
      onError: (error) => {
        const type = 'error';
        const content = 'Login Error';
        ErrorService.hanldeError(error, onNoti);
        onComplete(type, content);
      }
    }
  );
};

export const useCheckAuthen = (onError, onFinish) => {
    return useQuery(
      'auth',
      async () => {
        const result = await AuthApi.reAuthentication();
        return result;
      },
      {
        onSuccess: (result) => {
          if (result) {
            let account_data = {
              homepage: '/',
              profile: {}
            };
            let data = { ...account_data, isLogin: true };
            onFinish && onFinish();
            return data;
          } else {
            onFinish && onFinish();
            return { isLogin: false };
          }
        },
        onError: (error) => {
          onError && onError(error);
        }
      }
    );
  };