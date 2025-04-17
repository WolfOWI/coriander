import React, { useEffect } from "react";
import { Modal, Button, Form, Input, Select } from "antd";

interface EditEquipDetailsModalProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  equipment: {
    equipmentId: number;
    equipmentName: string;
    equipmentCategoryName: string;
    condition: number;
  } | null;
}

function EditEquipDetailsModal({ showModal, setShowModal, equipment }: EditEquipDetailsModalProps) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (equipment) {
      form.setFieldsValue({
        equipmentName: equipment.equipmentName,
        deviceType: equipment.equipmentCategoryName.toLowerCase(),
        condition: equipment.condition.toString(),
      });
    }
  }, [equipment, form]);

  return (
    <Modal
      title={<h2 className="text-zinc-900 font-bold text-3xl">Edit Equipment Item</h2>}
      open={showModal}
      onCancel={() => setShowModal(false)}
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
        <Button key="cancel" onClick={() => setShowModal(false)}>
          Cancel
        </Button>,
        <Button key="create" type="primary" onClick={() => setShowModal(false)}>
          Save Changes
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical" variant="filled" className="flex flex-col">
        <Form.Item name="equipmentName" label="Equipment Name">
          <Input type="text" />
        </Form.Item>
        <Form.Item name="deviceType" label="Device Type">
          <Select>
            <Select.Option value="cellphone">Cellphone</Select.Option>
            <Select.Option value="tablet">Tablet</Select.Option>
            <Select.Option value="laptop">Laptop</Select.Option>
            <Select.Option value="monitor">Monitor</Select.Option>
            <Select.Option value="headset">Headset</Select.Option>
            <Select.Option value="keyboard">Keyboard</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item name="condition" label="Condition">
          <Select>
            {/* New = 0, Good = 1, Decent = 2, Used = 3 */}
            <Select.Option value="0">New</Select.Option>
            <Select.Option value="1">Good</Select.Option>
            <Select.Option value="2">Decent</Select.Option>
            <Select.Option value="3">Used</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default EditEquipDetailsModal;
