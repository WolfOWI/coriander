import React from "react";

interface MeetRequestsBadgeProps {
  requests: number;
}

function MeetRequestsBadge({ requests }: MeetRequestsBadgeProps) {
  return (
    <>
      {requests > 0 && (
        <div className="bg-sakura-200 text-sakura-900 pl-3 pr-4 py-1 rounded-full border-sakura-500 border-1 flex items-center gap-2">
          <div className="rounded-full bg-sakura-500 w-2 h-2"></div>
          <p className="text-sakura-800 font-semibold text-sm">
            {requests} Request{requests === 1 ? "" : "s"}
          </p>
        </div>
      )}
    </>
  );
}

export default MeetRequestsBadge;
