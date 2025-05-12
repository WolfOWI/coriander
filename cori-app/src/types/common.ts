/**
 * Gender enum matching the backend values
 */
export enum Gender {
  Male = 0,
  Female = 1,
  Other = 2,
}

/**
 * Pay Cycle enum matching the backend values
 */
export enum PayCycle {
  Monthly = 0,
  BiWeekly = 1,
  Weekly = 2,
}

/**
 * Employ Type enum matching the backend values
 */
export enum EmployType {
  FullTime = 0,
  PartTime = 1,
  Contract = 2,
  Intern = 3,
}

/**
 * Equipment Condition enum matching the backend values
 */
export enum EquipmentCondition {
  New = 0,
  Good = 1,
  Decent = 2,
  Used = 3,
}

/**
 * Equipment Category enum matching the backend values
 */
export enum EquipmentCategory {
  Cellphone = 1,
  Tablet = 2,
  Laptop = 3,
  Monitor = 4,
  Headset = 5,
  Keyboard = 6,
}
/**
 * Review Status enum matching the backend values
 */
export enum ReviewStatus {
  Pending = 0,
  Upcoming = 1,
  Completed = 2,
}

/**
 * User Role enum matching the backend values
 */
export enum UserRole {
  Unassigned = 0,
  Employee = 1,
  Admin = 2,
}

export enum LeaveStatus {
  Pending = 0,
  Approved = 1,
  Rejected = 2,
}
