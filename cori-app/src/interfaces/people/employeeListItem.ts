export interface EmployeeListItem {
  empUser: {
    employeeId: number;
    fullName: string;
    gender: string;
    jobTitle: string;
    department: string;
    profilePicture: string | null;
    employType: number;
    salaryAmount: number;
    payCycle: number;
    lastPaidDate: string;
    isSuspended: boolean;
  };
  empUserRatingMetrics?: {
    averageRating: number;
    numberOfRatings: number;
  };
  totalLeaveBalanceSum?: {
    totalRemainingDays: number;
    totalLeaveDays: number;
  };
}
