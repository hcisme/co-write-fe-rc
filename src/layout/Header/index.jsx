import { useNavigate } from 'react-router';
import { Avatar, Col, Dropdown, Flex, Layout, Row, theme, Typography } from 'antd';
import { getLocalStorage, removeLocalStorage } from '@/utils';

const { Header } = Layout;
const { Text } = Typography;

const Index = () => {
  const navigate = useNavigate();
  const { token } = theme.useToken();
  const user = getLocalStorage('user');
  const username = user?.username || '';

  const menuItems = [
    {
      key: 'logout',
      label: (
        <Text
          type="danger"
          onClick={() => {
            removeLocalStorage('user');
            removeLocalStorage('token');
            navigate('/login', { replace: true });
          }}
        >
          退出登录
        </Text>
      )
    }
  ];

  return (
    <Header style={{ height: 72, background: token.colorBgContainer }}>
      <Row style={{ height: '100%' }} align="middle">
        <Col flex={1}></Col>
        <Col>
          <Dropdown menu={{ items: menuItems }} arrow>
            <Flex vertical justify="center" align="center" style={{ height: '100%' }}>
              <Avatar style={{ backgroundColor: '#f56a00' }}>{username.charAt(0)}</Avatar>
              <Text>{username}</Text>
            </Flex>
          </Dropdown>
        </Col>
      </Row>
    </Header>
  );
};

export default Index;
