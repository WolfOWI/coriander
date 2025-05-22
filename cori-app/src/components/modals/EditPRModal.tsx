import React, { useState, useEffect } from "react";
import { performanceReviewsAPI } from "../../services/api.service";
import { Modal, Button, Form, message, Rate, Switch } from "antd";
import dayjs from "dayjs";
import TextArea from "antd/es/input/TextArea";
import { Icons } from "../../constants/icons";
import DocUploadWidget from "../uploading/DocUploadWidget";
import { downloadFileFromUrl } from "../../utils/fileUtils";

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
  performanceReview?: PerformanceReviewDTO;
}

function EditPRModal({
  showModal,
  setShowModal,
  onEditSuccess,
  performanceReview,
}: EditPRModalProps) {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [reviews, setReviews] = useState<PerformanceReviewDTO[]>([]);
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string>("");
  const [isCompleted, setIsCompleted] = useState(false);

  // Initialize form values when the modal is opened
  useEffect(() => {
    if (showModal && performanceReview) {
      const commentValue = performanceReview.comment || "";
      const statusValue = performanceReview.status === 2;

      setIsCompleted(statusValue);

      form.setFieldsValue({
        reviewId: performanceReview.reviewId,
        employeeId: performanceReview.employeeId,
        rating: performanceReview.rating,
        comment: commentValue,
        docUrl: performanceReview.docUrl,
        status: statusValue,
      });

      setUploadedFileUrl(performanceReview.docUrl || "");
    }
  }, [showModal, performanceReview, form]);

  useEffect(() => {
    if (!performanceReview) {
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
    }
  }, [performanceReview]);

  // Handle document upload success
  const handleDocUploadSuccess = (url: string) => {
    setUploadedFileUrl(url);
    form.setFieldsValue({ docUrl: url });
  };

  // Handle document download
  const handleViewDocument = (url: string) => {
    if (!url) return;
    downloadFileFromUrl(url, messageApi);
  };

  // Handle switch toggle
  const handleSwitchChange = (checked: boolean) => {
    setIsCompleted(checked);
    form.setFieldsValue({ status: checked });
  };

  // Handle the editing of the performance review
  const handleEdit = async () => {
    try {
      // Validate the form fields
      const values = await form.validateFields();

      if (!performanceReview) {
        messageApi.error("No review selected");
        return;
      }

      const newStatus = isCompleted ? 2 : 1;

      const updatedValues = {
        reviewId: performanceReview.reviewId,
        adminId: performanceReview.adminId,
        employeeId: performanceReview.employeeId,
        isOnline: performanceReview.isOnline,
        meetLocation: performanceReview.meetLocation || "",
        meetLink: performanceReview.meetLink || "",
        startDate: performanceReview.startDate,
        endDate: performanceReview.endDate,
        rating: values.rating || null,
        comment: values.comment || "",
        docUrl: values.docUrl || "",
        status: newStatus,
      };

      try {
        // Call the update API with reviewId and updatedValues
        await performanceReviewsAPI.UpdatePerformanceReview(updatedValues.reviewId, updatedValues);

        messageApi.success("Performance Review was edited successfully");

        // Reset form and close modal
        form.resetFields();
        setShowModal(false);

        // Notify parent of success
        onEditSuccess();
      } catch (apiError: any) {
        messageApi.error("The performance review was not updated.");
      }
    } catch (error: any) {
      messageApi.error("Please fill out all fields correctly.");
    }
  };

  // Handle the cancellation of the performance review creation
  const handleCancel = () => {
    setShowModal(false);
    form.resetFields(); // Clear the form fields
  };

  // Format the date and time for display
  const formatDateTime = () => {
    if (!performanceReview || !performanceReview.startDate) return "";

    const startDate = dayjs(performanceReview.startDate);
    const endDate = dayjs(performanceReview.endDate);

    return `${startDate.format("DD MMM YYYY • HH:mm")} - ${endDate.format("HH:mm")}`;
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
        {performanceReview && (
          <div className="mb-6">
            <div className="text-zinc-800 text-lg font-semibold">
              {performanceReview.employeeName}
            </div>
            <div className="text-zinc-500">{formatDateTime()}</div>
          </div>
        )}

        <Form form={form} layout="vertical" variant="filled" className="flex flex-col">
          <Form.Item name="rating" label="Rating">
            <Rate allowClear className="text-corigreen-500 text-3xl flex gap-1" />
          </Form.Item>

          <Form.Item name="comment" label="Comment">
            <TextArea rows={4} placeholder="Enter a comment" />
          </Form.Item>

          <Form.Item name="docUrl" label="Supporting Document (PDF only)">
            <DocUploadWidget
              onUploadSuccess={handleDocUploadSuccess}
              uploadedFileUrl={uploadedFileUrl}
              onViewFile={handleViewDocument}
            />
          </Form.Item>

          <Form.Item name="status" valuePropName="checked" hidden>
            {/* This hidden field is bound to the form but not visible */}
          </Form.Item>
          <div className="flex items-center gap-2 mb-4">
            <p className="text-zinc-500 text-[12px]">Meeting is completed?</p>
            <Switch
              checked={isCompleted}
              checkedChildren="Yes"
              unCheckedChildren="No"
              onChange={handleSwitchChange}
            />
          </div>
        </Form>
      </Modal>
    </>
  );
}

export default EditPRModal;
