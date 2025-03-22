'use client';

import { Card, Title, Text, Button, Group, Badge } from '@mantine/core';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function PerformanceReportsAdminCard() {
  const router = useRouter();
  const [reportCount, setReportCount] = useState(0);

  useEffect(() => {
    fetch('http://localhost:5000/api/reports', { credentials: 'include' }) // Placeholder endpoint
      .then(res => res.json())
      .then(data => setReportCount(data.length))
      .catch(() => setReportCount(0));
  }, []);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Group justify="space-between" mb="xs">
        <Title order={3}>Performance Reports</Title>
        <Badge color="deep-blue" variant="light">{reportCount} Reports</Badge>
      </Group>
      <Text size="sm" c="gray" mb="md">
        Generate and export performance reports.
      </Text>
      <Group justify="flex-end">
        <Button variant="outline" color="deep-blue" radius="md" onClick={() => router.push('/admin/reports/new')}>
          Generate
        </Button>
        <Button variant="light" color="deep-blue" radius="md" onClick={() => router.push('/admin/reports')}>
          View
        </Button>
      </Group>
    </Card>
  );
}