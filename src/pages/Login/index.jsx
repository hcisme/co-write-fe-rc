import { Form, Input, Button, Flex, Image, Typography, Spin } from 'antd';
import { MailOutlined, LockOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router';
import { useRequest } from 'ahooks';
import { getCaptchaRequest, loginRequest } from '@/service/userService';
import {
  getSessionStorage,
  removeSessionStorage,
  setSessionStorage,
  setLocalStorage
} from '@/utils';

const { Title } = Typography;

export const Component = () => {
  const navigate = useNavigate();

  const {
    data: { data = {} } = {},
    runAsync: refreshCaptchaAsync,
    loading: captchaReqLoading
  } = useRequest(getCaptchaRequest, {
    onSuccess: (result = {}) => {
      const captchaKey = result.data?.captchaKey;
      if (captchaKey) {
        setSessionStorage('captchaKey', captchaKey);
      }
    }
  });

  const { runAsync: loginAsync, loading: loginLoading } = useRequest(loginRequest, {
    onSuccess: (result = {}) => {
      const { code, data = {} } = result;
      if (code !== 200) {
        refreshCaptchaAsync();
        return;
      }
      if (data) {
        setLocalStorage('user', data);
        setLocalStorage('token', data.token);
        removeSessionStorage('captchaKey');
        navigate('/', { replace: true });
      }
    },
    onError: () => refreshCaptchaAsync,
    manual: true
  });

  const onFinish = (values) => {
    const captchaKey = getSessionStorage('captchaKey');
    loginAsync({ ...values, captchaKey });
  };

  return (
    <Flex justify="center" align="center" style={{ minHeight: '100vh' }}>
      <Flex
        vertical
        style={{
          width: 400,
          padding: 40,
          background: 'white',
          borderRadius: 8,
          boxShadow: '0 2px 12px rgba(0,0,0,0.1)'
        }}
      >
        <Title level={3} style={{ textAlign: 'center', marginBottom: 32 }}>
          多人协作文档登录
        </Title>

        <Form onFinish={onFinish} size="large">
          <Form.Item
            name="email"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '邮箱格式不正确' }
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="邮箱" />
          </Form.Item>

          <Form.Item name="password" rules={[{ required: true, message: '请输入密码' }]}>
            <Input.Password prefix={<LockOutlined />} placeholder="密码" />
          </Form.Item>

          <Form.Item name="captcha" rules={[{ required: true, message: '请输入验证码' }]}>
            <Flex gap={12}>
              <Input
                prefix={<SafetyCertificateOutlined />}
                placeholder="验证码"
                style={{ flex: 1 }}
              />
              <Spin spinning={captchaReqLoading}>
                <Image
                  src={data.captcha}
                  alt="验证码"
                  onClick={refreshCaptchaAsync}
                  preview={false}
                  height={40}
                  style={{ cursor: 'pointer', borderRadius: 4 }}
                />
              </Spin>
            </Flex>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loginLoading}>
              登录
            </Button>
          </Form.Item>
        </Form>
      </Flex>
    </Flex>
  );
};
