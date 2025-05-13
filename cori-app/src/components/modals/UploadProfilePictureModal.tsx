import React, { useState } from "react";
import { Modal, Upload, message, Button, Space } from "antd";
import { Icons } from "../../constants/icons";
import { RcFile } from "antd/es/upload";
import { empUserAPI, imageAPI } from "../../services/api.service";
import { EmpUser } from "../../interfaces/people/empUser";

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
  const [imageUrl, setImageUrl] = useState<string>();

  // Function to handle file upload
  const handleUpload = async (file: RcFile) => {
    try {
      setUploading(true);

      // Upload the image using the profile-specific endpoint
      const relativeUrl = await imageAPI.updateProfilePicture(empUser.userId, file);

      // Update the employee's profile picture in the database
      await empUserAPI.updateEmpUserById(empUser.employeeId.toString(), {
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
        footer={
          empUser.profilePicture ? (
            <div className="px-10 pb-10">
              <Button danger onClick={handleDelete} disabled={uploading} className="w-full">
                Remove Profile Picture
              </Button>
            </div>
          ) : null
        }
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
          ) : empUser.profilePicture ? (
            <img src={empUser.profilePicture} alt="Current" className="max-h-48 object-contain" />
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
