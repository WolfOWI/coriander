import React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';

// Type for chartData
type ChartData = {
  labels: string[];
  series: {
    name: string;
    data: number[];
  }[];
};

interface BarChartCardProps {
  chartData: ChartData;
}

const BarChartCard: React.FC<BarChartCardProps> = ({ chartData }) => {
  return (
    <BarChart
      xAxis={[
        {
          scaleType: 'band',
          data: chartData.labels,
          tickLabelStyle: { fontSize: 12, fill: '#333' },
        },
      ]}
      series={chartData.series.map((s, i) => ({
        ...s,
        color: i === 0 ? '#CEDBC0' : '#88A764',
      }))}
      width={380}
      height={260}
      sx={{
        '& .MuiBarElement-root': {
          rx: 6,
        },
      }}
    />
  );
};

export default BarChartCard;
