'use client';

import { Card, Title, Table, Button, Modal, TextInput, Group } from '@mantine/core';
import { useState, useEffect } from 'react';

export default function MachinesAdminCard() {
  const [machines, setMachines] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [newMachine, setNewMachine] = useState({
    name: '',
    model: '',
    manufacturer: '',
    serial_number: '',
    plant_id: '',
  });

  useEffect(() => {
    const fetchMachines = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/machines', {
          method: 'GET',
          credentials: 'include',
        });

        if (!res.ok) {
          throw new Error('Failed to fetch machines');
        }

        const data = await res.json();
        setMachines(data);
      } catch (err) {
        console.error('Error fetching machines:', err);
      }
    };

    fetchMachines();
  }, []);

  const handleAddMachine = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/machines', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(newMachine),
      });

      if (!res.ok) {
        throw new Error('Failed to add machine');
      }

      const addedMachine = await res.json();
      setMachines((prev) => [...prev, addedMachine]);
      setModalOpen(false);
      setNewMachine({ name: '', model: '', manufacturer: '', serial_number: '', plant_id: '' });
    } catch (err) {
      console.error('Error adding machine:', err);
    }
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Title order={5} mb="sm">
        Machines
      </Title>
      <Table highlightOnHover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Model</th>
            <th>Manufacturer</th>
            <th>Serial Number</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {machines.map((machine) => (
            <tr key={machine.machine_id}>
              <td>{machine.name}</td>
              <td>{machine.model}</td>
              <td>{machine.manufacturer}</td>
              <td>{machine.serial_number}</td>
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
        <Button onClick={() => setModalOpen(true)}>Add Machine</Button>
      </Group>

      <Modal opened={modalOpen} onClose={() => setModalOpen(false)} title="Add Machine" centered>
        <TextInput
          label="Name"
          placeholder="Enter machine name"
          value={newMachine.name}
          onChange={(e) => setNewMachine({ ...newMachine, name: e.currentTarget.value })}
          required
        />
        <TextInput
          label="Model"
          placeholder="Enter machine model"
          value={newMachine.model}
          onChange={(e) => setNewMachine({ ...newMachine, model: e.currentTarget.value })}
          required
          mt="md"
        />
        <TextInput
          label="Manufacturer"
          placeholder="Enter manufacturer"
          value={newMachine.manufacturer}
          onChange={(e) => setNewMachine({ ...newMachine, manufacturer: e.currentTarget.value })}
          required
          mt="md"
        />
        <TextInput
          label="Serial Number"
          placeholder="Enter serial number"
          value={newMachine.serial_number}
          onChange={(e) => setNewMachine({ ...newMachine, serial_number: e.currentTarget.value })}
          required
          mt="md"
        />
        <TextInput
          label="Plant ID"
          placeholder="Enter plant ID"
          value={newMachine.plant_id}
          onChange={(e) => setNewMachine({ ...newMachine, plant_id: e.currentTarget.value })}
          required
          mt="md"
        />
        <Group position="right" mt="md">
          <Button onClick={handleAddMachine}>Add</Button>
        </Group>
      </Modal>
    </Card>
  );
}