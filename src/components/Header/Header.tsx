'use client';

import { Group, Button, Container } from '@mantine/core';
import { useRouter } from 'next/navigation';

export default function Header() {
  const router = useRouter();

  return (
    <Container size="lg" py="md">
      <Group position="right">
        <Button variant="outline" onClick={() => router.push('/login')}>
          Login
        </Button>
        <Button onClick={() => router.push('/create-account')}>Create Account</Button>
      </Group>
    </Container>
  );
}
