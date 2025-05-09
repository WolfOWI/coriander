// In Backend: LeaveBalanceDTO

export interface LeaveBalance {
  // Leave Balance Information
  leaveBalanceId: number;
  remainingDays: number;

  // Leave Type Information
  leaveTypeName: string;
  description: string;
  defaultDays: number;
}
