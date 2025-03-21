'use client';

import { Card, Title, Table, Button, Modal, TextInput, Group, Notification } from '@mantine/core';
import { useState, useEffect } from 'react';

export default function PlantsCard() {
  const [plants, setPlants] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [newPlant, setNewPlant] = useState({
    name: '',
    location: '',
    contact_email: '',
    contact_phone: '',
  });
  const [error, setError] = useState<string | null>(null);

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
        setPlants([]); // Ensure plants is always an array
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
        throw new Error('Failed to add plant');
      }

      const addedPlant = await res.json();
      setPlants((prev) => [...prev, addedPlant]);
      setModalOpen(false);
      setNewPlant({ name: '', location: '', contact_email: '', contact_phone: '' });
    } catch (err) {
      console.error('Error adding plant:', err);
      setError('Failed to add plant');
    }
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Title order={5} mb="sm">
        Plants
      </Title>

      {error && (
        <Notification color="red" title="Error" onClose={() => setError(null)}>
          {error}
        </Notification>
      )}

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
          {plants.map((plant) => (
            <tr key={plant.plant_id}>
              <td>{plant.name}</td>
              <td>{plant.location}</td>
              <td>{plant.contact_email}</td>
              <td>{plant.contact_phone}</td>
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
        <Button onClick={() => setModalOpen(true)}>Add Plant</Button>
      </Group>

      <Modal opened={modalOpen} onClose={() => setModalOpen(false)} title="Add Plant" centered>
        <TextInput
          label="Name"
          placeholder="Enter plant name"
          value={newPlant.name}
          onChange={(e) => setNewPlant({ ...newPlant, name: e.currentTarget.value })}
          required
        />
        <TextInput
          label="Location"
          placeholder="Enter location"
          value={newPlant.location}
          onChange={(e) => setNewPlant({ ...newPlant, location: e.currentTarget.value })}
          required
          mt="md"
        />
        <TextInput
          label="Contact Email"
          placeholder="Enter contact email"
          value={newPlant.contact_email}
          onChange={(e) => setNewPlant({ ...newPlant, contact_email: e.currentTarget.value })}
          required
          mt="md"
        />
        <TextInput
          label="Contact Phone"
          placeholder="Enter contact phone"
          value={newPlant.contact_phone}
          onChange={(e) => setNewPlant({ ...newPlant, contact_phone: e.currentTarget.value })}
          required
          mt="md"
        />
        <Group position="right" mt="md">
          <Button onClick={handleAddPlant}>Add</Button>
        </Group>
      </Modal>
    </Card>
  );
}