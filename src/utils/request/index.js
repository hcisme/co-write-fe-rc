import { message } from 'antd';
import axios from 'axios';
import { getLocalStorage, removeLocalStorage } from '@/utils';

axios.interceptors.request.use(
  (config) => {
    const token = getLocalStorage('token');
    return {
      ...config,
      headers: {
        ...config.headers,
        token: token || undefined
      }
    };
  },
  (error) => Promise.reject(error)
);

axios.interceptors.response.use(
  (response) => {
    if (response?.data?.code !== 200) {
      message.warning(response?.data?.info || '服务器错误请联系管理员');
    }
    if (response?.data?.code === 401) {
      removeLocalStorage('token');
      removeLocalStorage('user');
      window.location.replace('/login');
      message.warning(response?.data?.info || '服务器错误请联系管理员');
    }
    return response;
  },
  (error) => error
);

async function request(url, { method = 'GET', ...rest } = {}) {
  const { data } = await axios({
    url,
    method,
    ...rest
  });
  return data;
}

export default request;
