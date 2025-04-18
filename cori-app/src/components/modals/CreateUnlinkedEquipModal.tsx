import React from "react";
import { Modal, Button, Form, Input, Select } from "antd";

interface CreateUnlinkedEquipModalProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  // Pass the form data to the parent component
  onCreate: (data: object) => void;
}

function CreateUnlinkedEquipModal({
  showModal,
  setShowModal,
  onCreate,
}: CreateUnlinkedEquipModalProps) {
  const [form] = Form.useForm();

  // Handle the creation of the equipment item
  const handleCreate = () => {
    // Validate the form fields
    form.validateFields().then((values) => {
      onCreate(values); // Pass the form data to the parent component
    });
  };

  // Handle the cancellation of the equipment item creation
  const handleCancel = () => {
    setShowModal(false);
    form.resetFields(); // Clear the form fields
  };

  return (
    <Modal
      title={<h2 className="text-zinc-900 font-bold text-3xl">Create Equipment Item</h2>}
      open={showModal}
      onCancel={handleCancel}
      width={600}
      styles={{
        header: {
          paddingLeft: 40,
          paddingRight: 40,
          paddingTop: 40,
        },
        body: {
          paddingTop: 20,
          padding: 40,
        },
        footer: {
          paddingLeft: 40,
          paddingRight: 40,
          paddingBottom: 40,
        },
      }}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Cancel
        </Button>,
        <Button key="create" type="primary" onClick={handleCreate}>
          Create Item
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical" variant="filled" className="flex flex-col">
        <Form.Item
          name="equipmentName"
          label="Equipment Name"
          rules={[{ required: true, message: "Please enter the equipment name" }]}
        >
          <Input type="text" />
        </Form.Item>
        <Form.Item
          name="equipmentCatId"
          label="Equipment Category"
          rules={[{ required: true, message: "Please select an equipment category" }]}
        >
          <Select>
            <Select.Option value={1}>Cellphone</Select.Option>
            <Select.Option value={2}>Tablet</Select.Option>
            <Select.Option value={3}>Laptop</Select.Option>
            <Select.Option value={4}>Monitor</Select.Option>
            <Select.Option value={5}>Headset</Select.Option>
            <Select.Option value={6}>Keyboard</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="condition"
          label="Condition"
          rules={[{ required: true, message: "Please select a condition" }]}
        >
          <Select>
            {/* New = 0, Good = 1, Decent = 2, Used = 3 */}
            <Select.Option value={0}>New</Select.Option>
            <Select.Option value={1}>Good</Select.Option>
            <Select.Option value={2}>Decent</Select.Option>
            <Select.Option value={3}>Used</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default CreateUnlinkedEquipModal;
