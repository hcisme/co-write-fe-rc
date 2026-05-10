import { request } from '@/utils';

export const getDocs = () => request('/api/doc/list');

export const createDoc = ({ title }) =>
  request('/api/doc/create', { method: 'POST', data: { title } });
