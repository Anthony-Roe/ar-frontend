'use client';

import { Card, Title, Button, Modal, TextInput, Select, Textarea, Group, Notification, NumberInput } from '@mantine/core';
import { useState, useEffect } from 'react';

interface Inventory {
  inventory_id: string;
  plant_id: string | null;
  vendor_id: string | null;
  name: string;
  description: string;
  quantity: number;
  unit_price: number;
  plant?: { plant_id: string; name: string };
  vendor?: { vendor_id: string; name: string };
}

interface Plant {
  plant_id: string;
  name: string;
}

interface Vendor {
  vendor_id: string;
  name: string;
}

export default function StockManagementAdminCard() {
  const [inventory, setInventory] = useState<Inventory[]>([]);
  const [plants, setPlants] = useState<Plant[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [newInventory, setNewInventory] = useState({
    plant_id: null as string | null,
    vendor_id: null as string | null,
    name: '',
    description: '',
    quantity: 0,
    unit_price: 0,
  });
  const [editInventory, setEditInventory] = useState<Inventory | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch('http://localhost:5000/api/inventory', { credentials: 'include' }).then(res => res.json()),
      fetch('http://localhost:5000/api/plants', { credentials: 'include' }).then(res => res.json()),
      fetch('http://localhost:5000/api/vendors', { credentials: 'include' }).then(res => res.json()),
    ])
      .then(([inventoryData, plantsData, vendorsData]) => {
        setInventory(inventoryData as Inventory[]);
        setPlants(plantsData as Plant[]);
        setVendors(vendorsData as Vendor[]);
      })
      .catch((err: Error) => setError('Failed to load data: ' + err.message));
  }, []);

  const handleAddInventory = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(newInventory),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to add inventory item');
      }
      const addedInventory = await res.json();
      setInventory(prev => [...prev, addedInventory as Inventory]);
      setModalOpen(false);
      setNewInventory({ plant_id: null, vendor_id: null, name: '', description: '', quantity: 0, unit_price: 0 });
      setSuccess('Inventory item added successfully!');
    } catch (err: unknown) {
      setError((err as Error).message);
    }
  };

  const handleEditInventory = async () => {
    if (!editInventory) return;
    try {
      const res = await fetch(`http://localhost:5000/api/inventory/${editInventory.inventory_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(editInventory),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to update inventory item');
      }
      const updatedInventory = await res.json();
      setInventory(prev => prev.map(i => (i.inventory_id === updatedInventory.inventory_id ? updatedInventory as Inventory : i)));
      setEditModalOpen(false);
      setSuccess('Inventory item updated successfully!');
    } catch (err: unknown) {
      setError((err as Error).message);
    }
  };

  const handleDeleteInventory = async (id: string) => {
    if (!confirm('Are you sure you want to delete this inventory item?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/inventory/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to delete inventory item');
      }
      setInventory(prev => prev.filter(i => i.inventory_id !== id));
      setSuccess('Inventory item deleted successfully!');
    } catch (err: unknown) {
      setError((err as Error).message);
    }
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Group justify="space-between" mb="sm">
        <Title order={5}>Stock Management</Title>
        <Button onClick={() => setModalOpen(true)}>Add Inventory Item</Button>
      </Group>
      {error && <Notification color="red" onClose={() => setError(null)}>{error}</Notification>}
      {success && <Notification color="green" onClose={() => setSuccess(null)}>{success}</Notification>}
      <div>
        {inventory.map(item => (
          <Card key={item.inventory_id} shadow="xs" padding="sm" radius="md" withBorder mb="sm">
            <Group justify="space-between">
              <div>
                <Title order={6}>{item.name}</Title>
                <p>Description: {item.description}</p>
                <p>Quantity: {item.quantity}</p>
                <p>Unit Price: ${item.unit_price.toFixed(2)}</p>
                <p>Plant: {item.plant?.name || 'N/A'}</p>
                <p>Vendor: {item.vendor?.name || 'N/A'}</p>
              </div>
              <Group>
                <Button size="xs" onClick={() => { setEditInventory(item); setEditModalOpen(true); }}>
                  Edit
                </Button>
                <Button size="xs" color="red" onClick={() => handleDeleteInventory(item.inventory_id)}>
                  Delete
                </Button>
              </Group>
            </Group>
          </Card>
        ))}
      </div>

      {/* Add Modal */}
      <Modal opened={modalOpen} onClose={() => setModalOpen(false)} title="Add Inventory Item" centered>
        <TextInput
          label="Name"
          placeholder="Enter item name"
          value={newInventory.name}
          onChange={e => setNewInventory({ ...newInventory, name: e.currentTarget.value })}
          required
        />
        <Textarea
          label="Description"
          placeholder="Enter description"
          value={newInventory.description}
          onChange={e => setNewInventory({ ...newInventory, description: e.currentTarget.value })}
          required
          mt="md"
        />
        <NumberInput
          label="Quantity"
          placeholder="Enter quantity"
          value={newInventory.quantity}
          onChange={value => setNewInventory({ ...newInventory, quantity: Number(value) })}
          min={0}
          required
          mt="md"
        />
        <NumberInput
          label="Unit Price"
          placeholder="Enter unit price"
          value={newInventory.unit_price}
          onChange={value => setNewInventory({ ...newInventory, unit_price: Number(value) })}
          min={0}
          decimalScale={2}
          fixedDecimalScale
          required
          mt="md"
        />
        <Select
          label="Plant"
          placeholder="Select plant"
          data={plants.map(p => ({ value: p.plant_id, label: p.name }))}
          value={newInventory.plant_id}
          onChange={value => setNewInventory({ ...newInventory, plant_id: value as string })}
          clearable
          mt="md"
        />
        <Select
          label="Vendor"
          placeholder="Select vendor"
          data={vendors.map(v => ({ value: v.vendor_id, label: v.name }))}
          value={newInventory.vendor_id}
          onChange={value => setNewInventory({ ...newInventory, vendor_id: value as string })}
          clearable
          mt="md"
        />
        <Group justify="flex-end" mt="md">
          <Button onClick={handleAddInventory}>Add</Button>
        </Group>
      </Modal>

      {/* Edit Modal */}
      {editInventory && (
        <Modal opened={editModalOpen} onClose={() => setEditModalOpen(false)} title="Edit Inventory Item" centered>
          <TextInput
            label="Name"
            placeholder="Enter item name"
            value={editInventory.name}
            onChange={e => setEditInventory({ ...editInventory, name: e.currentTarget.value })}
            required
          />
          <Textarea
            label="Description"
            placeholder="Enter description"
            value={editInventory.description}
            onChange={e => setEditInventory({ ...editInventory, description: e.currentTarget.value })}
            required
            mt="md"
          />
          <NumberInput
            label="Quantity"
            placeholder="Enter quantity"
            value={editInventory.quantity}
            onChange={value => setEditInventory({ ...editInventory, quantity: Number(value) })}
            min={0}
            required
            mt="md"
          />
          <NumberInput
            label="Unit Price"
            placeholder="Enter unit price"
            value={editInventory.unit_price}
            onChange={value => setEditInventory({ ...editInventory, unit_price: Number(value) })}
            min={0}
            decimalScale={2}
            fixedDecimalScale
            required
            mt="md"
          />
          <Select
            label="Plant"
            placeholder="Select plant"
            data={plants.map(p => ({ value: p.plant_id, label: p.name }))}
            value={editInventory.plant_id}
            onChange={value => setEditInventory({ ...editInventory, plant_id: value as string })}
            clearable
            mt="md"
          />
          <Select
            label="Vendor"
            placeholder="Select vendor"
            data={vendors.map(v => ({ value: v.vendor_id, label: v.name }))}
            value={editInventory.vendor_id}
            onChange={value => setEditInventory({ ...editInventory, vendor_id: value as string })}
            clearable
            mt="md"
          />
          <Group justify="flex-end" mt="md">
            <Button onClick={handleEditInventory}>Save</Button>
          </Group>
        </Modal>
      )}
    </Card>
  );
}