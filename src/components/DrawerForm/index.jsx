import { useState, cloneElement } from 'react';
import { Drawer, Button, Space, Form } from 'antd';

const Index = (props) => {
  const {
    children,
    triggerElement,
    readOnly,
    drawerProps,
    formProps,
    onBeforeOpen,
    onBeforeClose,
    onFinish
  } = props;
  const [innerForm] = Form.useForm();
  const form = formProps.form || innerForm;
  const [open, setOpen] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  const onOpen = () => {
    onBeforeOpen?.(setOpen);
    setOpen(true);
  };

  const onClosed = () => {
    setOpen(false);
    onBeforeClose?.(setOpen, form);
  };

  const onOk = async () => {
    if (!onFinish) {
      setOpen(false);
      return;
    }
    try {
      const values = await form.validateFields();
      
      setSubmitLoading(true);
      onFinish(values, onClosed, setOpen, form).finally(() => {
        setSubmitLoading(false);
      });
    } catch (error) {
      console.log('Validate Failed:', error);
    }
  };

  return (
    <>
      {cloneElement(typeof triggerElement === 'function' ? triggerElement() : triggerElement, {
        onClick: () => {
          onOpen();
        }
      })}

      <Drawer
        open={open}
        onClose={onClosed}
        destroyOnHidden
        mask={{ closable: false }}
        footer={
          readOnly || (
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button
                onClick={() => {
                  onClosed();
                }}
              >
                取消
              </Button>
              <Button type="primary" loading={submitLoading} onClick={onOk}>
                确定
              </Button>
            </Space>
          )
        }
        {...drawerProps}
      >
        <Form form={form} layout="horizontal" scrollToFirstError {...formProps}>
          {typeof children === 'function' ? children(form) : children}
        </Form>
      </Drawer>
    </>
  );
};

export default Index;
