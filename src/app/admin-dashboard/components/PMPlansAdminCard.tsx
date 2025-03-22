'use client';

import { Card, Title, Table, Button, Modal, TextInput, Select, Textarea, Group, Notification, Text, ActionIcon, Tooltip } from '@mantine/core';
import { useState, useEffect } from 'react';
import { IconSearch, IconDownload, IconEdit, IconTrash } from '@tabler/icons-react';

// Interfaces (aligned with database schema)
interface MaintenanceSchedule {
  schedule_id: string;
  machine_id: string;
  name: string;
  description: string;
  frequency_days: number;
  last_completed: string | null;
  next_due: string;
  created_at: string;
  updated_at: string;
}

interface Machine {
  machine_id: string;
  name: string;
}

export default function PMPlansAdminCard() {
  const [schedules, setSchedules] = useState<MaintenanceSchedule[]>([]);
  const [machines, setMachines] = useState<Machine[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [newSchedule, setNewSchedule] = useState<MaintenanceSchedule>({
    schedule_id: '',
    machine_id: '',
    name: '',
    description: '',
    frequency_days: 30,
    last_completed: null,
    next_due: '',
    created_at: '',
    updated_at: '',
  });
  const [editSchedule, setEditSchedule] = useState<MaintenanceSchedule | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Fetch data on mount
  useEffect(() => {
    Promise.all([
      fetch('http://localhost:5000/api/maintenance-schedules', { credentials: 'include' }).then(res => res.json()),
      fetch('http://localhost:5000/api/machines', { credentials: 'include' }).then(res => res.json()),
    ])
      .then(([schedulesData, machinesData]) => {
        setSchedules(schedulesData as MaintenanceSchedule[]);
        setMachines(machinesData as Machine[]);
      })
      .catch((err: Error) => setError('Failed to load data: ' + err.message));
  }, []);

  // Add Schedule
  const handleAddSchedule = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/maintenance-schedules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(newSchedule),
      });
      if (!res.ok) throw new Error('Failed to add schedule');
      const addedSchedule = await res.json();
      setSchedules(prev => [...prev, addedSchedule as MaintenanceSchedule]);
      setModalOpen(false);
      setNewSchedule({
        schedule_id: '',
        machine_id: '',
        name: '',
        description: '',
        frequency_days: 30,
        last_completed: null,
        next_due: '',
        created_at: '',
        updated_at: '',
      });
      setSuccess('Maintenance schedule added successfully!');
    } catch (err: unknown) {
      setError((err as Error).message);
    }
  };

  // Edit Schedule
  const handleEditSchedule = async () => {
    if (!editSchedule) return;
    try {
      const res = await fetch(`http://localhost:5000/api/maintenance-schedules/${editSchedule.schedule_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(editSchedule),
      });
      if (!res.ok) throw new Error('Failed to update schedule');
      const updatedSchedule = await res.json();
      setSchedules(prev => prev.map(s => s.schedule_id === updatedSchedule.schedule_id ? updatedSchedule as MaintenanceSchedule : s));
      setEditModalOpen(false);
      setSuccess('Maintenance schedule updated successfully!');
    } catch (err: unknown) {
      setError((err as Error).message);
    }
  };

  // Delete Schedule
  const handleDeleteSchedule = async (id: string) => {
    if (!confirm('Are you sure you want to delete this maintenance schedule?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/maintenance-schedules/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to delete schedule');
      setSchedules(prev => prev.filter(s => s.schedule_id !== id));
      setSuccess('Maintenance schedule deleted successfully!');
    } catch (err: unknown) {
      setError((err as Error).message);
    }
  };

  // Filter schedules by search
  const filteredSchedules = schedules.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.description.toLowerCase().includes(search.toLowerCase())
  );

  // Export to CSV
  const exportToCSV = () => {
    const csv = ['Name,Description,Frequency (Days),Last Completed,Next Due,Machine']
      .concat(filteredSchedules.map(s => `${s.name},${s.description},${s.frequency_days},${s.last_completed || ''},${s.next_due},${s.machine_id}`))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'maintenance_schedules.csv';
    a.click();
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Group justify="space-between" mb="sm">
        <Title order={5}>PM Plans</Title>
        <Group>
          <TextInput
            placeholder="Search plans..."
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
            <th>Description</th>
            <th>Frequency (Days)</th>
            <th>Last Completed</th>
            <th>Next Due</th>
            <th>Machine</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredSchedules.map(s => (
            <tr key={s.schedule_id}>
              <td>{s.name}</td>
              <td>{s.description}</td>
              <td>{s.frequency_days}</td>
              <td>{s.last_completed || 'N/A'}</td>
              <td>{s.next_due}</td>
              <td>{machines.find(m => m.machine_id === s.machine_id)?.name || s.machine_id}</td>
              <td>
                <Group gap="xs">
                  <Tooltip label="Edit">
                    <ActionIcon onClick={() => { setEditSchedule(s); setEditModalOpen(true); }}>
                      <IconEdit size={16} />
                    </ActionIcon>
                  </Tooltip>
                  <Tooltip label="Delete">
                    <ActionIcon color="red" onClick={() => handleDeleteSchedule(s.schedule_id)}>
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
        <Button onClick={() => setModalOpen(true)}>New Plan</Button>
      </Group>

      {/* Add Modal */}
      <Modal opened={modalOpen} onClose={() => setModalOpen(false)} title="Add Maintenance Schedule" centered size="lg">
        <TextInput
          label="Name"
          value={newSchedule.name}
          onChange={e => setNewSchedule({ ...newSchedule, name: e.target.value })}
          required
        />
        <Textarea
          label="Description"
          value={newSchedule.description}
          onChange={e => setNewSchedule({ ...newSchedule, description: e.target.value })}
          required
          mt="md"
        />
        <TextInput
          label="Frequency (Days)"
          type="number"
          value={newSchedule.frequency_days}
          onChange={e => setNewSchedule({ ...newSchedule, frequency_days: parseInt(e.target.value) })}
          required
          mt="md"
        />
        <TextInput
          label="Next Due"
          type="date"
          value={newSchedule.next_due}
          onChange={e => setNewSchedule({ ...newSchedule, next_due: e.target.value })}
          required
          mt="md"
        />
        <Select
          label="Machine"
          data={machines.map(m => ({ value: m.machine_id, label: m.name }))}
          value={newSchedule.machine_id}
          onChange={value => setNewSchedule({ ...newSchedule, machine_id: value as string })}
          required
          mt="md"
        />
        <Group justify="flex-end" mt="md">
          <Button onClick={handleAddSchedule}>Add</Button>
        </Group>
      </Modal>

      {/* Edit Modal */}
      {editSchedule && (
        <Modal opened={editModalOpen} onClose={() => setEditModalOpen(false)} title="Edit Maintenance Schedule" centered size="lg">
          <TextInput
            label="Name"
            value={editSchedule.name}
            onChange={e => setEditSchedule({ ...editSchedule, name: e.target.value })}
            required
          />
          <Textarea
            label="Description"
            value={editSchedule.description}
            onChange={e => setEditSchedule({ ...editSchedule, description: e.target.value })}
            required
            mt="md"
          />
          <TextInput
            label="Frequency (Days)"
            type="number"
            value={editSchedule.frequency_days}
            onChange={e => setEditSchedule({ ...editSchedule, frequency_days: parseInt(e.target.value) })}
            required
            mt="md"
          />
          <TextInput
            label="Last Completed"
            type="date"
            value={editSchedule.last_completed || ''}
            onChange={e => setEditSchedule({ ...editSchedule, last_completed: e.target.value || null })}
            mt="md"
          />
          <TextInput
            label="Next Due"
            type="date"
            value={editSchedule.next_due}
            onChange={e => setEditSchedule({ ...editSchedule, next_due: e.target.value })}
            required
            mt="md"
          />
          <Select
            label="Machine"
            data={machines.map(m => ({ value: m.machine_id, label: m.name }))}
            value={editSchedule.machine_id}
            onChange={value => setEditSchedule({ ...editSchedule, machine_id: value as string })}
            required
            mt="md"
          />
          <Group justify="flex-end" mt="md">
            <Button onClick={handleEditSchedule}>Save</Button>
          </Group>
        </Modal>
      )}
    </Card>
  );
}