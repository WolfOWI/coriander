import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { PayCycle } from "../../src/types/common";
import {
  formatEmploymentDuration,
  calculateNextPayDay,
  calculatePreviousPayDay,
  formatTimestampToDate,
  formatTimestampToTime,
  combineDateTimeToTimestamp,
  isDateInPast,
  calculateDurationInDays,
} from "../../src/utils/dateUtils";

dayjs.extend(duration);

describe("dateUtils", () => {
  const mockCurrentDate = "2025-01-01T10:30:00.000Z";

  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date(mockCurrentDate));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  describe("formatEmploymentDuration", () => {
    it("should format duration with years, months, and days", () => {
      const startDate = "2021-10-09T00:00:00.000Z";
      const result = formatEmploymentDuration(startDate);
      expect(result).toBe("3 years, 2 months, 24 days");
    });

    it("should handle same day employment", () => {
      const result = formatEmploymentDuration(mockCurrentDate);
      expect(result).toBe("");
    });
  });

  describe("calculateNextPayDay", () => {
    const lastPaidDate = "2024-01-01T00:00:00.000Z";

    it("should calculate next monthly pay day", () => {
      const result = calculateNextPayDay(PayCycle.Monthly, lastPaidDate);
      expect(result).toBe("01 Feb 2024");
    });

    it("should calculate next bi-weekly pay day", () => {
      const result = calculateNextPayDay(PayCycle.BiWeekly, lastPaidDate);
      expect(result).toBe("15 Jan 2024");
    });

    it("should handle invalid pay cycle", () => {
      const result = calculateNextPayDay(999 as PayCycle, lastPaidDate);
      expect(result).toBe("Invalid Pay Cycle");
    });
  });

  describe("calculatePreviousPayDay", () => {
    const lastPaidDate = "2024-02-01T00:00:00.000Z";

    it("should calculate previous monthly pay day", () => {
      const result = calculatePreviousPayDay(PayCycle.Monthly, lastPaidDate);
      expect(result).toBe("01 Jan 2024");
    });

    it("should calculate previous weekly pay day", () => {
      const result = calculatePreviousPayDay(PayCycle.Weekly, lastPaidDate);
      expect(result).toBe("25 Jan 2024");
    });
  });

  describe("formatTimestampToDate", () => {
    it("should format ISO timestamp to date string", () => {
      const timestamp = "2024-04-01T15:30:45.123Z";
      const result = formatTimestampToDate(timestamp);
      expect(result).toBe("01 Apr 2024");
    });
  });

  describe("formatTimestampToTime", () => {
    it("should format ISO timestamp to time string", () => {
      const timestamp = "2024-04-01T15:30:45.123Z";
      const result = formatTimestampToTime(timestamp);
      expect(result).toBe("17:30"); // UTC+2 timezone
    });
  });

  describe("combineDateTimeToTimestamp", () => {
    it("should combine date and time into ISO timestamp", () => {
      const date = "2024-04-01";
      const time = "15:30";
      const result = combineDateTimeToTimestamp(date, time);
      expect(result).toBe("2024-04-01T13:30:00.000Z");
    });
  });

  describe("isDateInPast", () => {
    it("should return true for past dates", () => {
      const pastDate = "2024-12-25T00:00:00.000Z";
      expect(isDateInPast(pastDate)).toBe(true);
    });

    it("should return false for future dates", () => {
      const futureDate = "2025-01-15T00:00:00.000Z";
      expect(isDateInPast(futureDate)).toBe(false);
    });
  });

  describe("calculateDurationInDays", () => {
    it("should calculate duration between two dates", () => {
      const startDate = "2024-01-01T00:00:00.000Z";
      const endDate = "2024-01-10T00:00:00.000Z";
      const result = calculateDurationInDays(startDate, endDate);
      expect(result).toBe(9);
    });

    it("should return 0 for same dates", () => {
      const date = "2024-01-01T00:00:00.000Z";
      const result = calculateDurationInDays(date, date);
      expect(result).toBe(0);
    });
  });
});
