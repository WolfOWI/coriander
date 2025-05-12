import React from "react";
import { BarChart } from "@mui/x-charts/BarChart";

interface BarChartCardProps {
  empUserRatingMetrics: Array<{
    fullName: string;
    averageRating: number;
    mostRecentRating: number;
  }>;
}

const BarChartCard: React.FC<BarChartCardProps> = ({ empUserRatingMetrics }) => {
  if (!empUserRatingMetrics || empUserRatingMetrics.length === 0) {
    return <div className="text-center text-zinc-500">No data available</div>;
  }

  // Transform the empUserRatingMetrics data into chartData
  const labels = empUserRatingMetrics.map((emp) => emp.fullName);
  const chartData = {
    labels,
    series: [
      {
        name: "Average Rating",
        data: empUserRatingMetrics.map((emp) => emp.averageRating),
      },
      {
        name: "Most Recent Rating",
        data: empUserRatingMetrics.map((emp) => emp.mostRecentRating),
      },
    ],
  };

  return (
    <BarChart
      xAxis={[
        {
          scaleType: "band",
          data: chartData.labels,
          tickLabelStyle: { fontSize: 12, fill: "#333" }, // Style x labels
        },
      ]}
      series={chartData.series.map((s, i) => ({
        ...s,
        color: i === 0 ? "#CEDBC0" : "#88A764", // Light green and darker green
      }))}
      width={380}
      height={260}
      sx={{
        "& .MuiBarElement-root": {
          rx: 6, // Rounded bars
        },
      }}
    />
  );
};

export default BarChartCard;