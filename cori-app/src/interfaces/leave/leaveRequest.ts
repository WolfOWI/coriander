export interface LeaveRequest {
    leaveRequestId: number;
    employeeId: number;
    employeeName: string;
    leaveType: string;
    startDate: string;
    endDate: string;
    comment: string;
    status: number;
    createdAt: string;
    leaveTypeName: string;
    description: string;
    defaultDays: number;
}