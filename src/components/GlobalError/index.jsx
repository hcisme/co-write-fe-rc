import { isRouteErrorResponse, useNavigate, useRouteError } from 'react-router';
import { Button, Flex, Result, Typography } from 'antd';

const { Text } = Typography;

const Index = () => {
  const navigate = useNavigate();
  const error = useRouteError();
  let title = '抱歉，程序出错了';
  let subTitle = '未知错误';

  if (isRouteErrorResponse(error)) {
    subTitle = `${error.status} ${error.statusText}`;
  } else if (error instanceof Error) {
    subTitle = error.message;
  }

  return (
    <Flex justify="center" align="center" style={{ minHeight: '100vh' }}>
      <Result
        status="error"
        title={title}
        subTitle={<Text type="secondary">{subTitle}</Text>}
        extra={
          <Button type="primary" onClick={() => navigate('/')}>
            返回首页
          </Button>
        }
      />
    </Flex>
  );
};

export default Index;
