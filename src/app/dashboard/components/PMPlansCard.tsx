'use client';

import { Card, Title, Text, Button, Group } from '@mantine/core';
import { useRouter } from 'next/navigation';

export default function PMPlansCard() {
  const router = useRouter();

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Title order={3} mb="xs">Preventive Maintenance Plans</Title>
      <Text size="sm" c="gray">
        Manage and schedule preventive maintenance plans for your machines to ensure optimal performance.
      </Text>
      <Group justify="flex-end" mt="md">
        <Button
          variant="light"
          color="deep-blue"
          radius="md"
          onClick={() => router.push('/pm-plans')} // Adjust route as needed
        >
          View Plans
        </Button>
      </Group>
    </Card>
  );
}