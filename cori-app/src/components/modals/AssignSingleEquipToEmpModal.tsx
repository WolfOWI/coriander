import React from "react";
import { Modal, Button, Form, Select, DatePicker, Space } from "antd";

import { Icons } from "../../constants/icons";

interface AssignSingleEquipToEmpModalProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
}

// TODO: Temporary data here
const options = [
  {
    value: 1,
    label: "John Doe",
    employeeId: 1,
    fullName: "John Doe",
    profilePicture: "https://randomuser.me/api/portraits/men/47.jpg",
    assignedItems: 4,
    hasDeviceType: true,
  },
  {
    value: 2,
    label: "Jane Doe",
    employeeId: 2,
    fullName: "Jane Doe",
    profilePicture: "https://randomuser.me/api/portraits/women/42.jpg",
    assignedItems: 1,
    hasDeviceType: false,
  },
  {
    value: 3,
    label: "Lucias Anderson",
    employeeId: 3,
    fullName: "Lucias Anderson",
    profilePicture: "https://randomuser.me/api/portraits/men/17.jpg",
    assignedItems: 0,
    hasDeviceType: false,
  },
  {
    value: 4,
    label: "Marcus Land",
    employeeId: 4,
    fullName: "Marcus Land",
    profilePicture: "https://randomuser.me/api/portraits/men/20.jpg",
    assignedItems: 8,
    hasDeviceType: true,
  },
];

function AssignSingleEquipToEmpModal({
  showModal,
  setShowModal,
}: AssignSingleEquipToEmpModalProps) {
  const [form] = Form.useForm();

  const handleSave = () => {
    form.validateFields().then((values) => {
      console.log("Selected employee ID:", values.employee);
      setShowModal(false);
    });
  };

  return (
    <Modal
      title={<h2 className="text-zinc-900 font-bold text-3xl">Assign To Employee</h2>}
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
          Save Changes
        </Button>,
      ]}
    >
      <div className="flex items-center gap-3 px-4 py-3 bg-warmstone-300 rounded-xl mb-4">
        <div className="bg-warmstone-50 rounded-full p-2">
          <Icons.Phone className="text-zinc-900" fontSize="large" />
        </div>
        <div className="flex flex-col">
          <p className="text-zinc-900">Equipment Name</p>
          <div className="flex items-center gap-2">
            <p className="text-zinc-500 text-sm">Category</p>
            <p className="text-zinc-500 text-sm">•</p>
            <p className="text-zinc-500 text-sm">Decent Quality</p>
          </div>
        </div>
      </div>
      <Form form={form} layout="vertical" variant="filled" className="flex flex-col">
        <Form.Item name="employee" label="Employee">
          <Select
            showSearch
            placeholder="Select a person"
            optionFilterProp="label"
            options={options}
            optionRender={(option) => (
              <div className="flex items-center justify-between" key={option.data.employeeId}>
                <div className="flex items-center gap-2">
                  <img
                    src={option.data.profilePicture}
                    alt={option.data.fullName}
                    className="w-8 h-8 rounded-full"
                  />
                  <div className="flex flex-col">
                    <p className="text-zinc-900">{option.data.fullName}</p>
                    <p className="text-zinc-500 text-sm">
                      {option.data.assignedItems}{" "}
                      {option.data.assignedItems === 1 ? "item" : "items"}
                    </p>
                  </div>
                </div>
                {option.data.hasDeviceType && (
                  <div className="flex items-center gap-1">
                    <Icons.Error className="text-yellow-500" fontSize="small" />
                    <p className="text-zinc-500 text-[12px]">Phone Already Assigned</p>
                  </div>
                )}
              </div>
            )}
          />
        </Form.Item>
        <Form.Item name="assignedDate" label="Assigned Date">
          <DatePicker className="w-full h-12" />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default AssignSingleEquipToEmpModal;
