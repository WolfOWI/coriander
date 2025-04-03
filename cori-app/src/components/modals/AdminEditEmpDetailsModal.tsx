import React, { useEffect } from "react";
import { Modal, Button, Form, Input, Select, DatePicker } from "antd";
import dayjs from "dayjs";
import { Gender, EmployType, PayCycle } from "../../types/common";

interface AdminEditEmpDetailsModalProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  employee: {
    fullName: string;
    gender: Gender;
    dateOfBirth: string;
    phoneNumber: string;
    jobTitle: string;
    department: string;
    employType: EmployType;
    employDate: string;
    salaryAmount: number;
    payCycle: PayCycle;
  } | null;
}

function AdminEditEmpDetailsModal({
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
        jobTitle: employee.jobTitle,
        department: employee.department,
        employType: employee.employType,
        employDate: dayjs(employee.employDate),
        salaryAmount: employee.salaryAmount,
        payCycle: employee.payCycle,
      });
    }
  }, [employee, form]);

  return (
    <Modal
      title={<h2 className="text-zinc-900 font-bold text-3xl">Edit {employee?.fullName}</h2>}
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
      <Form form={form} layout="vertical" variant="filled" className="flex gap-4">
        {/* Personal Details */}
        <div className="flex flex-col w-full">
          <h2 className="text-zinc-500 font-bold mb-3">Personal Details</h2>
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
        {/* Employment Details */}
        <div className="flex flex-col w-full">
          <h2 className="text-zinc-500 font-bold mb-3">Employment</h2>
          <Form.Item label="Job Title" name="jobTitle">
            <Input type="text" />
          </Form.Item>
          <Form.Item label="Department" name="department">
            <Input type="text" />
          </Form.Item>
          <Form.Item name="employType" label="Employment Type">
            <Select>
              <Select.Option value={EmployType.FullTime}>Full-Time</Select.Option>
              <Select.Option value={EmployType.PartTime}>Part-Time</Select.Option>
              <Select.Option value={EmployType.Contract}>Contractor</Select.Option>
              <Select.Option value={EmployType.Intern}>Intern</Select.Option>
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
              <Select.Option value={PayCycle.Monthly}>Monthly</Select.Option>
              <Select.Option value={PayCycle.BiWeekly}>Bi-Weekly</Select.Option>
              <Select.Option value={PayCycle.Weekly}>Weekly</Select.Option>
            </Select>
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
}

export default AdminEditEmpDetailsModal;
