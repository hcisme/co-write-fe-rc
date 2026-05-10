import { App as AntdApp, ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import AppRouter from '@/router';

const Index = () => {
  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        token: {
          borderRadius: 2
        }
      }}
    >
      <AntdApp style={{ height: '100%' }}>
        <AppRouter />
      </AntdApp>
    </ConfigProvider>
  );
};

export default Index;
