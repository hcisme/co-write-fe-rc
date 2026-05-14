import { Navigate, Outlet, useNavigation } from 'react-router';
import { Layout } from 'antd';
import Sider from './Sider';
import { GlobalLoading } from '@/components';
import { getLocalStorage } from '@/utils';

const { Content } = Layout;

export const Component = () => {
  const navigation = useNavigation();
  const isNavigating = navigation.state === 'loading';
  const userToken = getLocalStorage('token');

  if (!userToken) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Layout style={{ height: '100%' }}>
      <Sider />

      <Content>
        {isNavigating && <GlobalLoading />}
        <Outlet />
      </Content>
    </Layout>
  );
};
