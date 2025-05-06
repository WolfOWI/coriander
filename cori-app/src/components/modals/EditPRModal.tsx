import React, { useState } from "react";
import {
  Modal,
  Button,
  Form,
  Input,
  Select,
  message,
  DatePicker,
  TimePicker,
  Rate,
  Upload,
  Switch,
} from "antd";
import dayjs from "dayjs";
import CoriBtn from "../buttons/CoriBtn";
import TextArea from "antd/es/input/TextArea";
import { Icons } from "../../constants/icons";

interface EditPRModalProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  onEditSuccess: () => void;
}

function EditPRModal({ showModal, setShowModal, onEditSuccess }: EditPRModalProps) {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  // Handle the editing of the performance review
  const handleEdit = async () => {
    try {
      // Validate the form fields
      const values = await form.validateFields();

      // TODO: Edit the performance review
      //   await equipmentAPI.createEquipItemOrItems([values]);
      messageApi.success("Performance Review was edited successfully");

      // Reset form and close modal
      form.resetFields();
      setShowModal(false);

      // Notify parent of success
      onEditSuccess();
    } catch (error: any) {
      if (error.errorFields) {
        // Form validation error
        messageApi.error("Please fill out all fields correctly.");
        return;
      }
      messageApi.error("Error: The performance review was not updated.");
      console.error("Error updating performance review:", error);
    }
  };

  // Handle the cancellation of the performance review creation
  const handleCancel = () => {
    setShowModal(false);
    form.resetFields(); // Clear the form fields
  };

  return (
    <>
      {contextHolder}
      <Modal
        title={<h2 className="text-zinc-900 font-bold text-3xl">Edit Performance Review</h2>}
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
            paddingTop: 16,
            paddingBottom: 16,
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
          <Button key="edit" type="primary" onClick={handleEdit}>
            Update Review
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical" variant="filled" className="flex flex-col">
          <Form.Item
            name="employeeId"
            label="Employee"
            rules={[{ required: true, message: "Please select an employee" }]}
          >
            <Select>
              <Select.Option value={1}>Employee 1</Select.Option>
              <Select.Option value={2}>Employee 2</Select.Option>
              <Select.Option value={3}>Employee 3</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="reviewId"
            label="Performance Review Date & Time"
            rules={[{ required: true, message: "Please select a review" }]}
          >
            <Select>
              <Select.Option value={1}>01 Jan 2025 • 10:00 - 11:00</Select.Option>
              <Select.Option value={2}>02 Jan 2025 • 10:00 - 11:00</Select.Option>
              <Select.Option value={3}>03 Jan 2025 • 10:00 - 11:00</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="rating" label="Rating">
            <div className="flex gap-2">
              <Rate
                onChange={(value) => console.log(value)}
                allowClear
                className="text-corigreen-500 text-3xl flex gap-1"
              />
            </div>
          </Form.Item>

          <Form.Item name="comment" label="Comment">
            <div className="flex gap-2">
              <TextArea rows={4} />
            </div>
          </Form.Item>

          <Form.Item name="docUrl" valuePropName="fileList">
            <Upload.Dragger name="docUrl" action="/">
              <p className="ant-upload-drag-icon">
                <Icons.Upload />
              </p>
              <p className="text-zinc-500 text-[12px] mb-2">Upload a supporting document</p>
            </Upload.Dragger>
          </Form.Item>

          <Form.Item name="status">
            <div className="flex items-center gap-2">
              <p className="text-zinc-500 text-[12px]">Meeting is completed?</p>
              <Switch checkedChildren="Yes" unCheckedChildren="No" />
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default EditPRModal;
