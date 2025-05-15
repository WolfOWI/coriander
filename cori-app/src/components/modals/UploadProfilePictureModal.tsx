import React, { useEffect, useState } from "react";
import { Modal, Upload, message, Button } from "antd";
import { Icons } from "../../constants/icons";
import { RcFile } from "antd/es/upload";
import { empUserAPI, imageAPI } from "../../services/api.service";
import { EmpUser } from "../../interfaces/people/empUser";
import { getFullImageUrl } from "../../utils/imageUtils";

interface UploadProfilePictureModalProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  empUser: EmpUser;
  onUploadSuccess: () => void;
}

function UploadProfilePictureModal({
  showModal,
  setShowModal,
  empUser,
  onUploadSuccess,
}: UploadProfilePictureModalProps) {
  const [messageApi, contextHolder] = message.useMessage();
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>();
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);

  // Set the current image URL
  useEffect(() => {
    setCurrentImageUrl(getFullImageUrl(empUser.profilePicture));
  }, [empUser.profilePicture]);

  // Function to handle file upload
  const handleUpload = async (file: RcFile) => {
    try {
      setUploading(true);

      // Upload the image using the profile-specific endpoint
      await imageAPI.updateProfilePicture(empUser.userId, file);

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

  // Function to handle profile picture deletion
  const handleDelete = async () => {
    try {
      setUploading(true);

      // Remove the profile picture (which also sets the profilePicture field to null)
      await imageAPI.removeProfilePicture(empUser.userId);

      messageApi.success("Profile picture removed successfully");
      onUploadSuccess();
      setShowModal(false);
    } catch (error) {
      console.error("Error removing profile picture:", error);
      messageApi.error("Failed to remove profile picture. Please try again.");
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
    setPreviewUrl(URL.createObjectURL(file));

    // Manually handle the upload
    handleUpload(file);
    return false; // Prevent automatic upload
  };

  return (
    <>
      {contextHolder}
      <Modal
        title={
          <div className="mb-4">
            <h2 className="text-zinc-900 font-bold text-3xl">Profile Picture</h2>
            <p className="text-zinc-500 text-sm mt-1 font-normal">
              Upload or update your profile picture
            </p>
          </div>
        }
        open={showModal}
        onCancel={() => {
          setPreviewUrl(undefined);
          setShowModal(false);
        }}
        width={400}
        footer={
          empUser.profilePicture ? (
            <div className="mb-2">
              <Button danger onClick={handleDelete} disabled={uploading} className="w-full">
                Remove Profile Picture
              </Button>
            </div>
          ) : null
        }
      >
        <Upload.Dragger
          name="file"
          multiple={false}
          showUploadList={false}
          beforeUpload={beforeUpload}
          disabled={uploading}
          style={{
            width: "100%",
            height: "300px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "12px",
            borderColor: "#e5e7eb",
            transition: "all 0.2s ease",
            backgroundColor: "#f9fafb",
          }}
        >
          {previewUrl ? (
            <div className="w-full h-full flex items-center justify-center p-4">
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full h-full object-cover rounded-lg shadow-sm"
              />
            </div>
          ) : empUser.profilePicture ? (
            <div className="w-full h-full flex items-center justify-center p-4">
              <img
                src={currentImageUrl || ""}
                alt="Current"
                className="w-full h-full object-cover rounded-lg shadow-sm"
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-4">
              <div className="p-4">
                <Icons.Upload fontSize="large" className="text-zinc-400" />
              </div>
              <p className="text-zinc-700 text-base font-bold mb-2">Upload a Photo</p>
              <p className="text-zinc-500 text-sm">Click or drag an image here</p>
              <p className="text-zinc-400 text-xs mt-4">PNG, JPG up to 2MB</p>
            </div>
          )}
        </Upload.Dragger>
      </Modal>
    </>
  );
}

export default UploadProfilePictureModal;
