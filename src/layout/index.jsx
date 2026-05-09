import { Navigate, Outlet } from 'react-router';
import { Layout } from 'antd';
import Header from './Header';
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
      <Header />

      <Layout>
        <Sider />

        <Content
          style={{
            backgroundColor: '#0958d9'
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};
