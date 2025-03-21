'use client';

import { useEffect, useState } from 'react';
import {
  Container,
  Title,
  Table,
  Button,
  Group,
  Modal,
  TextInput,
  Loader,
  Notification,
} from '@mantine/core';
import { IconX } from '@tabler/icons-react';

interface Plant {
  plant_id: number;
  name: string;
  location: string;
  contact_email: string;
  contact_phone: string;
}

export default function Plants() {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [newPlant, setNewPlant] = useState({
    name: '',
    location: '',
    contact_email: '',
    contact_phone: '',
  });

  // Fetch plants from the backend
  useEffect(() => {
    const fetchPlants = async () => {
      try {
        const token = sessionStorage.getItem('token');
        const res = await fetch('http://localhost:5000/api/plants', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          throw new Error('Failed to fetch plants');
        }

        const data = await res.json();
        setPlants(data);
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

    fetchPlants();
  }, []);

  // Handle adding a new plant
  const handleAddPlant = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/plants', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newPlant),
      });

      if (!res.ok) {
        throw new Error('Failed to add plant');
      }

      const addedPlant = await res.json();
      setPlants((prev) => [...prev, addedPlant]);
      setModalOpen(false);
      setNewPlant({ name: '', location: '', contact_email: '', contact_phone: '' });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    }
  };

  if (loading) {
    return (
      <Group position="center" mt="xl">
        <Loader size="lg" />
      </Group>
    );
  }

  if (error) {
    return (
      <Notification icon={<IconX size="1.1rem" />} color="red" title="Error" mt="xl">
        {error}
      </Notification>
    );
  }

  return (
    <Container size="lg" py="xl">
      <Title align="center" mb="md">
        Manage Plants
      </Title>

      {/* Add Plant Button */}
      <Group position="right" mb="md">
        <Button onClick={() => setModalOpen(true)}>Add Plant</Button>
      </Group>

      {/* Plants Table */}
      <Table highlightOnHover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Location</th>
            <th>Contact Email</th>
            <th>Contact Phone</th>
          </tr>
        </thead>
        <tbody>
          {plants.map((plant) => (
            <tr key={plant.plant_id}>
              <td>{plant.name}</td>
              <td>{plant.location}</td>
              <td>{plant.contact_email}</td>
              <td>{plant.contact_phone}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Add Plant Modal */}
      <Modal
        opened={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Add New Plant"
        centered
      >
        <TextInput
          label="Name"
          placeholder="Enter plant name"
          value={newPlant.name}
          onChange={(e) => setNewPlant({ ...newPlant, name: e.currentTarget.value })}
          required
        />
        <TextInput
          label="Location"
          placeholder="Enter plant location"
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
          <Button onClick={handleAddPlant}>Add Plant</Button>
        </Group>
      </Modal>
    </Container>
  );
}