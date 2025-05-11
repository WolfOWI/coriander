import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';

type StatusTotals = {
  totalEmployees: number;
  totalFullTimeEmployees: number;
  totalPartTimeEmployees: number;
  totalContractEmployees: number;
  totalInternEmployees: number;
  totalSuspendedEmployees: number;
};

type DoughnutChartCardProps = {
  data: StatusTotals;
};

const DoughnutChartCard: React.FC<DoughnutChartCardProps> = ({ data }) => {
  const doughnutData = [
    { id: 0, value: data.totalFullTimeEmployees, label: 'Full Time', color: '#88A764' },
    { id: 1, value: data.totalPartTimeEmployees, label: 'Part Time', color: '#FF8904' },
    { id: 2, value: data.totalInternEmployees, label: 'Intern', color: '#FFDF20' },
    { id: 3, value: data.totalContractEmployees, label: 'Contract', color: '#0092B8' },
    { id: 4, value: data.totalSuspendedEmployees, label: 'Suspended', color: '#FF6467' },
  ];

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
            arcLabel: () => '',
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
      />
      <div className='flex flex-col items-center justify-center' style={{ marginTop: '-110px', marginBottom: '65px' }}>
        <h1 className='text-3xl'>{data.totalEmployees}</h1>
        <p className='text-sm'>Employees</p>
      </div>

      <div className="flex flex-wrap justify-center gap-2 mt-2 text-sm">
        {doughnutData.map((item, index) => (
          <div key={index} className="flex items-center gap-1">
            <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="text-gray-700">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoughnutChartCard;
