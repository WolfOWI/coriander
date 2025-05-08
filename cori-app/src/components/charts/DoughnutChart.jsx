import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import { PieChart } from '@mui/x-charts/PieChart';

const DoughnutChartCard = () => {
  const employeeData = [
    { id: 0, value: 16, label: 'Full Time', color: '#A3D79F' },
    { id: 1, value: 8, label: 'Part Time', color: '#F4BFBF' },
    { id: 2, value: 4, label: 'Intern', color: '#FBE8A6' },
    { id: 3, value: 2, label: 'Contract', color: '#C3DDFD' },
    { id: 4, value: 2, label: 'Suspended', color: '#E2D4F5' },
  ];

  return (
    <Card className="w-full max-w-md rounded-2xl shadow-md bg-white p-4">
      <CardContent>

        <PieChart
          series={[
            {
              data: employeeData,
              innerRadius: 60,  // creates the "doughnut" hole
              outerRadius: 90,  // size of the whole chart
              cornerRadius: 4,  // optional: softens the slice edges
            },
          ]}
          width={300}
          height={300}
          sx={{
            '& .MuiPieArc-root': {
              stroke: '#fff',
              strokeWidth: 2,
            },
          }}
        />

        <Typography className="text-center mt-[-160px] text-xl font-bold text-gray-700">
          32
        </Typography>
        <Typography className="text-center text-sm text-gray-500">
          employees
        </Typography>
      </CardContent>
    </Card>
  );
};

export default DoughnutChartCard;
