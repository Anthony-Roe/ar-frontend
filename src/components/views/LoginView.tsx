'use client';

import { useState } from 'react';
import { TextInput, PasswordInput, Button, Group, Alert, Title } from '@mantine/core';

export default function LoginView({ setCurrentView }: { setCurrentView: (view: 'home' | 'login' | 'createAccount' | 'managePlants') => void; setLoading: (loading: boolean) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include', // Include cookies in the request
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Invalid credentials');
      }
      setCurrentView('home'); // Redirect to home view
    } catch (err) {
      console.error('Login failed:', err);
      setError('Login failed. Please check your credentials.');
    }
  };

  return (
    <>
      <Title align="center" mb="lg">
        Login
      </Title>
      {error && (
        <Alert color="red" mb="md">
          {error}
        </Alert>
      )}
      <TextInput
        label="Email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.currentTarget.value)}
        required
      />
      <PasswordInput
        label="Password"
        placeholder="Enter your password"
        value={password}
        onChange={(e) => setPassword(e.currentTarget.value)}
        required
        mt="md"
      />
      <Group position="center" mt="md">
        <Button onClick={handleLogin}>Login</Button>
        <Button variant="outline" onClick={() => setCurrentView('home')}>
          Cancel
        </Button>
      </Group>
    </>
  );
}