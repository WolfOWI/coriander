import React, { useState, useEffect } from "react";
import { performanceReviewsAPI } from "../../services/api.service";
import {
  Modal,
  Button,
  Form,
  Select,
  message,
  Rate,
  Upload,
  Switch,
} from "antd";
import dayjs from "dayjs";
import TextArea from "antd/es/input/TextArea";
import { Icons } from "../../constants/icons";

export interface PerformanceReviewDTO {
  reviewId: number;
  adminId: number;
  adminName: string;
  employeeId: number;
  employeeName: string;
  isOnline: boolean;
  meetLocation: string;
  meetLink: string;
  startDate: string;
  endDate: string;
  rating: number;
  comment: string;
  docUrl: string;
  status: number;
}


interface EditPRModalProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  onEditSuccess: () => void;
}

function EditPRModal({ showModal, setShowModal, onEditSuccess }: EditPRModalProps) {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [reviews, setReviews] = useState<PerformanceReviewDTO[]>([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(null);

  useEffect(() => {
    const fetchUpcoming = async () => {
      try {
        const response = await performanceReviewsAPI.GetAllUpcomingPrm();
        const reviewsArray = Array.isArray(response.data)
          ? response.data
          : Array.isArray(response.data?.$values)
          ? response.data.$values
          : [];
        setReviews(reviewsArray);
      } catch (error) {
        messageApi.error("Failed to fetch upcoming reviews");
        setReviews([]);
      }
    };
    fetchUpcoming();
  }, []);

  // When employee is selected, auto-select review and set date/time fields
  const handleEmployeeChange = (employeeId: number) => {
    setSelectedEmployeeId(employeeId);
    const employeeReviews = reviews.filter(r => r.employeeId === employeeId);
    if (employeeReviews.length > 0) {
      const review = employeeReviews[0];
      form.setFieldsValue({
        reviewId: review.reviewId,
        // Add more fields here if you want to show date/time in the form
        // For example, if you have startDate/endDate fields in the form:
        // startDate: dayjs(review.startDate),
        // endDate: dayjs(review.endDate),
      });
    } else {
      form.setFieldsValue({ reviewId: undefined });
    }
  };

  // When review is selected, update date/time fields if needed
  const handleReviewChange = (reviewId: number) => {
    const review = reviews.find(r => r.reviewId === reviewId);
    if (review) {
      // If you have date/time fields in the form, set them here
      // form.setFieldsValue({
      //   startDate: dayjs(review.startDate),
      //   endDate: dayjs(review.endDate),
      // });
    }
  };

  // Handle the editing of the performance review
  const handleEdit = async () => {
    try {
      // Validate the form fields
      const values = await form.validateFields();

      const updatedValues = {
        ...values,
        status: 2, // Always set to Completed
      };

      // Log the data being sent to the backend
      console.log("Updating Performance Review with:", updatedValues);

      // Call the update API with reviewId and updatedValues
      await performanceReviewsAPI.UpdatePerformanceReview(updatedValues.reviewId, updatedValues);

      messageApi.success("Performance Review was edited successfully");

      // Reset form and close modal
      form.resetFields();
      setShowModal(false);

      // Notify parent of success
      onEditSuccess();
    } catch (error: any) {
      if (error.errorFields) {
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
            <Select onChange={handleEmployeeChange}>
              {(reviews || []).map((review) => (
                <Select.Option key={review.employeeId} value={review.employeeId}>
                  {review.employeeName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="reviewId"
            label="Performance Review Date & Time"
            rules={[{ required: true, message: "Please select a review" }]}
          >
            <Select onChange={handleReviewChange}>
              {reviews
                .filter(r => selectedEmployeeId == null || r.employeeId === selectedEmployeeId)
                .map((review) => (
                  <Select.Option key={review.reviewId} value={review.reviewId}>
                    {review.startDate && dayjs(review.startDate).format("DD MMM YYYY • HH:mm")} - {dayjs(review.endDate).format("HH:mm")}
                  </Select.Option>
                ))}
            </Select>
          </Form.Item>
          <Form.Item name="rating" label="Rating">
            <Rate allowClear className="text-corigreen-500 text-3xl flex gap-1" />
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
