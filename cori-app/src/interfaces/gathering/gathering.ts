import { GatheringType, MeetStatus, ReviewStatus } from "../../types/common";

export interface Gathering {
  id: number;
  type: GatheringType;
  adminId: number;
  adminName: string;
  employeeId: number;
  employeeName: string;
  isOnline?: boolean;
  meetLocation?: string;
  meetLink?: string;
  startDate?: Date;
  endDate?: Date;

  // Meeting-specific properties
  purpose?: string;
  requestedAt?: Date;
  meetingStatus?: MeetStatus;

  // Performance Review-specific properties
  rating?: number;
  comment?: string;
  docUrl?: string;
  reviewStatus?: ReviewStatus;
}
