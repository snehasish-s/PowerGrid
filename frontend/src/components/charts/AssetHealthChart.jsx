import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const AssetHealthChart = ({ data = {} }) => {
  const chartData = {
    labels: ['Operational', 'Degraded', 'Faulty', 'Decommissioned'],
    datasets: [
      {
        data: [
          data.OPERATIONAL || 0,
          data.DEGRADED || 0,
          data.FAULTY || 0,
          data.DECOMMISSIONED || 0,
        ],
        backgroundColor: [
          '#03FFAB', // primary (electric green)
          '#FBBF24', // yellow (degraded)
          '#FF6B6B', // error (faulty)
          '#374151', // border/gray (decommissioned)
        ],
        borderColor: '#121212',
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#F8F5EC',
          font: {
            family: 'Outfit',
            size: 11,
          },
          padding: 15,
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => ` ${context.label}: ${context.raw} assets`,
        },
      },
    },
    cutout: '70%',
  };

  return (
    <div className="w-full h-64 relative flex items-center justify-center">
      <Doughnut data={chartData} options={options} />
      <div className="absolute flex flex-col items-center justify-center">
        <span className="font-syne font-bold text-2xl text-primary text-electric-glow">
          {Object.values(data).reduce((a, b) => a + b, 0)}
        </span>
        <span className="font-outfit text-xs text-text-muted uppercase tracking-widest">
          Total Assets
        </span>
      </div>
    </div>
  );
};

export default AssetHealthChart;
