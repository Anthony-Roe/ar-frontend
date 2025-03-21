'use client';

import { Card, Title, Table, Button, Modal, TextInput, Group } from '@mantine/core';
import { useState, useEffect } from 'react';

export default function VendorsCard() {
  const [vendors, setVendors] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [newVendor, setNewVendor] = useState({
    name: '',
    contact_email: '',
    contact_phone: '',
  });

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/vendors', {
          method: 'GET',
          credentials: 'include',
        });

        if (!res.ok) {
          throw new Error('Failed to fetch vendors');
        }

        const data = await res.json();
        setVendors(data);
      } catch (err) {
        console.error('Error fetching vendors:', err);
      }
    };

    fetchVendors();
  }, []);

  const handleAddVendor = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/vendors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(newVendor),
      });

      if (!res.ok) {
        throw new Error('Failed to add vendor');
      }

      const addedVendor = await res.json();
      setVendors((prev) => [...prev, addedVendor]);
      setModalOpen(false);
      setNewVendor({ name: '', contact_email: '', contact_phone: '' });
    } catch (err) {
      console.error('Error adding vendor:', err);
    }
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Title order={5} mb="sm">
        Vendors
      </Title>
      <Table highlightOnHover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Contact Email</th>
            <th>Contact Phone</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {vendors.map((vendor) => (
            <tr key={vendor.vendor_id}>
              <td>{vendor.name}</td>
              <td>{vendor.contact_email}</td>
              <td>{vendor.contact_phone}</td>
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
        <Button onClick={() => setModalOpen(true)}>Add Vendor</Button>
      </Group>

      <Modal opened={modalOpen} onClose={() => setModalOpen(false)} title="Add Vendor" centered>
        <TextInput
          label="Name"
          placeholder="Enter vendor name"
          value={newVendor.name}
          onChange={(e) => setNewVendor({ ...newVendor, name: e.currentTarget.value })}
          required
        />
        <TextInput
          label="Contact Email"
          placeholder="Enter contact email"
          value={newVendor.contact_email}
          onChange={(e) => setNewVendor({ ...newVendor, contact_email: e.currentTarget.value })}
          required
          mt="md"
        />
        <TextInput
          label="Contact Phone"
          placeholder="Enter contact phone"
          value={newVendor.contact_phone}
          onChange={(e) => setNewVendor({ ...newVendor, contact_phone: e.currentTarget.value })}
          required
          mt="md"
        />
        <Group position="right" mt="md">
          <Button onClick={handleAddVendor}>Add</Button>
        </Group>
      </Modal>
    </Card>
  );
}