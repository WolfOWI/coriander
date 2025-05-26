import { formatPhone, formatRandAmount } from "../../src/utils/formatUtils";

describe("formatPhone", () => {
  test("formats a valid 10-digit phone number correctly", () => {
    expect(formatPhone("0123456789")).toBe("+27 12 345 6789");
  });

  test("removes non-numeric characters", () => {
    expect(formatPhone("012-345-6789")).toBe("+27 12 345 6789");
    expect(formatPhone("(012) 345 6789")).toBe("+27 12 345 6789");
  });

  test("truncates extra digits", () => {
    expect(formatPhone("01234567890123")).toBe("+27 12 345 6789");
  });
});

describe("formatRandAmount", () => {
  test("formats large numbers correctly", () => {
    const result = formatRandAmount(1234567890.12);
    expect(result).toMatch(/R\s1\s234\s567\s890,12/);
  });

  test("formats decimal numbers correctly", () => {
    const result = formatRandAmount(1234567.89);
    expect(result).toMatch(/R\s1\s234\s567,89/);
  });

  test("formats zero correctly", () => {
    const result = formatRandAmount(0);
    expect(result).toMatch(/R\s0,00/);
  });

  test("formats negative numbers correctly", () => {
    const result = formatRandAmount(-1234.56);
    expect(result).toMatch(/-R\s1\s234,56/);
  });
});
