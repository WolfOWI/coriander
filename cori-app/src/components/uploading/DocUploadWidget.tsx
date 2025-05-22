import React from "react";
import { message } from "antd";
import { Icons } from "../../constants/icons";
import { downloadFileFromUrl } from "../../utils/fileUtils";

// Cloudinary Upload Widget declaration
declare global {
  interface Window {
    cloudinary: any;
  }
}

interface DocUploadWidgetProps {
  onUploadSuccess: (url: string) => void;
  uploadedFileUrl?: string;
  onViewFile?: (url: string) => void;
}

const DocUploadWidget: React.FC<DocUploadWidgetProps> = ({
  onUploadSuccess,
  uploadedFileUrl,
  onViewFile,
}) => {
  const [messageApi, contextHolder] = message.useMessage();

  // Handle document download
  const downloadFile = async (url: string) => {
    if (!url) return;
    await downloadFileFromUrl(url, messageApi);
  };

  const handleFileAction = (url: string) => {
    if (onViewFile) {
      onViewFile(url);
    } else {
      downloadFile(url);
    }
  };

  const openUploadWidget = () => {
    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: process.env.VITE_CLOUDINARY_CLOUD_NAME,
        uploadPreset: process.env.VITE_CLOUDINARY_FILEUPLOAD_PRESET,
        sources: ["local", "url"],
        multiple: false,
        defaultSource: "local",
        resourceType: "raw",
        maxFileSize: 10000000, // 10MB
        acceptedFiles: ".pdf", // Only accept PDF files
      },
      (error: any, result: any) => {
        if (error) {
          messageApi.error("Upload failed: " + error.message);
          return;
        }

        if (result && result.event === "success") {
          console.log("Upload successful:", result.info);
          const fileUrl = result.info.secure_url;
          onUploadSuccess(fileUrl);
          messageApi.success("Document uploaded successfully");
        }
      }
    );
    widget.open();
  };

  return (
    <>
      {contextHolder}
      <div className="w-full">
        {uploadedFileUrl ? (
          <div
            className="flex items-center gap-2 p-3 border border-gray-200 rounded cursor-pointer hover:bg-gray-50"
            onClick={() => handleFileAction(uploadedFileUrl)}
          >
            <Icons.TextSnippet />
            <span className="text-sm text-blue-500 underline">Download PDF</span>
          </div>
        ) : (
          <div
            className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded cursor-pointer hover:border-blue-500"
            onClick={openUploadWidget}
          >
            <Icons.Upload className="mb-2 text-gray-500" />
            <p className="text-zinc-500 text-[12px] mb-2">Click to upload a PDF document</p>
            <p className="text-zinc-400 text-[10px]">PDF files only (max. 10MB)</p>
          </div>
        )}
      </div>
    </>
  );
};

export default DocUploadWidget;
