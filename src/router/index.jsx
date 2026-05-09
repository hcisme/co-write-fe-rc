import { getLocalStorage } from '@/utils';
import { Result } from 'antd';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to={getLocalStorage('token') ? '/home' : '/login'} replace />
  },
  {
    path: '/login',
    lazy: () =>
      import('@/pages/Login').then((module) => ({
        Component: module.default
      }))
  },
  {
    path: '/home',
    lazy: () =>
      import('@/pages/Home').then((module) => ({
        Component: module.default
      }))
  },
  {
    path: '*',
    element: <Result status="404" title="404 找不到页面" />
  }
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
