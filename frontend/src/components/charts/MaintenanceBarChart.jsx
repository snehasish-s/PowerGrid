import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const MaintenanceBarChart = () => {
  const chartData = {
    labels: ['Preventive', 'Corrective', 'Emergency', 'Predictive'],
    datasets: [
      {
        label: 'Work Orders',
        data: [25, 14, 4, 8],
        backgroundColor: [
          '#8FE7C9', // soft mint
          '#FBBF24', // yellow
          '#FF6B6B', // error/red
          '#03FFAB', // electric green (predictive!)
        ],
        borderColor: '#374151',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#B8B2A6',
          font: {
            family: 'Outfit',
          },
        },
      },
      y: {
        grid: {
          color: '#374151',
          drawTicks: false,
        },
        ticks: {
          color: '#B8B2A6',
          font: {
            family: 'Outfit',
          },
          stepSize: 5,
        },
      },
    },
  };

  return (
    <div className="w-full h-64">
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default MaintenanceBarChart;
