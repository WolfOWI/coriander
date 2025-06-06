import React, { useEffect, useState } from "react";

// Import API service
import { empLeaveRequestsAPI } from "../../services/api.service";

import dayjs from "dayjs";
import CoriBtn from "../buttons/CoriBtn";
import TextArea from "antd/es/input/TextArea";
import { Icons } from "../../constants/icons";

import {
  Modal,
  Button,
  Form,
  Select,
  message,
  DatePicker,
} from "antd";
import { getFullCurrentUser } from "../../services/authService";

interface ApplyForLeaveModalProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  onSubmitSuccess: () => void;
}

function ApplyForLeaveModal({
  showModal,
  setShowModal,
  onSubmitSuccess,
}: ApplyForLeaveModalProps) {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle the submission of the leave request
  const handleSubmit = async () => {
    try {
      // Disable button and show loading
      setIsSubmitting(true);

      // Validate the form fields
      const values = await form.validateFields();
      const user = await getFullCurrentUser();

      // Build payload
      const [startDate, endDate] = values.leaveDateRange;
      const payload = {
        employeeId: user.employeeId?.toString(),
        leaveTypeId: values.leaveTypeId,
        startDate: dayjs(startDate).format("YYYY-MM-DD"),
        endDate: dayjs(endDate).format("YYYY-MM-DD"),
        comment: values.comment || "",
        status: 0,
      };

      // Send to backend
      await empLeaveRequestsAPI.createLeaveRequest(payload);

      messageApi.success("Leave request was submitted successfully");

      // Reset form and close modal
      form.resetFields();
      setShowModal(false);

      // Notify parent of success
      onSubmitSuccess();
    } catch (error: any) {
      if (error.errorFields) {
        // Form validation error
        messageApi.error("Please fill out all fields correctly.");
      } else {
        messageApi.error("Error: The leave request was not submitted.");
        console.error("Error submitting leave request:", error);
      }
    } finally {
      // Re-enable button regardless of success or failure
      setIsSubmitting(false);
    }
  };

  // Handle the cancellation of the leave request creation
  const handleCancel = () => {
    setShowModal(false);
    form.resetFields();
  };

  return (
    <>
      {contextHolder}
      <Modal
        title={
          <h2 className="text-zinc-900 font-bold text-3xl">Apply for Leave</h2>
        }
        open={showModal}
        onCancel={handleCancel}
        width={600}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={handleSubmit}
            loading={isSubmitting}
            disabled={isSubmitting}
          >
            Submit Application
          </Button>,
        ]}
      >
        <Form
          form={form}
          layout="vertical"
          variant="filled"
          className="flex flex-col"
        >
          <Form.Item
            name="leaveTypeId"
            label="Leave Type"
            rules={[{ required: true, message: "Please select a leave type" }]}
          >
            <Select>
              <Select.Option value={1}>Annual Leave</Select.Option>
              <Select.Option value={2}>Sick Leave</Select.Option>
              <Select.Option value={3}>Parental Leave</Select.Option>
              <Select.Option value={4}>
                Family Responsibility Leave
              </Select.Option>
              <Select.Option value={5}>Study Leave</Select.Option>
              <Select.Option value={6}>Compassionate Leave</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="leaveDateRange"
            label="Leave Date"
            rules={[{ required: true, message: "Please select a leave date" }]}
          >
            <DatePicker.RangePicker
              className="w-full h-12"
              disabledDate={(current) => current && current < dayjs().startOf("day")}
              format="DD MMM YYYY"
            />
          </Form.Item>
          <Form.Item name="comment" label="Comment">
            <div className="flex gap-2">
              <TextArea rows={4} />
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default ApplyForLeaveModal;
