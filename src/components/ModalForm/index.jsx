import { useState, cloneElement, isValidElement } from 'react';
import { Modal, Form } from 'antd';

const Index = (props) => {
  const { children, triggerElement, modalProps, formProps, onBeforeOpen, onBeforeClose, onFinish } =
    props;

  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  const onOpen = () => {
    onBeforeOpen?.(setOpen);
    setOpen(true);
  };

  const onClosed = () => {
    setOpen(false);
    onBeforeClose?.(setOpen, form);
    form.resetFields();
  };

  const onOk = async () => {
    if (!onFinish) {
      setOpen(false);
      return;
    }
    try {
      const values = await form.validateFields();

      const result = onFinish(values, onClosed, setOpen, form);

      if (result instanceof Promise) {
        setSubmitLoading(true);
        result.finally(() => {
          setSubmitLoading(false);
        });
      }
    } catch (error) {
      console.log('Validate Failed:', error);
    }
  };

  const trigger = typeof triggerElement === 'function' ? triggerElement() : triggerElement;

  return (
    <>
      {isValidElement(trigger) &&
        cloneElement(trigger, {
          onClick: () => onOpen()
        })}

      <Modal
        open={open}
        onCancel={onClosed}
        onOk={onOk}
        destroyOnHidden
        mask={{ closable: false }}
        confirmLoading={submitLoading}
        {...modalProps}
      >
        <Form form={form} layout="horizontal" {...formProps}>
          {typeof children === 'function' ? children(form) : children}
        </Form>
      </Modal>
    </>
  );
};

export default Index;
