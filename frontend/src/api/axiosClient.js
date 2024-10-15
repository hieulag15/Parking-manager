import axios from 'axios';
import Cookies from 'js-cookie';

const axiosClient = axios.create({
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 55000
});

axiosClient.interceptors.request.use((config) => {
  config.headers['Authorization'] = `bearer ${Cookies.get('access_token')}`;
  return config;
});

axiosClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async (error) => {
    let status = null,
      statusText = 'Lỗi không xác định',
      data = [];
    let {
      response = {
        status: false,
        statusText: 'Kết nối chậm, vui lòng thử lại sau!'
      }
    } = error;
    if (response.status) {
      status = response.status;
      statusText = response.statusText;

      switch (status) {
        case 404:
          statusText = 'Không tìm thấy dữ liệu';
          break;
        case 500:
          statusText = 'Server xảy ra lỗi';
          break;
      }
    }
    if (response.data && response.data.statusCode) {
      const { statusCode, message } = response.data;
      status = statusCode;
      statusText = message;
    }

    return Promise.reject({
      status,
      statusText,
      data
    });
  }
);

export default axiosClient;
