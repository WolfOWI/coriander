import { EmployType, PayCycle, Gender } from "../types/common";

export interface EmpUser {
  userId: number;
  fullName: string;
  email: string;
  googleId: string | null;
  profilePicture: string;
  role: number;
  employeeId: number;
  gender: Gender;
  dateOfBirth: string;
  phoneNumber: string;
  jobTitle: string;
  department: string;
  salaryAmount: number;
  payCycle: PayCycle;
  lastPaidDate: string;
  employType: EmployType;
  employDate: string;
  isSuspended: boolean;
}
