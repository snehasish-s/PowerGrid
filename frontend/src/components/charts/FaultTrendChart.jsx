import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const FaultTrendChart = () => {
  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Reported Faults',
        data: [12, 19, 8, 15, 22, 10],
        borderColor: '#03FFAB',
        backgroundColor: 'rgba(3, 255, 171, 0.1)',
        borderWidth: 2,
        tension: 0.3,
        fill: true,
      },
      {
        label: 'Resolved Faults',
        data: [10, 15, 9, 12, 18, 9],
        borderColor: '#8FE7C9',
        backgroundColor: 'rgba(143, 231, 201, 0.05)',
        borderWidth: 2,
        tension: 0.3,
        fill: true,
      }
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#F8F5EC',
          font: {
            family: 'Outfit',
            size: 11,
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: '#374151',
          drawTicks: false,
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
        },
      },
    },
  };

  return (
    <div className="w-full h-64">
      <Line data={chartData} options={options} />
    </div>
  );
};

export default FaultTrendChart;
