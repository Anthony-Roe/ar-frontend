'use client';

import { useEffect, useState } from 'react';
import { Button, Container, Title, Group, Alert } from '@mantine/core';
import { useRouter } from 'next/navigation';
import Login from '../../components/Login/Login';

export default function LoginPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check if the user is logged in by verifying the token in sessionStorage
    const token = sessionStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('token'); // Clear the token
    setIsLoggedIn(false); // Update the state
    setError(null); // Clear any error messages
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
        <Group position="center">
          <Button
            variant="outline"
            color="red"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Group>
      ) : (
        // Show Login and Create Account Buttons if Logged Out
        <>
          <Login />
          <Group position="center" mt="md">
            <Button
              variant="outline"
              onClick={() => router.push('/create-account')}
            >
              Create Account
            </Button>
          </Group>
        </>
      )}
    </Container>
  );
}