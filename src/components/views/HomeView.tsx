'use client';

import { Title, Text, Button, Group, Card, SimpleGrid, Container } from '@mantine/core';
import { useEffect, useState } from 'react';

export default function HomeView({ setCurrentView }: { setCurrentView: (view: 'home' | 'login' | 'createAccount' | 'managePlants' | 'workOrders') => void }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/auth/me', {
          method: 'GET',
          credentials: 'include',
        });

        if (res.ok) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch (err) {
        console.error('Failed to check authentication:', err);
        setIsLoggedIn(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:5000/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      setIsLoggedIn(false);
    } catch (err) {
      console.error('Failed to logout:', err);
    }
  };

  return (
    <Container
      size="xs"
      style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
      }}
    >
      {isLoggedIn && (
        <Button
          variant="outline"
          color="red"
          size="xs"
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
          }}
          onClick={handleLogout}
        >
          Logout
        </Button>
      )}
      <Title align="center" mb="lg">
        Welcome to the AR Frontend!
      </Title>
      <Text align="center" color="dimmed" size="lg" mb="xl">
        Manage your plants, inventory, and work orders efficiently.
      </Text>
      <Group position="center" mt="md">
        {isLoggedIn ? (
          <>
            <SimpleGrid cols={1} spacing="lg" style={{ maxWidth: '400px' }}>
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Title order={4} mb="sm">
                  Manage Plants
                </Title>
                <Text size="sm" color="dimmed" mb="md">
                  View and manage all plants in the system.
                </Text>
                <Button fullWidth onClick={() => setCurrentView('managePlants')}>
                  Go to Manage Plants
                </Button>
              </Card>
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Title order={4} mb="sm">
                  Manage Work Orders
                </Title>
                <Text size="sm" color="dimmed" mb="md">
                  View and manage all work orders in the system.
                </Text>
                <Button fullWidth onClick={() => setCurrentView('workOrders')}>
                  Go to Work Orders
                </Button>
              </Card>
            </SimpleGrid>
          </>
        ) : (
          <Group position="center" spacing="md">
            <Button onClick={() => setCurrentView('login')}>Login</Button>
            <Button onClick={() => setCurrentView('createAccount')}>Create Account</Button>
          </Group>
        )}
      </Group>
    </Container>
  );
}
