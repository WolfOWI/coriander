import React from "react";

// Import Google Icons
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import TextSnippetRoundedIcon from "@mui/icons-material/TextSnippetRounded";
import CoriBtn from "../buttons/CoriBtn";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import { Button } from "react-bootstrap";

interface PerfReviewBoxProps {
  showPerson?: boolean;
}

// showPerson property is used to determine if the person's name is shown in the heading (for different screens)
// TODO: Depending on data, it would show & hide different sections of this component (yet to be created)
function PerfReviewBox({ showPerson = true }: PerfReviewBoxProps) {
  return (
    <div className="bg-warmstone-50 p-4 rounded-2xl w-full flex flex-col items-center gap-3">
      {/* Heading Section */}
      <div className="w-full flex flex-col gap-1">
        <div className="w-full flex items-center justify-between">
          {showPerson ? (
            <h2 className="text-zinc-800 font-bold">Meet with Jou Ma</h2>
          ) : (
            <div className="w-full flex items-center gap-4 text-zinc-800 font-bold">
              <p>24 Feb 2024</p>
              <p>•</p>
              <p>14:00 - 15:00</p>
            </div>
          )}
          <div className="flex items-center gap-2">
            <p className="text-zinc-500 text-[12px]">Online</p>
            <div className="bg-blue-300 rounded-full w-4 h-4"></div>
          </div>
        </div>

        {showPerson && (
          <div className="w-full flex items-center gap-4 text-zinc-500">
            <p>24 Feb 2024</p>
            <p>•</p>
            <p>14:00 - 15:00</p>
          </div>
        )}
      </div>
      {/* Body Section (Comment, Rating, PDF Attachment) */}
      <div className="w-full flex flex-col gap-3">
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
      {/* Footer Section (Location / Action Buttons) */}
      <div className="w-full flex items-center justify-between gap-3">
        <div className="w-full h-full flex items-center justify-center bg-corigreen-100 rounded-2xl">
          <p className="text-corigreen-500 text-[12px]">meet.google.com/pfh-akdk-pyo</p>
        </div>
        <CoriBtn primary style="black">
          Join
        </CoriBtn>
        <Button variant="link" className="p-0">
          <MoreVertRoundedIcon className="text-zinc-500" />
        </Button>
      </div>
    </div>
  );
}

export default PerfReviewBox;
