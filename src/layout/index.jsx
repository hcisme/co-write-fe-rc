import { Navigate, Outlet } from 'react-router';
import { Layout } from 'antd';
import Sider from './Sider';
import { getLocalStorage } from '@/utils';

const { Content } = Layout;

export const Component = () => {
  const userToken = getLocalStorage('token');

  if (!userToken) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Layout style={{ height: '100%' }}>
      <Sider />

      <Content>
        <Outlet />
      </Content>
    </Layout>
  );
};
