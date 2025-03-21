import { Card, SimpleGrid, Text, Badge } from '@mantine/core';

export default function WorkOrderStats({ workOrders }: { workOrders: any[] }) {
  return (
    <SimpleGrid cols={3} spacing="xs" mb="sm">
      <Card shadow="sm" padding="sm" radius="md" withBorder>
        <Text size="sm" weight={500}>
          Open Work Orders:{' '}
          <Badge color="blue" size="sm">
            {workOrders.filter(
              (order) => order.status === 'pending' || order.status === 'in_progress'
            ).length}
          </Badge>
        </Text>
      </Card>
      <Card shadow="sm" padding="sm" radius="md" withBorder>
        <Text size="sm" weight={500}>
          Urgent Work Orders:{' '}
          <Badge color="red" size="sm">
            {workOrders.filter(
              (order) => order.priority === 'high' || order.priority === 'critical'
            ).length}
          </Badge>
        </Text>
      </Card>
      <Card shadow="sm" padding="sm" radius="md" withBorder>
        <Text size="sm" weight={500}>
          Late Work Orders:{' '}
          <Badge color="orange" size="sm">
            {workOrders.filter((order) => order.due_date && new Date(order.due_date) < new Date())
              .length}
          </Badge>
        </Text>
      </Card>
    </SimpleGrid>
  );
}