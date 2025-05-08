import { ReviewStatus } from "../../types/common";

// In Backend: PerformanceReviewDTO

export interface PerformanceReview {
  reviewId: number;
  adminId: number;
  adminName: string;
  employeeId: number;
  employeeName: string;

  isOnline: boolean;
  meetLocation: string | null;
  meetLink: string | null;
  startDate: string;
  endDate: string;
  rating: number | null;
  comment: string | null;
  docUrl: string | null;
  status: ReviewStatus;
}
