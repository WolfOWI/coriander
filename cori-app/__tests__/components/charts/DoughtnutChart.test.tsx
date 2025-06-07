import React from "react";
import { render, screen } from "@testing-library/react";
import DoughnutChartCard from "../../../src/components/charts/DoughnutChart";

import '@testing-library/jest-dom';

// Mock the PieChart from MUI X Charts to avoid rendering SVGs in tests
jest.mock("@mui/x-charts/PieChart", () => ({
  PieChart: (props: any) => (
    <div data-testid="mock-pie-chart">{JSON.stringify(props)}</div>
  ),
}));

describe("DoughnutChartCard", () => {
  const mockTotals = {
    totalEmployees: 20,
    totalFullTimeEmployees: 10,
    totalPartTimeEmployees: 4,
    totalInternEmployees: 2,
    totalContractEmployees: 3,
    totalSuspendedEmployees: 1,
  };

  it("renders the PieChart with correct data", () => {
    render(<DoughnutChartCard employeeStatusTotals={mockTotals} />);
    expect(screen.getByTestId("mock-pie-chart")).toBeInTheDocument();
    // Check that the data labels are present in the props
    expect(screen.getByTestId("mock-pie-chart").textContent).toContain("Full Time");
    expect(screen.getByTestId("mock-pie-chart").textContent).toContain("Part Time");
    expect(screen.getByTestId("mock-pie-chart").textContent).toContain("Intern");
    expect(screen.getByTestId("mock-pie-chart").textContent).toContain("Contract");
    expect(screen.getByTestId("mock-pie-chart").textContent).toContain("Suspended");
  });

  it("renders the total employees count", () => {
    render(<DoughnutChartCard employeeStatusTotals={mockTotals} />);
    expect(screen.getByText("20")).toBeInTheDocument();
    expect(screen.getByText("Employees")).toBeInTheDocument();
  });

  it("renders the custom legend", () => {
    render(<DoughnutChartCard employeeStatusTotals={mockTotals} />);
    expect(screen.getByText("Full Time")).toBeInTheDocument();
    expect(screen.getByText("Part Time")).toBeInTheDocument();
    expect(screen.getByText("Intern")).toBeInTheDocument();
    expect(screen.getByText("Contract")).toBeInTheDocument();
    expect(screen.getByText("Suspended")).toBeInTheDocument();
    // Check for colored legend dots (span with backgroundColor)
    const dots = screen.getAllByRole("presentation", { hidden: true });
    expect(dots.length).toBeGreaterThanOrEqual(5);
  });
});