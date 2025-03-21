'use client';

import { Card, Title, Button, Group } from '@mantine/core';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title as ChartTitle,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register required components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ChartTitle, Tooltip, Legend);

export default function PerformanceReportsAdminCard() {
  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Uptime (%)',
        data: [95, 96, 97, 94, 98, 99],
        borderColor: '#36A2EB',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Performance Metrics',
      },
    },
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Title order={5} mb="sm">
        Performance Reports
      </Title>
      <Line data={chartData} options={chartOptions} />
      <Group position="right" mt="md">
        <Button>Generate Report</Button>
        <Button variant="outline">Customize</Button>
      </Group>
    </Card>
  );
}