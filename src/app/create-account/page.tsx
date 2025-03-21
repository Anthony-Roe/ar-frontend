'use client';

import { useState } from 'react';
import { TextInput, PasswordInput, Button, Container, Title, Alert, Select } from '@mantine/core';
import { useRouter } from 'next/navigation';

export default function CreateAccountPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  const handleCreateAccount = async () => {
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password, role }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to create account');
      }

      setSuccess('Account created successfully! Redirecting to login...');
      setTimeout(() => {
        router.push('/login'); // Redirect to login page after success
      }, 2000);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unknown error occurred');
      }
    }
  };

  return (
    <Container size="xs" py="xl">
      <Title align="center" mb="lg">
        Create Account
      </Title>
      {error && (
        <Alert color="red" mb="md">
          {error}
        </Alert>
      )}
      {success && (
        <Alert color="green" mb="md">
          {success}
        </Alert>
      )}
      <TextInput
        label="Username"
        placeholder="Enter your username"
        value={username}
        onChange={(e) => setUsername(e.currentTarget.value)}
        required
        aria-label="Username"
      />
      <TextInput
        label="Email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.currentTarget.value)}
        required
        mt="md"
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
      <Select
        label="Role"
        placeholder="Select a role"
        data={[
          { value: 'admin', label: 'Admin' },
          { value: 'technician', label: 'Technician' },
          { value: 'manager', label: 'Manager' },
        ]}
        value={role}
        onChange={setRole}
        required
        mt="md"
      />
      <Button fullWidth mt="xl" onClick={handleCreateAccount}>
        Create Account
      </Button>
    </Container>
  );
}