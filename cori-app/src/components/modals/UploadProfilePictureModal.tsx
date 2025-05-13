import React, { useState } from "react";
import { Modal, Upload, message } from "antd";
import { Icons } from "../../constants/icons";
import { RcFile } from "antd/es/upload";
import { empUserAPI } from "../../services/api.service";

interface UploadProfilePictureModalProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  employeeId: string;
  onUploadSuccess: () => void;
}

function UploadProfilePictureModal({
  showModal,
  setShowModal,
  employeeId,
  onUploadSuccess,
}: UploadProfilePictureModalProps) {
  const [messageApi, contextHolder] = message.useMessage();
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>();

  // Function to handle file upload
  const handleUpload = async (file: RcFile) => {
    try {
      setUploading(true);

      // Create form data
      const formData = new FormData();
      formData.append("file", file);

      // Upload the image
      const response = await fetch(`${process.env.VITE_API_URL}/Image/upload`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const data = await response.json();

      if (!data.imageUrl) {
        throw new Error("No image URL returned from server");
      }

      // Remove any leading slash and 'uploads' if present
      const fileName = data.imageUrl.replace(/^\//, "").replace(/^uploads\//, "");
      // Store just the relative path
      const relativeUrl = `/uploads/${fileName}`;

      await empUserAPI.updateEmpUserById(employeeId, {
        profilePicture: relativeUrl,
      });

      messageApi.success("Profile picture updated successfully");
      onUploadSuccess();
      setShowModal(false);
    } catch (error) {
      console.error("Error uploading image:", error);
      messageApi.error("Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  // Before upload handler
  const beforeUpload = (file: RcFile) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      messageApi.error("You can only upload image files!");
      return false;
    }

    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      messageApi.error("Image must be smaller than 2MB!");
      return false;
    }

    // Create preview URL for the upload modal
    setImageUrl(URL.createObjectURL(file));

    // Manually handle the upload
    handleUpload(file);
    return false; // Prevent automatic upload
  };

  return (
    <>
      {contextHolder}
      <Modal
        title={<h2 className="text-zinc-900 font-bold text-3xl">Upload Profile Picture</h2>}
        open={showModal}
        onCancel={() => setShowModal(false)}
        footer={null}
        width={400}
        styles={{
          header: {
            paddingLeft: 40,
            paddingRight: 40,
            paddingTop: 40,
          },
          body: {
            paddingTop: 20,
            padding: 40,
          },
          footer: {
            paddingLeft: 40,
            paddingRight: 40,
            paddingBottom: 40,
          },
        }}
      >
        <Upload.Dragger
          name="file"
          multiple={false}
          showUploadList={false}
          beforeUpload={beforeUpload}
          disabled={uploading}
          className="w-full"
        >
          {imageUrl ? (
            <img src={imageUrl} alt="Preview" className="max-h-48 object-contain" />
          ) : (
            <>
              <p className="ant-upload-drag-icon">
                <Icons.Upload className="text-4xl text-zinc-400" />
              </p>
              <p className="text-zinc-500 text-sm mb-2">Click or drag an image to upload</p>
              <p className="text-zinc-400 text-xs">PNG, JPG up to 2MB</p>
            </>
          )}
        </Upload.Dragger>
      </Modal>
    </>
  );
}

export default UploadProfilePictureModal;
