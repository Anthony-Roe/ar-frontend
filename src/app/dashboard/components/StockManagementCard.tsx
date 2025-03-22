'use client';

import { Card, Title, Text, Button, Group } from '@mantine/core';
import { useRouter } from 'next/navigation';

export default function StockManagementCard() {
  const router = useRouter();

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Title order={3} mb="xs">Stock Management</Title>
      <Text size="sm" c="gray">
        Track and manage inventory levels, reorder parts, and monitor stock usage efficiently.
      </Text>
      <Group justify="flex-end" mt="md">
        <Button
          variant="light"
          color="deep-blue"
          radius="md"
          onClick={() => router.push('/stock')} // Adjust route as needed
        >
          Manage Stock
        </Button>
      </Group>
    </Card>
  );
}