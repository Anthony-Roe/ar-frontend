'use client';

import { Card, Title, Text, Button, Group, Badge } from '@mantine/core';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function AuditsAdminCard() {
  const router = useRouter();
  const [pendingAudits, setPendingAudits] = useState(0);

  useEffect(() => {
    fetch('http://localhost:5000/api/audits', { credentials: 'include' }) // Placeholder endpoint
      .then(res => res.json())
      .then(data => setPendingAudits(data.filter((audit: { status: string }) => audit.status === 'pending').length))
      .catch(() => setPendingAudits(0));
  }, []);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Group justify="space-between" mb="xs">
        <Title order={3}>Audits</Title>
        <Badge color="orange" variant="light">{pendingAudits} Pending</Badge>
      </Group>
      <Text size="sm" c="gray" mb="md">
        Initiate and review audits.
      </Text>
      <Group justify="flex-end">
        <Button variant="outline" color="deep-blue" radius="md" onClick={() => router.push('/admin/audits/new')}>
          Start Audit
        </Button>
        <Button variant="light" color="deep-blue" radius="md" onClick={() => router.push('/admin/audits')}>
          Manage
        </Button>
      </Group>
    </Card>
  );
}