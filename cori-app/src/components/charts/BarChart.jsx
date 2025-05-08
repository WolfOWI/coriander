import React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';

const BarChartCard = () => {
  // Employee labels
  const labels = ['Lettie', 'Jennifer', 'John', 'Mpho', 'Ahmed'];

  // Dataset: Average rating & Latest rating
  const chartData = {
    labels,
    series: [
      {
        name: 'Average Rating',
        data: [4.2, 3.8, 4.5, 4.0, 3.6],
      },
      {
        name: 'Latest Rating',
        data: [4.5, 3.5, 4.8, 4.2, 3.2],
      },
    ],
  };

  return (
    <BarChart
      xAxis={[
        {
          scaleType: 'band',
          data: chartData.labels,
          tickLabelStyle: { fontSize: 12, fill: '#333' }, // style x labels
        },
      ]}
      series={chartData.series.map((s, i) => ({
        ...s,
        color: i === 0 ? '#CEDBC0' : '#88A764', // Light green and darker green
      }))}
      width={380}
      height={260}
      sx={{
        '& .MuiBarElement-root': {
          rx: 6, // rounded bars
        },
      }}
      style={{
        marginLeft: '-30px',
      }}
  />
  );
};

export default BarChartCard;
