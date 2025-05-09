// In Backend: EmpUserRatingMetricsDTO

export interface EmpUserRatingMetrics {
  employeeId: number;
  fullName: string;
  averageRating: number;
  numberOfRatings: number;
  mostRecentRating: number;
}
