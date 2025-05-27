import { MeetStatus } from "../../types/common";

export interface MeetingDTO {
  meetingId: number;
  adminId: number;
  adminName: string;
  employeeId: number;
  employeeName: string;
  isOnline: boolean;
  meetLocation: string;
  meetLink: string;
  startDate: string;
  endDate: string;
  purpose: string;
  status: MeetStatus;
}
