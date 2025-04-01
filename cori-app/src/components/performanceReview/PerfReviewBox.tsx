import React from "react";

// Import Google Icons
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import TextSnippetRoundedIcon from "@mui/icons-material/TextSnippetRounded";

function PerfReviewBox() {
  return (
    <div className="bg-warmstone-50 p-4 rounded-2xl w-full flex flex-col items-center gap-3">
      {/* Heading Section */}
      <div className="w-full flex flex-col gap-1">
        <div className="w-full flex items-center justify-between">
          <h2 className="text-zinc-800 font-bold">Meet with Johnny</h2>
          <div className="flex items-center gap-2">
            <p className="text-zinc-500 text-[12px]">Online</p>
            <div className="bg-blue-300 rounded-full w-4 h-4"></div>
          </div>
        </div>

        <div className="w-full flex items-center gap-4">
          <p className="text-zinc-500">24 Feb 2024</p>
          <p className="text-zinc-500">•</p>
          <p className="text-zinc-500">14:00 - 15:00</p>
        </div>
      </div>
      {/* Body Section (Comment, Rating, PDF Attachment) */}
      <div className="w-full flex flex-col gap-2">
        {/* Comment */}
        <p className="text-zinc-500 text-[12px]">
          Lettie consistently exceeds expectations in his role, demonstrating exceptional teamwork
          and a strong work ethic.
        </p>
        <div className="flex w-full items-center gap-4">
          {/* Rating */}
          <div className="flex items-center gap-1">
            <StarRoundedIcon className="text-amber-300" />
            <p className="text-zinc-800 font-bold">4</p>
          </div>
          {/* PDF Attachment */}
          <div className="flex items-center gap-1">
            <p className="text-zinc-500 text-[12px]">PDF Attached</p>
            <TextSnippetRoundedIcon className="text-zinc-500" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default PerfReviewBox;
