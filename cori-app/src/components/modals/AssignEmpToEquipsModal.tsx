import React, { useState } from "react";
import { Modal, Button, Form } from "antd";
import { EquipmentCondition } from "../../types/common";
import EquipCheckItem from "../equipment/EquipCheckItem";

interface AssignEmpToEquipsModalProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
}

interface Equipment {
  id: string;
  name: string;
  category: string;
  condition: EquipmentCondition;
}

function AssignEmpToEquipsModal({ showModal, setShowModal }: AssignEmpToEquipsModalProps) {
  const [form] = Form.useForm();
  const [selectedEquipments, setSelectedEquipments] = useState<string[]>([]);

  const equipmentList: Equipment[] = [
    {
      id: "equipment1",
      name: "Equipment Name",
      category: "Category",
      condition: EquipmentCondition.Good,
    },
    {
      id: "equipment2",
      name: "Equipment 2",
      category: "Category",
      condition: EquipmentCondition.New,
    },
    {
      id: "equipment3",
      name: "Equipment 3",
      category: "Category",
      condition: EquipmentCondition.Used,
    },
    {
      id: "equipment4",
      name: "Equipment 4",
      category: "Category",
      condition: EquipmentCondition.Decent,
    },
    {
      id: "equipment5",
      name: "Equipment 5",
      category: "Category",
      condition: EquipmentCondition.Good,
    },
    {
      id: "equipment6",
      name: "Equipment 6",
      category: "Category",
      condition: EquipmentCondition.Used,
    },
    {
      id: "equipment7",
      name: "Equipment 7",
      category: "Category",
      condition: EquipmentCondition.New,
    },
  ];

  const handleSelect = (id: string) => {
    setSelectedEquipments((prev) => {
      if (prev.includes(id)) {
        return prev.filter((v) => v !== id);
      }
      return [...prev, id];
    });
  };

  const handleSave = () => {
    form.setFieldsValue({ equipmentList: selectedEquipments });
    form.validateFields().then((values) => {
      console.log("Selected equipment IDs:", values.equipmentList);
      setShowModal(false);
    });
  };

  return (
    <Modal
      title={<h2 className="text-zinc-900 font-bold text-3xl select-none">Assign Equipment</h2>}
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
          paddingTop: 16,
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
        <Button key="create" type="primary" onClick={handleSave}>
          Assign {selectedEquipments.length > 0 ? `(${selectedEquipments.length})` : ""}
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical" variant="filled" className="flex flex-col w-full">
        <Form.Item name="equipmentList" className="flex flex-col w-full">
          <div className="flex flex-col gap-2 w-full h-[400px] overflow-y-auto">
            {equipmentList.map((equipment) => (
              <EquipCheckItem
                key={equipment.id}
                name={equipment.name}
                category={equipment.category}
                condition={equipment.condition}
                isSelected={selectedEquipments.includes(equipment.id)}
                onClick={() => handleSelect(equipment.id)}
              />
            ))}
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default AssignEmpToEquipsModal;
