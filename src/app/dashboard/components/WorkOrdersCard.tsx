'use client';

import { Card, Title, List, Badge, Button } from '@mantine/core';
import { Pie } from 'react-chartjs-2';

export default function WorkOrdersCard() {
  const workOrders = [
    // Example data; replace with API call
    { title: 'Fix Conveyor', priority: 'High', due_date: '2023-10-15', assigned_to: 'John Doe' },
    { title: 'Replace Motor', priority: 'Medium', due_date: '2023-10-20', assigned_to: 'Jane Smith' },
  ];

  const chartData = {
    labels: ['Pending', 'In Progress', 'Completed', 'Cancelled'],
    datasets: [
      {
        data: [10, 5, 20, 2],
        backgroundColor: ['#36A2EB', '#FFCE56', '#4BC0C0', '#FF6384'],
      },
    ],
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Title order={5} mb="sm">
        Work Orders
      </Title>
      <Pie data={chartData} />
      <List mt="md">
        {workOrders.map((order, index) => (
          <List.Item key={index}>
            {order.title} - <Badge color="red">{order.priority}</Badge>
          </List.Item>
        ))}
      </List>
      <Button fullWidth mt="md" variant="outline">
        View Open
      </Button>
    </Card>
  );
}
