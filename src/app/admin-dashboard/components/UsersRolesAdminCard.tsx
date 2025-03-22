'use client';

import { Card, Title, Table, Button, Modal, TextInput, Select, Group, Notification, ActionIcon, Tooltip } from '@mantine/core';
import { useState, useEffect } from 'react';
import { IconSearch, IconDownload, IconEdit, IconTrash } from '@tabler/icons-react';

interface User {
  user_id: string;
  username: string;
  email: string;
  role: string;
  plant_id: string | null;
  plant?: { plant_id: string; name: string };
}

interface Plant {
  plant_id: string;
  name: string;
}

interface UsersRolesAdminCardProps {
  globalSearch?: string;
}

export default function UsersRolesAdminCard({ globalSearch = '' }: UsersRolesAdminCardProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [plants, setPlants] = useState<Plant[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    password: '',
    role: 'technician',
    plant_id: null as string | null,
  });
  const [editUser, setEditUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch('http://localhost:5000/api/users', { credentials: 'include' }).then(res => res.json()),
      fetch('http://localhost:5000/api/plants', { credentials: 'include' }).then(res => res.json()),
    ])
      .then(([usersData, plantsData]) => {
        setUsers(usersData as User[]);
        setPlants(plantsData as Plant[]);
      })
      .catch((err: Error) => setError('Failed to load data: ' + err.message));
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
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to add user');
      }
      const addedUser = await res.json();
      setUsers(prev => [...prev, addedUser as User]);
      setModalOpen(false);
      setNewUser({ username: '', email: '', password: '', role: 'technician', plant_id: null });
      setSuccess('User added successfully!');
    } catch (err: unknown) {
      setError((err as Error).message);
    }
  };

  const handleEditUser = async () => {
    if (!editUser) return;
    try {
      const res = await fetch(`http://localhost:5000/api/users/${editUser.user_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          username: editUser.username,
          email: editUser.email,
          role: editUser.role,
          plant_id: editUser.plant_id,
        }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to update user');
      }
      const updatedUser = await res.json();
      setUsers(prev => prev.map(u => (u.user_id === updatedUser.user_id ? updatedUser as User : u)));
      setEditModalOpen(false);
      setSuccess('User updated successfully!');
    } catch (err: unknown) {
      setError((err as Error).message);
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/users/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to delete user');
      }
      setUsers(prev => prev.filter(u => u.user_id !== id));
      setSuccess('User deleted successfully!');
    } catch (err: unknown) {
      setError((err as Error).message);
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesLocalSearch = search
      ? u.username.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
      : true;

    const matchesGlobalSearch = globalSearch
      ? u.username.toLowerCase().includes(globalSearch.toLowerCase()) ||
        u.email.toLowerCase().includes(globalSearch.toLowerCase()) ||
        u.role.toLowerCase().includes(globalSearch.toLowerCase()) ||
        (u.plant?.name || '').toLowerCase().includes(globalSearch.toLowerCase())
      : true;

    return matchesLocalSearch && matchesGlobalSearch;
  });

  const exportToCSV = () => {
    const csv = [
      'Username,Email,Role,Plant',
      ...filteredUsers.map(u => `${u.username},${u.email},${u.role},${u.plant?.name || 'N/A'}`),
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'users.csv';
    a.click();
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Group justify="space-between" mb="sm">
        <Title order={5}>Users & Roles</Title>
        <Group>
          <TextInput
            placeholder="Search users..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            rightSection={<IconSearch size={16} />}
          />
          <Tooltip label="Export to CSV">
            <ActionIcon onClick={exportToCSV}><IconDownload /></ActionIcon>
          </Tooltip>
        </Group>
      </Group>
      {error && <Notification color="red" onClose={() => setError(null)}>{error}</Notification>}
      {success && <Notification color="green" onClose={() => setSuccess(null)}>{success}</Notification>}
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
          {filteredUsers.map(u => (
            <tr key={u.user_id}>
              <td>{u.username}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>{u.plant?.name || 'N/A'}</td>
              <td>
                <Group gap="xs">
                  <Tooltip label="Edit">
                    <ActionIcon onClick={() => { setEditUser(u); setEditModalOpen(true); }}>
                      <IconEdit size={16} />
                    </ActionIcon>
                  </Tooltip>
                  <Tooltip label="Delete">
                    <ActionIcon color="red" onClick={() => handleDeleteUser(u.user_id)}>
                      <IconTrash size={16} />
                    </ActionIcon>
                  </Tooltip>
                </Group>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Group justify="flex-end" mt="md">
        <Button onClick={() => setModalOpen(true)}>Add User</Button>
      </Group>

      {/* Add Modal */}
      <Modal opened={modalOpen} onClose={() => setModalOpen(false)} title="Add User" centered>
        <TextInput
          label="Username"
          placeholder="Enter username"
          value={newUser.username}
          onChange={e => setNewUser({ ...newUser, username: e.currentTarget.value })}
          required
        />
        <TextInput
          label="Email"
          placeholder="Enter email"
          value={newUser.email}
          onChange={e => setNewUser({ ...newUser, email: e.currentTarget.value })}
          required
          mt="md"
        />
        <TextInput
          label="Password"
          type="password"
          placeholder="Enter password"
          value={newUser.password}
          onChange={e => setNewUser({ ...newUser, password: e.currentTarget.value })}
          required
          mt="md"
        />
        <Select
          label="Role"
          placeholder="Select role"
          data={[
            { value: 'admin', label: 'Admin' },
            { value: 'manager', label: 'Manager' },
            { value: 'technician', label: 'Technician' },
          ]}
          value={newUser.role}
          onChange={value => setNewUser({ ...newUser, role: value as string })}
          required
          mt="md"
        />
        <Select
          label="Plant"
          placeholder="Select plant"
          data={plants.map(p => ({ value: p.plant_id, label: p.name }))}
          value={newUser.plant_id}
          onChange={value => setNewUser({ ...newUser, plant_id: value as string })}
          clearable
          mt="md"
        />
        <Group justify="flex-end" mt="md">
          <Button onClick={handleAddUser}>Add</Button>
        </Group>
      </Modal>

      {/* Edit Modal */}
      {editUser && (
        <Modal opened={editModalOpen} onClose={() => setEditModalOpen(false)} title="Edit User" centered>
          <TextInput
            label="Username"
            placeholder="Enter username"
            value={editUser.username}
            onChange={e => setEditUser({ ...editUser, username: e.currentTarget.value })}
            required
          />
          <TextInput
            label="Email"
            placeholder="Enter email"
            value={editUser.email}
            onChange={e => setEditUser({ ...editUser, email: e.currentTarget.value })}
            required
            mt="md"
          />
          <Select
            label="Role"
            placeholder="Select role"
            data={[
              { value: 'admin', label: 'Admin' },
              { value: 'manager', label: 'Manager' },
              { value: 'technician', label: 'Technician' },
            ]}
            value={editUser.role}
            onChange={value => setEditUser({ ...editUser, role: value as string })}
            required
            mt="md"
          />
          <Select
            label="Plant"
            placeholder="Select plant"
            data={plants.map(p => ({ value: p.plant_id, label: p.name }))}
            value={editUser.plant_id}
            onChange={value => setEditUser({ ...editUser, plant_id: value as string })}
            clearable
            mt="md"
          />
          <Group justify="flex-end" mt="md">
            <Button onClick={handleEditUser}>Save</Button>
          </Group>
        </Modal>
      )}
    </Card>
  );
}