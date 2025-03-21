'use client';

import { Card, Title, Table, Button, Modal, TextInput, Select, Group } from '@mantine/core';
import { useState, useEffect } from 'react';

export default function UsersRolesCard() {
  const [users, setUsers] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    role: 'technician',
    plant_id: '',
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/users', {
          method: 'GET',
          credentials: 'include',
        });

        if (!res.ok) {
          throw new Error('Failed to fetch users');
        }

        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error('Error fetching users:', err);
      }
    };

    fetchUsers();
  }, []);

  const handleAddUser = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(newUser),
      });

      if (!res.ok) {
        throw new Error('Failed to add user');
      }

      const addedUser = await res.json();
      setUsers((prev) => [...prev, addedUser]);
      setModalOpen(false);
      setNewUser({ username: '', email: '', role: 'technician', plant_id: '' });
    } catch (err) {
      console.error('Error adding user:', err);
    }
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Title order={5} mb="sm">
        Users & Roles
      </Title>
      <Table highlightOnHover>
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Plant</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.user_id}>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>{user.plant_id}</td>
              <td>
                <Button size="xs" color="red">
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Group position="right" mt="md">
        <Button onClick={() => setModalOpen(true)}>Add User</Button>
      </Group>

      <Modal opened={modalOpen} onClose={() => setModalOpen(false)} title="Add User" centered>
        <TextInput
          label="Username"
          placeholder="Enter username"
          value={newUser.username}
          onChange={(e) => setNewUser({ ...newUser, username: e.currentTarget.value })}
          required
        />
        <TextInput
          label="Email"
          placeholder="Enter email"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.currentTarget.value })}
          required
          mt="md"
        />
        <Select
          label="Role"
          placeholder="Select role"
          data={[
            { value: 'admin', label: 'Admin' },
            { value: 'technician', label: 'Technician' },
            { value: 'manager', label: 'Manager' },
          ]}
          value={newUser.role}
          onChange={(value) => setNewUser({ ...newUser, role: value || 'technician' })}
          required
          mt="md"
        />
        <TextInput
          label="Plant ID"
          placeholder="Enter plant ID"
          value={newUser.plant_id}
          onChange={(e) => setNewUser({ ...newUser, plant_id: e.currentTarget.value })}
          required
          mt="md"
        />
        <Group position="right" mt="md">
          <Button onClick={handleAddUser}>Add</Button>
        </Group>
      </Modal>
    </Card>
  );
}