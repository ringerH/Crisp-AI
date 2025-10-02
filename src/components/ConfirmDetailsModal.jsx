// In /src/components/ConfirmDetailsModal.jsx
import { Modal, Form, Input, Button } from 'antd';
import { useEffect } from 'react';

export default function ConfirmDetailsModal({ isOpen, initialData, onConfirm}) {
  const [form] = Form.useForm();

  
  useEffect(() => {
    if (initialData) {
      form.setFieldsValue(initialData);
    }
  }, [initialData, form]);

  return (
    <Modal
      title="Please Confirm Your Details"
      open={isOpen}
      closable={false}
      footer={null} 
    >
      <p>We've extracted the following details. Please correct them if needed.</p>
      <Form
        form={form}
        layout="vertical"
        onFinish={onConfirm}
        initialValues={initialData}
      >
        <Form.Item label="Full Name" name="name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email' }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Phone" name="phone">
          <Input />
        </Form.Item>
        <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
          <Button type="primary" htmlType="submit">
            Confirm & Start Interview
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}