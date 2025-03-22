'use client';

import { Card, Title, Text, Button, Group } from '@mantine/core';
import { useRouter } from 'next/navigation';

export default function PerformanceReportsCard() {
  const router = useRouter();

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Title order={3} mb="xs">Performance Reports</Title>
      <Text size="sm" c="gray">
        Analyze machine and workforce performance with detailed reports and insights.
      </Text>
      <Group justify="flex-end" mt="md">
        <Button
          variant="light"
          color="deep-blue"
          radius="md"
          onClick={() => router.push('/reports')} // Adjust route as needed
        >
          View Reports
        </Button>
      </Group>
    </Card>
  );
}