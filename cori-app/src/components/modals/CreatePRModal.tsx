import React, { useState } from "react";
import { Modal, Button, Form, Input, Select, message, DatePicker, TimePicker } from "antd";
import dayjs from "dayjs";
import CoriBtn from "../buttons/CoriBtn";

interface CreatePRModalProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  onCreateSuccess: () => void;
}

function CreatePRModal({ showModal, setShowModal, onCreateSuccess }: CreatePRModalProps) {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [isOnline, setIsOnline] = useState(false);

  // Handle the creation of the performance review
  const handleCreate = async () => {
    try {
      // Validate the form fields
      const values = await form.validateFields();

      // TODO: Create the performance review
      //   await equipmentAPI.createEquipItemOrItems([values]);
      messageApi.success("Performance Review was created successfully");

      // Reset form and close modal
      form.resetFields();
      setShowModal(false);

      // Notify parent of success
      onCreateSuccess();
    } catch (error: any) {
      if (error.errorFields) {
        // Form validation error
        messageApi.error("Please fill out all fields correctly.");
        return;
      }
      messageApi.error("Error: The performance review was not created.");
      console.error("Error creating performance review:", error);
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
        title={<h2 className="text-zinc-900 font-bold text-3xl">Create a Review Meeting</h2>}
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
          <Button key="create" type="primary" onClick={handleCreate}>
            Create Meeting
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical" variant="filled" className="flex flex-col">
          <Form.Item
            name="startDate"
            label="Meeting Date"
            rules={[{ required: true, message: "Please select a date for the meeting." }]}
          >
            <DatePicker
              className="w-full h-12"
              minDate={dayjs()} // Start from today
              maxDate={dayjs().add(3, "month")} // Max 3 months from today
              format="DD MMM YYYY" // Prettier format
            />
          </Form.Item>
          <Form.Item
            name="startTime"
            label="Start Time"
            rules={[{ required: true, message: "Please select a time for the meeting." }]}
          >
            <TimePicker.RangePicker
              className="w-full h-12"
              format="HH:mm"
              minuteStep={5} // 5 minute increments
              showNow={true}
              disabledTime={() => ({
                // Only allow times between 4am and 9pm
                disabledHours: () => [0, 1, 2, 3, 21, 22, 23],
              })}
              hideDisabledOptions={true} // Hide the disabled options
            />
          </Form.Item>
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
            name="isOnline"
            label="Meeting Type"
            rules={[{ required: true, message: "Please select a meeting type" }]}
          >
            <Select onChange={(value) => setIsOnline(value)}>
              <Select.Option value={true}>Online</Select.Option>
              <Select.Option value={false}>In Person</Select.Option>
            </Select>
          </Form.Item>

          {/* If meeting is online, show the meeting url field */}
          {isOnline === true && (
            <div>
              <Form.Item
                name="meetLink"
                label="Meeting URL"
                rules={[
                  { required: true, message: "A meeting url is required for online meetings." },
                ]}
              >
                <div className="flex gap-2">
                  <Input type="text" />
                  <CoriBtn
                    className="h-12 w-fit text-nowrap"
                    secondary
                    onClick={(e) => {
                      e!.preventDefault();
                      console.log("Generate Link clicked");
                    }}
                  >
                    Generate Link
                  </CoriBtn>
                </div>
              </Form.Item>
            </div>
          )}

          {/* If meeting is in person, show the physical location field */}
          {isOnline === false && (
            <Form.Item
              name="meetLocation"
              label="Physical Location"
              rules={[{ required: true, message: "Please enter a physical location" }]}
            >
              <Input type="text" />
            </Form.Item>
          )}
        </Form>
      </Modal>
    </>
  );
}

export default CreatePRModal;
