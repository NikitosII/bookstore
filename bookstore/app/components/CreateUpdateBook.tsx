import { Input, Modal, Form, DatePicker } from "antd";
import { BookRequest } from "../services/books";
import { useEffect, useState } from "react";
import dayjs from 'dayjs';

export enum Mode {
  Create,
  Edit,
}

interface Props {
  mode: Mode;
  values: Book;
  isModalOpen: boolean;
  handleCancel: () => void;
  handleCreate: (request: BookRequest) => void;
  handleUpdate: (id: string, request: BookRequest) => void;
}

export const CreateUpdateBook = ({
  mode,
  values,
  isModalOpen,
  handleCancel,
  handleCreate,
  handleUpdate,
}: Props) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isModalOpen) {
      form.setFieldsValue({
        ...values,
        datetime: values.datetime ? dayjs(values.datetime) : null,
      });
    }
  }, [values, form, isModalOpen]);

  const handleOk = async () => {
    try {
      setLoading(true);
      const formValues = await form.validateFields();
      const bookRequest = {
        ...formValues,
        datetime: formValues.datetime ? formValues.datetime.format('YYYY-MM-DD') : '',
      };
      
      if (mode === Mode.Create) {
        await handleCreate(bookRequest);
      } else {
        await handleUpdate(values.id, bookRequest);
      }
      
      form.resetFields();
    } catch (error) {
      console.error('Validation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelInternal = () => {
    form.resetFields();
    handleCancel();
  };

  return (
    <Modal
      title={mode === Mode.Create ? "Add book" : "Edit book"}
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancelInternal}
      confirmLoading={loading}
      forceRender={true}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="title"
          label="Title"
          rules={[{ required: true, message: 'Please input title!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="author"
          label="Author"
          rules={[{ required: true, message: 'Please input author!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="datetime"
          label="Date"
          rules={[{ required: true, message: 'Please select date!' }]}
        >
          <DatePicker />
        </Form.Item>
        <Form.Item
          name="description"
          label="Description"
        >
          <Input.TextArea />
        </Form.Item>
      </Form>
    </Modal>
  );
};