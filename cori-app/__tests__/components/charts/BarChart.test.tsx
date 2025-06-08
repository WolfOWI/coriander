import React from "react";
import { render, screen } from "@testing-library/react";
import BarChartCard from "../../../src/components/charts/BarChart";
import '@testing-library/jest-dom';

// Mock the MUI BarChart component to avoid rendering SVGs and focus on props
jest.mock("@mui/x-charts/BarChart", () => ({
  BarChart: (props: any) => (
    <div data-testid="mock-bar-chart">{JSON.stringify(props)}</div>
  ),
}));

describe("BarChartCard", () => {
  const mockData = [
    {
      fullName: "Alice Smith",
      averageRating: 4.5,
      mostRecentRating: 5,
    },
    {
      fullName: "Bob Johnson",
      averageRating: 3.8,
      mostRecentRating: 4,
    },
  ];

  it("renders 'No data available' when no data is provided", () => {
    render(<BarChartCard empUserRatingMetrics={[]} />);
    expect(screen.getByText("No data available")).toBeInTheDocument();
  });

  it("renders the BarChart with correct props when data is provided", () => {
    render(<BarChartCard empUserRatingMetrics={mockData} />);
    const chart = screen.getByTestId("mock-bar-chart");
    expect(chart).toBeInTheDocument();

    // Check that the labels are correct (first name and last name split)
    expect(chart.textContent).toContain("Alice\nSmith");
    expect(chart.textContent).toContain("Bob\nJohnson");

    // Check that the series data is correct
    expect(chart.textContent).toContain('"name":"Average Rating"');
    expect(chart.textContent).toContain('"data":[4.5,3.8]');
    expect(chart.textContent).toContain('"name":"Most Recent Rating"');
    expect(chart.textContent).toContain('"data":[5,4]');

    // Check that the custom colors are applied
    expect(chart.textContent).toContain('"color":"#CEDBC0"');
    expect(chart.textContent).toContain('"color":"#88A764"');
  });

  it("renders the custom legend", () => {
    render(<BarChartCard empUserRatingMetrics={mockData} />);
    expect(screen.getByText("Average Rating")).toBeInTheDocument();
    expect(screen.getByText("Most Recent Rating")).toBeInTheDocument();
  });
});