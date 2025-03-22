'use client';

import { Card, Title, Table, Button, Modal, TextInput, Group, Notification, ActionIcon, Tooltip } from '@mantine/core';
import { useState, useEffect } from 'react';
import { IconSearch, IconDownload, IconEdit, IconTrash } from '@tabler/icons-react';

interface Plant {
  plant_id: string;
  name: string;
  location: string;
  contact_email: string;
  contact_phone: string;
}

interface PlantsAdminCardProps {
  globalSearch?: string;
}

export default function PlantsAdminCard({ globalSearch = '' }: PlantsAdminCardProps) {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [newPlant, setNewPlant] = useState({
    name: '',
    location: '',
    contact_email: '',
    contact_phone: '',
  });
  const [editPlant, setEditPlant] = useState<Plant | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlants = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/plants', {
          method: 'GET',
          credentials: 'include',
        });
        if (!res.ok) {
          throw new Error('Failed to fetch plants');
        }
        const data = await res.json();
        setPlants(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error fetching plants:', err);
        setError('Failed to fetch plants');
        setPlants([]);
      }
    };
    fetchPlants();
  }, []);

  const handleAddPlant = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/plants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(newPlant),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to add plant');
      }
      const addedPlant = await res.json();
      setPlants(prev => [...prev, addedPlant as Plant]);
      setModalOpen(false);
      setNewPlant({ name: '', location: '', contact_email: '', contact_phone: '' });
      setSuccess('Plant added successfully!');
    } catch (err: unknown) {
      setError((err as Error).message);
    }
  };

  const handleEditPlant = async () => {
    if (!editPlant) return;
    try {
      const res = await fetch(`http://localhost:5000/api/plants/${editPlant.plant_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(editPlant),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to update plant');
      }
      const updatedPlant = await res.json();
      setPlants(prev => prev.map(p => (p.plant_id === updatedPlant.plant_id ? updatedPlant as Plant : p)));
      setEditModalOpen(false);
      setSuccess('Plant updated successfully!');
    } catch (err: unknown) {
      setError((err as Error).message);
    }
  };

  const handleDeletePlant = async (id: string) => {
    if (!confirm('Are you sure you want to delete this plant?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/plants/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to delete plant');
      }
      setPlants(prev => prev.filter(p => p.plant_id !== id));
      setSuccess('Plant deleted successfully!');
    } catch (err: unknown) {
      setError((err as Error).message);
    }
  };

  const filteredPlants = plants.filter(p => {
    const matchesLocalSearch = search
      ? p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.location.toLowerCase().includes(search.toLowerCase())
      : true;

    const matchesGlobalSearch = globalSearch
      ? p.name.toLowerCase().includes(globalSearch.toLowerCase()) ||
        p.location.toLowerCase().includes(globalSearch.toLowerCase()) ||
        p.contact_email.toLowerCase().includes(globalSearch.toLowerCase())
      : true;

    return matchesLocalSearch && matchesGlobalSearch;
  });

  const exportToCSV = () => {
    const csv = [
      'Name,Location,Contact Email,Contact Phone',
      ...filteredPlants.map(p => `${p.name},${p.location},${p.contact_email},${p.contact_phone}`),
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'plants.csv';
    a.click();
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Group justify="space-between" mb="sm">
        <Title order={5}>Plants</Title>
        <Group>
          <TextInput
            placeholder="Search plants..."
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
            <th>Name</th>
            <th>Location</th>
            <th>Contact Email</th>
            <th>Contact Phone</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredPlants.map(p => (
            <tr key={p.plant_id}>
              <td>{p.name}</td>
              <td>{p.location}</td>
              <td>{p.contact_email}</td>
              <td>{p.contact_phone}</td>
              <td>
                <Group gap="xs">
                  <Tooltip label="Edit">
                    <ActionIcon onClick={() => { setEditPlant(p); setEditModalOpen(true); }}>
                      <IconEdit size={16} />
                    </ActionIcon>
                  </Tooltip>
                  <Tooltip label="Delete">
                    <ActionIcon color="red" onClick={() => handleDeletePlant(p.plant_id)}>
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
        <Button onClick={() => setModalOpen(true)}>Add Plant</Button>
      </Group>

      {/* Add Modal */}
      <Modal opened={modalOpen} onClose={() => setModalOpen(false)} title="Add Plant" centered>
        <TextInput
          label="Name"
          placeholder="Enter plant name"
          value={newPlant.name}
          onChange={e => setNewPlant({ ...newPlant, name: e.currentTarget.value })}
          required
        />
        <TextInput
          label="Location"
          placeholder="Enter location"
          value={newPlant.location}
          onChange={e => setNewPlant({ ...newPlant, location: e.currentTarget.value })}
          required
          mt="md"
        />
        <TextInput
          label="Contact Email"
          placeholder="Enter contact email"
          value={newPlant.contact_email}
          onChange={e => setNewPlant({ ...newPlant, contact_email: e.currentTarget.value })}
          required
          mt="md"
        />
        <TextInput
          label="Contact Phone"
          placeholder="Enter contact phone"
          value={newPlant.contact_phone}
          onChange={e => setNewPlant({ ...newPlant, contact_phone: e.currentTarget.value })}
          required
          mt="md"
        />
        <Group justify="flex-end" mt="md">
          <Button onClick={handleAddPlant}>Add</Button>
        </Group>
      </Modal>

      {/* Edit Modal */}
      {editPlant && (
        <Modal opened={editModalOpen} onClose={() => setEditModalOpen(false)} title="Edit Plant" centered>
          <TextInput
            label="Name"
            placeholder="Enter plant name"
            value={editPlant.name}
            onChange={e => setEditPlant({ ...editPlant, name: e.currentTarget.value })}
            required
          />
          <TextInput
            label="Location"
            placeholder="Enter location"
            value={editPlant.location}
            onChange={e => setEditPlant({ ...editPlant, location: e.currentTarget.value })}
            required
            mt="md"
          />
          <TextInput
            label="Contact Email"
            placeholder="Enter contact email"
            value={editPlant.contact_email}
            onChange={e => setEditPlant({ ...editPlant, contact_email: e.currentTarget.value })}
            required
            mt="md"
          />
          <TextInput
            label="Contact Phone"
            placeholder="Enter contact phone"
            value={editPlant.contact_phone}
            onChange={e => setEditPlant({ ...editPlant, contact_phone: e.currentTarget.value })}
            required
            mt="md"
          />
          <Group justify="flex-end" mt="md">
            <Button onClick={handleEditPlant}>Save</Button>
          </Group>
        </Modal>
      )}
    </Card>
  );
}