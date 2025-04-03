import React from "react";
import { Modal, Button, Form, Input, Select, DatePicker } from "antd";

interface AdminEditEmpDetailsModalProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
}

function AdminEditEmpDetailsModal({ showModal, setShowModal }: AdminEditEmpDetailsModalProps) {
  return (
    <Modal
      title={<h2 className="text-zinc-900 font-bold text-3xl">Edit Lettie Dlamini</h2>}
      open={showModal}
      onCancel={() => setShowModal(false)}
      width={1200}
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
      <Form layout="vertical" variant="filled" className="flex gap-4">
        {/* Personal Details */}
        <div className="flex flex-col w-full">
          <h2 className="text-zinc-500 font-bold mb-3">Personal Details</h2>
          <Form.Item name="gender" label="Gender">
            <Select>
              <Select.Option value="male">Male</Select.Option>
              <Select.Option value="female">Female</Select.Option>
              <Select.Option value="other">Other</Select.Option>
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
        {/* Employment Details */}
        <div className="flex flex-col w-full">
          <h2 className="text-zinc-500 font-bold mb-3">Employment</h2>
          <Form.Item
            label="Job Title"
            name="jobTitle"
            // rules={[{ required: true, message: "Job title cannot be empty" }]}
          >
            <Input type="text" />
          </Form.Item>
          <Form.Item
            label="Department"
            name="department"
            // rules={[{ required: true, message: "Job title cannot be empty" }]}
          >
            <Input type="text" />
          </Form.Item>
          <Form.Item name="employType" label="Employment Type">
            <Select>
              {/* FullTime = 0, PartTime = 1, Contractor = 2, Intern = 3 */}
              <Select.Option value="0">Full-Time</Select.Option>
              <Select.Option value="1">Part-Time</Select.Option>
              <Select.Option value="2">Contractor</Select.Option>
              <Select.Option value="3">Intern</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="employDate" label="Date of Employment">
            <DatePicker className="w-full h-12" />
          </Form.Item>
        </div>
        {/* Payroll Details */}
        <div className="flex flex-col w-full">
          <h2 className="text-zinc-500 font-bold mb-3">Payroll</h2>
          <Form.Item label="Salary Amount" name="salaryAmount">
            <Input type="number" />
          </Form.Item>
          <Form.Item name="payCycle" label="Pay Cycle">
            <Select>
              {/* Monthly = 0, BiWeekly = 1, Weekly = 2 */}
              <Select.Option value="0">Monthly</Select.Option>
              <Select.Option value="1">Bi-Weekly</Select.Option>
              <Select.Option value="2">Weekly</Select.Option>
            </Select>
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
}

export default AdminEditEmpDetailsModal;
