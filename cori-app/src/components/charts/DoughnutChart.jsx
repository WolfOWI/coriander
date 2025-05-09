import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';

const doughnutData = [
  { id: 0, value: 12, label: '', color: '#88A764' }, // Full Time
  { id: 1, value: 5, label: '', color: '#FF8904' },  // Part Time
  { id: 2, value: 3, label: '', color: '#FFDF20' },  // Intern
  { id: 3, value: 3, label: '', color: '#0092B8' },  // Contract
  { id: 4, value: 1, label: '', color: '#FF6467' },  // Suspended
];

const doughnutLabels = ['Full Time', 'Part Time', 'Intern', 'Contract', 'Suspended'];

const DoughnutChartCard = () => {
  return (
    <div>
      <PieChart
        series={[
          {
            data: doughnutData,
            innerRadius: 45,
            outerRadius: 70,
            cornerRadius: 4,
            paddingAngle: 1,
            arcLabel: () => '', // removes text on arcs
          },
        ]}
        width={220}
        height={160}
        sx={{
          '& .MuiPieArc-root': {
            stroke: '#fff',
            strokeWidth: 2,
          },
        }}
        // 👇 This removes the side dots/labels completely
        slotProps={{
          legend: { hidden: true },
        }}
      />
      <div className='flex flex-col items-center justify-center' style={{ marginTop: '-110px', marginBottom: '65px' }}>
        <h1 className='text-3xl'>32</h1>
        <p className='text-sm'>Employees</p>
      </div>

      {/* Custom Legend Row */}
      <div className="flex flex-wrap justify-center gap-2 mt-2 text-sm">
        {doughnutLabels.map((label, index) => (
          <div key={index} className="flex items-center gap-1">
            <span
              className="inline-block w-3 h-3 rounded-full"
              style={{ backgroundColor: doughnutData[index].color }}
            />
            <span className="text-gray-700">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoughnutChartCard;
