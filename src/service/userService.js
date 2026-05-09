import { request } from '@/utils';

export const getCaptchaRequest = () => request('/api/user/captcha');

export const loginRequest = (loginData) =>
  request('/api/user/login', { method: 'POST', data: loginData });
