import { App, Form, Input } from 'antd';
import { ModalForm } from '@/components';
import { createDoc } from '@/service/docService';

const Index = (props) => {
  const { children, onSuccess } = props;
  const { message } = App.useApp();

  const onFinish = async (values, onClosed) => {
    const { code } = await createDoc(values);
    if (code === 200) {
      message.success('创建文档成功');
      onSuccess?.();
      onClosed();
    }
  };

  return (
    <ModalForm formProps={{ layout: 'vertical' }} triggerElement={children} onFinish={onFinish}>
      <>
        <Form.Item
          label="文档标题"
          name="title"
          rules={[
            { required: true, message: '请输入文档标题' },
            { max: 50, message: '标题长度不能超过50个字符' }
          ]}
        >
          <Input />
        </Form.Item>
      </>
    </ModalForm>
  );
};

export default Index;
