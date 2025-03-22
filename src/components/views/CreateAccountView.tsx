'use client';

import { useState } from 'react';
import { TextInput, PasswordInput, Button, Group, Alert, Title, Select } from '@mantine/core';

export default function CreateAccountView({ setCurrentView, setLoading }: { setCurrentView: (view: 'home' | 'login' | 'createAccount' | 'managePlants') => void; setLoading: (loading: boolean) => void }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCreateAccount = async () => {
    setError(null);
    setLoading(true);
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

      setCurrentView('login');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Title align="center" mb="lg">
        Create Account
      </Title>
      {error && (
        <Alert color="red" mb="md">
          {error}
        </Alert>
      )}
      <TextInput
        label="Username"
        placeholder="Enter your username"
        value={username}
        onChange={(e) => setUsername(e.currentTarget.value)}
        required
      />
      <TextInput
        label="Email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.currentTarget.value)}
        required
        mt="md"
      />
      <PasswordInput
        label="Password"
        placeholder="Enter your password"
        value={password}
        onChange={(e) => setPassword(e.currentTarget.value)}
        required
        mt="md"
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
      <Group position="center" mt="md">
        <Button onClick={handleCreateAccount}>Create Account</Button>
        <Button variant="outline" onClick={() => setCurrentView('home')}>
          Cancel
        </Button>
      </Group>
    </>
  );
}
