'use client';

import { Card, Title, Table, Button, Modal, TextInput, Select, Group, Notification, Text, ActionIcon, Tooltip } from '@mantine/core';
import { useState, useEffect } from 'react';
import { IconSearch, IconDownload, IconEdit, IconTrash } from '@tabler/icons-react';

// Interfaces (aligned with Machine model and API)
interface Machine {
  machine_id: string;
  plant_id: string | null;
  name: string;
  model: string;
  manufacturer: string;
  serial_number: string;
  installation_date: string | null;
  last_maintenance_date: string | null;
  next_maintenance_date: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  plant?: { plant_id: string; name: string };
}

interface Plant {
  plant_id: string;
  name: string;
}

export default function MachinesAdminCard() {
  const [machines, setMachines] = useState<Machine[]>([]);
  const [plants, setPlants] = useState<Plant[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [newMachine, setNewMachine] = useState<Machine>({
    machine_id: '',
    plant_id: null,
    name: '',
    model: '',
    manufacturer: '',
    serial_number: '',
    installation_date: null,
    last_maintenance_date: null,
    next_maintenance_date: null,
    status: 'active',
    created_at: '',
    updated_at: '',
    deleted_at: null,
  });
  const [editMachine, setEditMachine] = useState<Machine | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Fetch data on mount
  useEffect(() => {
    Promise.all([
      fetch('http://localhost:5000/api/machines', { credentials: 'include' }).then(res => res.json()),
      fetch('http://localhost:5000/api/plants', { credentials: 'include' }).then(res => res.json()),
    ])
      .then(([machinesData, plantsData]) => {
        setMachines(machinesData as Machine[]);
        setPlants(plantsData as Plant[]);
      })
      .catch((err: Error) => setError('Failed to load data: ' + err.message));
  }, []);

  // Add Machine
  const handleAddMachine = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/machines', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(newMachine),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to add machine');
      }
      const addedMachine = await res.json();
      setMachines(prev => [...prev, addedMachine as Machine]);
      setModalOpen(false);
      setNewMachine({
        machine_id: '',
        plant_id: null,
        name: '',
        model: '',
        manufacturer: '',
        serial_number: '',
        installation_date: null,
        last_maintenance_date: null,
        next_maintenance_date: null,
        status: 'active',
        created_at: '',
        updated_at: '',
        deleted_at: null,
      });
      setSuccess('Machine added successfully!');
    } catch (err: unknown) {
      setError((err as Error).message);
    }
  };

  // Edit Machine
  const handleEditMachine = async () => {
    if (!editMachine) return;
    try {
      const res = await fetch(`http://localhost:5000/api/machines/${editMachine.machine_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(editMachine),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to update machine');
      }
      const updatedMachine = await res.json();
      setMachines(prev => prev.map(m => (m.machine_id === updatedMachine.machine_id ? updatedMachine as Machine : m)));
      setEditModalOpen(false);
      setSuccess('Machine updated successfully!');
    } catch (err: unknown) {
      setError((err as Error).message);
    }
  };

  // Delete Machine
  const handleDeleteMachine = async (id: string) => {
    if (!confirm('Are you sure you want to delete this machine?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/machines/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to delete machine');
      }
      setMachines(prev => prev.filter(m => m.machine_id !== id));
      setSuccess('Machine deleted successfully!');
    } catch (err: unknown) {
      setError((err as Error).message);
    }
  };

  // Filter machines by search
  const filteredMachines = machines.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.serial_number.toLowerCase().includes(search.toLowerCase()) ||
    m.model.toLowerCase().includes(search.toLowerCase()) ||
    m.manufacturer.toLowerCase().includes(search.toLowerCase())
  );

  // Export to CSV
  const exportToCSV = () => {
    const csv = [
      'Name,Model,Manufacturer,Serial Number,Status,Plant,Installation Date,Last Maintenance Date,Next Maintenance Date',
      ...filteredMachines.map(m =>
        `${m.name},${m.model},${m.manufacturer},${m.serial_number},${m.status},${m.plant?.name || 'N/A'},${m.installation_date || ''},${m.last_maintenance_date || ''},${m.next_maintenance_date || ''}`
      ),
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'machines.csv';
    a.click();
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Group justify="space-between" mb="sm">
        <Title order={5}>Machines</Title>
        <Group>
          <TextInput
            placeholder="Search machines..."
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
            <th>Model</th>
            <th>Manufacturer</th>
            <th>Serial Number</th>
            <th>Status</th>
            <th>Plant</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredMachines.map(m => (
            <tr key={m.machine_id}>
              <td>{m.name}</td>
              <td>{m.model}</td>
              <td>{m.manufacturer}</td>
              <td>{m.serial_number}</td>
              <td>{m.status}</td>
              <td>{m.plant?.name || 'N/A'}</td>
              <td>
                <Group gap="xs">
                  <Tooltip label="Edit">
                    <ActionIcon onClick={() => { setEditMachine(m); setEditModalOpen(true); }}>
                      <IconEdit size={16} />
                    </ActionIcon>
                  </Tooltip>
                  <Tooltip label="Delete">
                    <ActionIcon color="red" onClick={() => handleDeleteMachine(m.machine_id)}>
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
        <Button onClick={() => setModalOpen(true)}>Add Machine</Button>
      </Group>

      {/* Add Modal */}
      <Modal opened={modalOpen} onClose={() => setModalOpen(false)} title="Add Machine" centered size="lg">
        <TextInput
          label="Name"
          value={newMachine.name}
          onChange={e => setNewMachine({ ...newMachine, name: e.target.value })}
          required
        />
        <TextInput
          label="Model"
          value={newMachine.model}
          onChange={e => setNewMachine({ ...newMachine, model: e.target.value })}
          required
          mt="md"
        />
        <TextInput
          label="Manufacturer"
          value={newMachine.manufacturer}
          onChange={e => setNewMachine({ ...newMachine, manufacturer: e.target.value })}
          required
          mt="md"
        />
        <TextInput
          label="Serial Number"
          value={newMachine.serial_number}
          onChange={e => setNewMachine({ ...newMachine, serial_number: e.target.value })}
          required
          mt="md"
        />
        <Select
          label="Status"
          data={['active', 'inactive', 'maintenance']}
          value={newMachine.status}
          onChange={value => setNewMachine({ ...newMachine, status: value as string })}
          required
          mt="md"
        />
        <Select
          label="Plant"
          data={plants.map(p => ({ value: p.plant_id, label: p.name }))}
          value={newMachine.plant_id}
          onChange={value => setNewMachine({ ...newMachine, plant_id: value as string })}
          clearable
          mt="md"
        />
        <TextInput
          label="Installation Date"
          type="date"
          value={newMachine.installation_date || ''}
          onChange={e => setNewMachine({ ...newMachine, installation_date: e.target.value || null })}
          mt="md"
        />
        <TextInput
          label="Last Maintenance Date"
          type="date"
          value={newMachine.last_maintenance_date || ''}
          onChange={e => setNewMachine({ ...newMachine, last_maintenance_date: e.target.value || null })}
          mt="md"
        />
        <TextInput
          label="Next Maintenance Date"
          type="date"
          value={newMachine.next_maintenance_date || ''}
          onChange={e => setNewMachine({ ...newMachine, next_maintenance_date: e.target.value || null })}
          mt="md"
        />
        <Group justify="flex-end" mt="md">
          <Button onClick={handleAddMachine}>Add</Button>
        </Group>
      </Modal>

      {/* Edit Modal */}
      {editMachine && (
        <Modal opened={editModalOpen} onClose={() => setEditModalOpen(false)} title="Edit Machine" centered size="lg">
          <TextInput
            label="Name"
            value={editMachine.name}
            onChange={e => setEditMachine({ ...editMachine, name: e.target.value })}
            required
          />
          <TextInput
            label="Model"
            value={editMachine.model}
            onChange={e => setEditMachine({ ...editMachine, model: e.target.value })}
            required
            mt="md"
          />
          <TextInput
            label="Manufacturer"
            value={editMachine.manufacturer}
            onChange={e => setEditMachine({ ...editMachine, manufacturer: e.target.value })}
            required
            mt="md"
          />
          <TextInput
            label="Serial Number"
            value={editMachine.serial_number}
            onChange={e => setEditMachine({ ...editMachine, serial_number: e.target.value })}
            required
            mt="md"
          />
          <Select
            label="Status"
            data={['active', 'inactive', 'maintenance']}
            value={editMachine.status}
            onChange={value => setEditMachine({ ...editMachine, status: value as string })}
            required
            mt="md"
          />
          <Select
            label="Plant"
            data={plants.map(p => ({ value: p.plant_id, label: p.name }))}
            value={editMachine.plant_id}
            onChange={value => setEditMachine({ ...editMachine, plant_id: value as string })}
            clearable
            mt="md"
          />
          <TextInput
            label="Installation Date"
            type="date"
            value={editMachine.installation_date || ''}
            onChange={e => setEditMachine({ ...editMachine, installation_date: e.target.value || null })}
            mt="md"
          />
          <TextInput
            label="Last Maintenance Date"
            type="date"
            value={editMachine.last_maintenance_date || ''}
            onChange={e => setEditMachine({ ...editMachine, last_maintenance_date: e.target.value || null })}
            mt="md"
          />
          <TextInput
            label="Next Maintenance Date"
            type="date"
            value={editMachine.next_maintenance_date || ''}
            onChange={e => setEditMachine({ ...editMachine, next_maintenance_date: e.target.value || null })}
            mt="md"
          />
          <Group justify="flex-end" mt="md">
            <Button onClick={handleEditMachine}>Save</Button>
          </Group>
        </Modal>
      )}
    </Card>
  );
}