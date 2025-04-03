// Date Utility Functions

import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { PayCycle } from "../types/common";

dayjs.extend(duration);

// Get the duration of employment in years, months, and days (E.g. "1 year, 2 months, 3 days")
const formatEmploymentDuration = (startDate: string): string => {
  const start = dayjs(startDate);
  const now = dayjs();
  const diff = dayjs.duration(now.diff(start));

  const years = diff.years();
  const months = diff.months();
  const days = diff.days();

  const parts = [];
  if (years > 0) parts.push(`${years} year${years > 1 ? "s" : ""}`);
  if (months > 0) parts.push(`${months} month${months > 1 ? "s" : ""}`);
  if (days > 0) parts.push(`${days} day${days > 1 ? "s" : ""}`);

  return parts.join(", ");
};

// Calculate the next pay day
const calculateNextPayDay = (payCycle: PayCycle, lastPaidDate: string): string => {
  // Format the last paid date (just in case)
  const lastPaid = dayjs(lastPaidDate);

  if (payCycle === PayCycle.Monthly) {
    return lastPaid.add(1, "month").format("DD MMM YYYY");
  }

  if (payCycle === PayCycle.BiWeekly) {
    return lastPaid.add(2, "week").format("DD MMM YYYY");
  }

  if (payCycle === PayCycle.Weekly) {
    return lastPaid.add(1, "week").format("DD MMM YYYY");
  } else {
    return "Invalid Pay Cycle";
  }
};

export { formatEmploymentDuration, calculateNextPayDay };
