import React from "react";
import { render, screen } from "@testing-library/react";
import BarChartCard from "../../../src/components/charts/BarChart";

// Mock the BarChart from MUI X Charts to avoid rendering SVGs in tests
jest.mock("@mui/x-charts/BarChart", () => ({
  BarChart: (props: any) => (
    <div data-testid="mock-bar-chart">{JSON.stringify(props)}</div>
  ),
}));

describe("BarChartCard", () => {
  const mockData = [
    {
      fullName: "Alice Smith",
      averageRating: 4.2,
      mostRecentRating: 4.5,
    },
    {
      fullName: "Bob Johnson",
      averageRating: 3.8,
      mostRecentRating: 4.0,
    },
  ];

  it("renders the BarChart with correct data", () => {
    render(<BarChartCard empUserRatingMetrics={mockData} />);
    expect(screen.getByTestId("mock-bar-chart")).toBeInTheDocument();
    // Check that the names are split for labels
    expect(screen.getByTestId("mock-bar-chart").textContent).toContain("Alice\nSmith");
    expect(screen.getByTestId("mock-bar-chart").textContent).toContain("Bob\nJohnson");
    // Check that the series data is present
    expect(screen.getByTestId("mock-bar-chart").textContent).toContain("Average Rating");
    expect(screen.getByTestId("mock-bar-chart").textContent).toContain("Most Recent Rating");
  });

  it("shows empty state when no data", () => {
    render(<BarChartCard empUserRatingMetrics={[]} />);
    expect(screen.getByText("No data available")).toBeInTheDocument();
  });

  it("renders the custom legend", () => {
    render(<BarChartCard empUserRatingMetrics={mockData} />);
    expect(screen.getByText("Average Rating")).toBeInTheDocument();
    expect(screen.getByText("Most Recent Rating")).toBeInTheDocument();
    // Check for colored legend dots
    const dots = screen.getAllByRole("presentation", { hidden: true });
    expect(dots.length).toBeGreaterThanOrEqual(2);
  });
});