import React, { useEffect } from "react";
import { Modal, Button, Form, Input, Select, DatePicker, message } from "antd";
import dayjs from "dayjs";
import { Gender } from "../../types/common";
import { employeeAPI } from "../../services/api.service";

interface AdminEditEmpDetailsModalProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  employee: {
    employeeId: number;
    gender: Gender;
    dateOfBirth: string;
    phoneNumber: string;
  } | null;
  onUpdate?: () => void; // Callback function after successful update
}

function EmpEditEmpDetailsModal({
  showModal,
  setShowModal,
  employee,
  onUpdate,
}: AdminEditEmpDetailsModalProps) {
  // Initialise the form instance from Ant Design
  const [form] = Form.useForm();

  // Initialize the message system
  // messageApi: The object that contains methods to show different types of messages
  // contextHolder: A React component that needs to be rendered in the component tree
  //               to make the messages work
  const [messageApi, contextHolder] = message.useMessage();

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

  const handleSubmit = async () => {
    try {
      // Validate all form fields
      const values = await form.validateFields();

      // Check if we have an employee ID
      if (!employee?.employeeId) {
        // Show an error message if no employee ID is found
        // .error() displays a red error message
        messageApi.error("No employee ID found");
        return;
      }

      // Prepare the data to be sent
      const updateData = {
        gender: values.gender,
        dateOfBirth: values.dob.format("YYYY-MM-DD"),
        phoneNumber: values.phoneNumber,
      };

      // Update the employee details
      await employeeAPI.editEmployeeById(employee.employeeId.toString(), updateData);

      // Success message if the update was successful
      // .success() displays a green success message
      messageApi.success("Details updated successfully");

      // Call the onUpdate callback if it exists
      if (onUpdate) {
        onUpdate();
      }

      // Close modal
      setShowModal(false);
    } catch (error) {
      messageApi.error("Failed to update details");
      console.error("Update error:", error);
    }
  };

  const handleCancel = () => {
    // Reset the form values to the original values
    if (employee) {
      form.setFieldsValue({
        gender: employee.gender,
        dob: dayjs(employee.dateOfBirth),
        phoneNumber: employee.phoneNumber,
      });
    }
    setShowModal(false);
  };

  return (
    <>
      {/* 
        The contextHolder component must be rendered somewhere in the component tree
        It provides the context needed for the message system to work
        Without this, the messages won't appear
      */}
      {contextHolder}
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
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="update" type="primary" onClick={handleSubmit}>
            Update Info
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical" variant="filled" className="flex gap-4">
          {/* Personal Details */}
          <div className="flex flex-col w-full">
            <Form.Item
              name="gender"
              label="Gender"
              rules={[{ required: true, message: "Please select a gender" }]}
            >
              <Select>
                <Select.Option value={Gender.Male}>Male</Select.Option>
                <Select.Option value={Gender.Female}>Female</Select.Option>
                <Select.Option value={Gender.Other}>Other</Select.Option>
              </Select>
            </Form.Item>
            {/* Date of Birth */}
            <Form.Item
              name="dob"
              label="Date of Birth"
              rules={[{ required: true, message: "Please select a date of birth" }]}
            >
              <DatePicker className="w-full h-12" />
            </Form.Item>
            {/* Phone Number */}
            <Form.Item
              name="phoneNumber"
              label="Phone Number"
              rules={[
                { required: true, message: "Please enter a phone number" },
                { pattern: /^[0-9+\-() ]+$/, message: "Please enter a valid phone number" },
              ]}
            >
              <Input type="text" />
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </>
  );
}

export default EmpEditEmpDetailsModal;
