import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import AdminCalendar from "../../src/components/calender";
import '@testing-library/jest-dom';

// Mock react-calendar to avoid rendering the actual calendar UI
jest.mock('react-calendar', () => (props: any) => (
  <div data-testid="mock-calendar" onClick={() => props.onChange(new Date("2025-06-09"))}>
    Mock Calendar
  </div>
));

describe("AdminCalendar", () => {
  it("renders the calendar component", () => {
    render(<AdminCalendar value={new Date("2025-06-09")} onChange={jest.fn()} />);
    expect(screen.getByTestId("mock-calendar")).toBeInTheDocument();
  });

  it("calls onChange when a date is selected", () => {
    const handleChange = jest.fn();
    render(<AdminCalendar value={new Date("2025-06-09")} onChange={handleChange} />);
    fireEvent.click(screen.getByTestId("mock-calendar"));
    expect(handleChange).toHaveBeenCalledWith(new Date("2025-06-09"));
  });
});