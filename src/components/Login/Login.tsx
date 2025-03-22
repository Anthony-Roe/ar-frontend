'use client';

import { useState } from 'react';
import { TextInput, PasswordInput, Button, Container, Title, Alert } from '@mantine/core';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async () => {
    setError(null); // Reset error state
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Invalid credentials');
      }

      const data = await res.json();
      sessionStorage.setItem('token', data.token); // Store the token in session storage
      router.push('/'); // Redirect to the home page
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unknown error occurred');
      }
    }
  };

  return (
    <Container size="xs">
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
        aria-label="Email"
      />
      <PasswordInput
        label="Password"
        placeholder="Enter your password"
        value={password}
        onChange={(e) => setPassword(e.currentTarget.value)}
        required
        mt="md"
        aria-label="Password"
      />
      <Button fullWidth mt="xl" onClick={handleLogin}>
        Login
      </Button>
    </Container>
  );
}
