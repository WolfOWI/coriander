import React, { useEffect } from "react";
import { Modal, Button, Form, Input, Select, DatePicker } from "antd";
import dayjs from "dayjs";
import { Gender, EmployType, PayCycle } from "../../types/common";

interface AdminEditEmpDetailsModalProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  employee: {
    gender: Gender;
    dateOfBirth: string;
    phoneNumber: string;
  } | null;
}

function EmpEditEmpDetailsModal({
  showModal,
  setShowModal,
  employee,
}: AdminEditEmpDetailsModalProps) {
  const [form] = Form.useForm();

  // Update form values when employee data changes
  useEffect(() => {
    if (employee) {
      form.setFieldsValue({
        gender: employee.gender,
        dob: dayjs(employee.dateOfBirth),
        phoneNumber: employee.phoneNumber,
      });
    }
  }, [employee, form]);

  return (
    <Modal
      title={<h2 className="text-zinc-900 font-bold text-3xl">Editing My Details</h2>}
      open={showModal}
      onCancel={() => setShowModal(false)}
      styles={{
        header: {
          paddingLeft: 40,
          paddingRight: 40,
          paddingTop: 40,
        },
        body: {
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
        <Button key="update" type="primary" onClick={() => setShowModal(false)}>
          Update Info
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical" variant="filled" className="flex gap-4">
        {/* Personal Details */}
        <div className="flex flex-col w-full">
          <Form.Item name="gender" label="Gender">
            <Select>
              <Select.Option value={Gender.Male}>Male</Select.Option>
              <Select.Option value={Gender.Female}>Female</Select.Option>
              <Select.Option value={Gender.Other}>Other</Select.Option>
            </Select>
          </Form.Item>
          {/* Date of Birth */}
          <Form.Item name="dob" label="Date of Birth">
            <DatePicker className="w-full h-12" />
          </Form.Item>
          {/* Phone Number */}
          <Form.Item name="phoneNumber" label="Phone Number">
            <Input type="text" />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
}

export default EmpEditEmpDetailsModal;
