import { Card, Title } from '@mantine/core';
import { Pie } from 'react-chartjs-2';

export default function WorkOrderChart({ chartData }: { chartData: any }) {
  return (
    <Card shadow="sm" padding="sm" radius="md" withBorder>
      <Title order={5} align="center" mb="sm">
        Work Orders Breakdown
      </Title>
      <Pie data={chartData} />
    </Card>
  );
}
