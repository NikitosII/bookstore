import { Input, Modal, Form } from "antd";
import { useEffect, useState } from "react";
import { Book, BookRequest } from "../models/Book";

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
      });
    }
  }, [values, form, isModalOpen]);


  const handleOk = async () => {
    try {
      setLoading(true);
      const formValues = await form.validateFields();
      const datetime = mode === Mode.Create
        ? new Date().toISOString()
        : values.datetime;

      const bookRequest = {
        ...formValues,
        datetime: datetime
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
          name="description"
          label="Description"
        >
          <Input.TextArea />
        </Form.Item>
      </Form>
    </Modal>
  );
};