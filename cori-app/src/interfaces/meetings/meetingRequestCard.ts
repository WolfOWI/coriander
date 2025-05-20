import { MeetStatus } from "../../types/common";

export interface MeetingRequestCard {
  meetingId: number;
  employeeId: number;
  employeeName: string;
  profilePicture: string;
  purpose?: string;
  requestedAt: string;
  status: MeetStatus;
}

