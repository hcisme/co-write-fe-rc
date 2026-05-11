import { request } from '@/utils';

export const getDocs = () => request('/api/doc/list');

export const createDoc = ({ title }) =>
  request('/api/doc/create', { method: 'POST', data: { title } });

export const addCollaborator = ({ docId, userId, role }) =>
  request('/api/doc/share', { method: 'POST', data: { docId, userId, role } });

export const checkPermission = ({ docId }) =>
  request('/api/doc/check-permission', { method: 'POST', data: { docId } });
