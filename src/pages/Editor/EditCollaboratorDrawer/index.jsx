import { useEffect, useMemo } from 'react';
import { useParams } from 'react-router';
import { App, Form, Input, Radio } from 'antd';
import { DrawerForm } from '@/components';
import { addCollaborator, updateCollaborator } from '@/service/docService';
import { getLocalStorage, roleMap } from '@/utils';

const Index = (props) => {
  const { children, initialValues = { role: 2 }, edit, onSuccess } = props;
  const { docId } = useParams();
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const user = useMemo(() => getLocalStorage('user') || {}, []);

  const onFinish = async (values, onClosed) => {
    if (!docId) {
      message.error('文档ID不存在');
      return;
    }
    const data = { ...values, docId };
    const { code } = await (edit ? updateCollaborator(data) : addCollaborator(data));
    if (code === 200) {
      message.success(edit ? '更新成功' : '添加成功');
      onSuccess?.();
      onClosed();
    }
  };

  useEffect(() => {
    form.setFieldsValue(initialValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValues]);

  return (
    <DrawerForm
      drawerProps={{ title: edit ? '编辑协作者' : '添加协作者', forceRender: true }}
      formProps={{
        form,
        layout: 'vertical'
      }}
      triggerElement={children}
      onFinish={onFinish}
    >
      <Form.Item label="用户ID" name="userId" rules={[{ required: true, message: '请输入用户ID' }]}>
        <Input placeholder="请输入用户ID" disabled={edit} />
      </Form.Item>

      <Form.Item label="权限" name="role" rules={[{ required: true, message: '请选择权限' }]}>
        <Radio.Group
          disabled={edit && initialValues.userId === user.id && initialValues.role !== 0}
          options={Object.entries(roleMap)
            .map(([value, label]) => ({ value: Number(value), label }))
            .filter((item) => edit || Number(item.value) !== 0)}
        />
      </Form.Item>
    </DrawerForm>
  );
};

export default Index;
