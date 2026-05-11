import { useParams } from 'react-router';
import { App, Form, Input, Radio } from 'antd';
import { DrawerForm } from '@/components';
import { addCollaborator } from '@/service/docService';

const Index = (props) => {
  const { children, onSuccess } = props;
  const { docId } = useParams();
  const { message } = App.useApp();

  const onFinish = async (values, onClosed) => {
    if (!docId) {
      message.error('文档ID不存在');
      return;
    }
    const { code } = await addCollaborator({ ...values, docId });
    if (code === 200) {
      message.success('添加成功');
      onSuccess?.();
      onClosed();
    }
  };

  return (
    <DrawerForm
      drawerProps={{ title: '添加协作者' }}
      formProps={{
        layout: 'vertical',
        initialValues: {
          role: 2
        }
      }}
      triggerElement={children}
      onFinish={onFinish}
    >
      <Form.Item label="用户ID" name="userId" rules={[{ required: true, message: '请输入用户ID' }]}>
        <Input placeholder="请输入用户ID" />
      </Form.Item>

      <Form.Item label="权限" name="role" rules={[{ required: true, message: '请选择权限' }]}>
        <Radio.Group>
          <Radio value={1}>编辑</Radio>
          <Radio value={2}>只读</Radio>
        </Radio.Group>
      </Form.Item>
    </DrawerForm>
  );
};

export default Index;
