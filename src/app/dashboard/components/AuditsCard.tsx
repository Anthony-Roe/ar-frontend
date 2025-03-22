'use client';

import { Card, Title, Text, Button, Group } from '@mantine/core';
import { useRouter } from 'next/navigation';

export default function AuditsCard() {
  const router = useRouter();

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Title order={3} mb="xs">Audits</Title>
      <Text size="sm" c="gray">
        Conduct and review audits to ensure compliance and maintain operational standards.
      </Text>
      <Group justify="flex-end" mt="md">
        <Button
          variant="light"
          color="deep-blue"
          radius="md"
          onClick={() => router.push('/audits')} // Adjust route as needed
        >
          View Audits
        </Button>
      </Group>
    </Card>
  );
}