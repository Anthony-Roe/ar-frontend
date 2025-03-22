'use client';

import { useState, useEffect } from 'react';
import { Container, Title, Button, Group, Alert } from '@mantine/core';
import { useRouter } from 'next/navigation';
import Login from '../../components/Login/Login';

export default function LoginPage() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Check login status on component mount
  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (!res.ok) {
        throw new Error('Logout failed');
      }

      // Clear session storage and state
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
      setIsLoggedIn(false);
      router.push('/login');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during logout');
    }
  };

  return (
    <Container size="xs" py="xl">
      <Title align="center" mb="lg">
        {isLoggedIn ? 'Welcome Back!' : 'Login or Create an Account'}
      </Title>

      {error && (
        <Alert color="red" mb="md">
          {error}
        </Alert>
      )}

      {isLoggedIn ? (
        // Show Logout Button if Logged In
        <Group justify="center">
          <Button
            variant="outline"
            color="red"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Group>
      ) : (
        // Show Login Component if Logged Out
        <Login />
      )}
    </Container>
  );
}