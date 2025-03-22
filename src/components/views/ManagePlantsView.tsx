'use client';

import { useEffect, useState } from 'react';
import {
  Title,
  Button,
  SimpleGrid,
  Card,
  Text,
  Group,
  Alert,
  Modal,
  TextInput,
} from '@mantine/core';
import Cookies from 'js-cookie';

export default function ManagePlantsView({
  setCurrentView,
}: {
  setCurrentView: (view: 'home' | 'login' | 'createAccount' | 'managePlants') => void;
}) {
  const [plants, setPlants] = useState<
    { plant_id: number; name: string; location: string; contact_email: string; contact_phone: string }[]
  >([]);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [newPlant, setNewPlant] = useState({
    name: '',
    location: '',
    contact_email: '',
    contact_phone: '',
  });
  const [pageDetails, setPageDetails] = useState<{ page: number }>({ page: 1 });

  // Restore page details from cookies on load
  useEffect(() => {
    const savedPageDetails = Cookies.get('pageDetails');
    if (savedPageDetails) {
      setPageDetails(JSON.parse(savedPageDetails));
    }
  }, []);

  // Save page details to cookies whenever they change
  useEffect(() => {
    Cookies.set('pageDetails', JSON.stringify(pageDetails), { expires: 7 }); // Expires in 7 days
  }, [pageDetails]);

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
        setPlants(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
      }
    };

    fetchPlants();
  }, []);

  const handleAddPlant = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/plants', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    }
  };

  const handleDeletePlant = async (plantId: number) => {
    try {
      const res = await fetch(`http://localhost:5000/api/plants/${plantId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!res.ok) {
        throw new Error('Failed to delete plant');
      }

      setPlants((prev) => prev.filter((plant) => plant.plant_id !== plantId));
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    }
  };

  return (
    <>
      <Title align="center" mb="lg">
        Manage Plants
      </Title>
      {error && (
        <Alert color="red" mb="md">
          {error}
        </Alert>
      )}
      <SimpleGrid cols={1} spacing="md">
        {/* Add New Plant Button Card */}
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Group position="center">
            <Button onClick={() => setModalOpen(true)}>Add New Plant</Button>
          </Group>
        </Card>

        {/* Existing Plants */}
        {plants.map((plant) => (
          <Card key={plant.plant_id} shadow="sm" padding="lg" radius="md" withBorder>
            <Title order={4}>{plant.name}</Title>
            <Text size="sm" color="dimmed">
              Location: {plant.location}
            </Text>
            <Text size="sm" color="dimmed">
              Email: {plant.contact_email}
            </Text>
            <Text size="sm" color="dimmed">
              Phone: {plant.contact_phone}
            </Text>
            <Group position="right" mt="md">
              <Button color="red" onClick={() => handleDeletePlant(plant.plant_id)}>
                Delete
              </Button>
            </Group>
          </Card>
        ))}
      </SimpleGrid>

      <Group position="center" mt="md">
        <Button variant="outline" onClick={() => setCurrentView('home')}>
          Back to Home
        </Button>
      </Group>

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
    </>
  );
}
