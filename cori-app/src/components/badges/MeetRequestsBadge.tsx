import React from "react";

interface MeetRequestsBadgeProps {
  requests: number;
  employee?: boolean;
}

function MeetRequestsBadge({ requests, employee }: MeetRequestsBadgeProps) {
  return (
    <>
      {requests > 0 && (
        <div className="bg-sakura-200 text-sakura-900 pl-3 pr-4 py-1 rounded-full border-sakura-500 border-1 flex items-center gap-2">
          <div className="rounded-full bg-sakura-500 w-2 h-2"></div>
          {employee ? (
            <p className="text-sakura-800 font-semibold text-sm">
              {requests} Request{requests === 1 ? "" : "s"} Pending
            </p>
          ) : (
            <p className="text-sakura-800 font-semibold text-sm">
              {requests} Request{requests === 1 ? "" : "s"}
            </p>
          )}
        </div>
      )}
    </>
  );
}

export default MeetRequestsBadge;
