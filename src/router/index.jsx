import { Result } from 'antd';
import { createBrowserRouter, RouterProvider } from 'react-router';
import { GlobalError, GlobalLoading } from '@/components';

const router = createBrowserRouter([
  {
    id: 'root',
    HydrateFallback: GlobalLoading,
    ErrorBoundary: GlobalError,
    children: [
      {
        path: '/login',
        lazy: () => import('@/pages/Login')
      },
      {
        path: '/',
        lazy: () => import('@/layout'),
        children: [
          {
            ErrorBoundary: GlobalError,
            children: [
              {
                index: true,
                lazy: () => import('@/pages/Home')
              },
              {
                path: 'edit/:docId',
                lazy: () => import('@/pages/Editor')
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '*',
    element: <Result status="404" title="404 找不到页面" />
  }
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
