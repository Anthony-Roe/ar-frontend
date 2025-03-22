'use client';

import { Card, Title, Table, Button, Modal, TextInput, Group, Notification, ActionIcon, Tooltip } from '@mantine/core';
import { useState, useEffect } from 'react';
import { IconSearch, IconDownload, IconEdit, IconTrash } from '@tabler/icons-react';

interface Vendor {
  vendor_id: string;
  name: string;
  contact_email: string;
  contact_phone: string;
  address: string;
}

interface VendorsAdminCardProps {
  globalSearch?: string;
}

export default function VendorsAdminCard({ globalSearch = '' }: VendorsAdminCardProps) {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [newVendor, setNewVendor] = useState({
    name: '',
    contact_email: '',
    contact_phone: '',
    address: '',
  });
  const [editVendor, setEditVendor] = useState<Vendor | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

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
        setVendors(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error fetching vendors:', err);
        setError('Failed to fetch vendors');
        setVendors([]);
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
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to add vendor');
      }
      const addedVendor = await res.json();
      setVendors(prev => [...prev, addedVendor as Vendor]);
      setModalOpen(false);
      setNewVendor({ name: '', contact_email: '', contact_phone: '', address: '' });
      setSuccess('Vendor added successfully!');
    } catch (err: unknown) {
      setError((err as Error).message);
    }
  };

  const handleEditVendor = async () => {
    if (!editVendor) return;
    try {
      const res = await fetch(`http://localhost:5000/api/vendors/${editVendor.vendor_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(editVendor),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to update vendor');
      }
      const updatedVendor = await res.json();
      setVendors(prev => prev.map(v => (v.vendor_id === updatedVendor.vendor_id ? updatedVendor as Vendor : v)));
      setEditModalOpen(false);
      setSuccess('Vendor updated successfully!');
    } catch (err: unknown) {
      setError((err as Error).message);
    }
  };

  const handleDeleteVendor = async (id: string) => {
    if (!confirm('Are you sure you want to delete this vendor?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/vendors/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to delete vendor');
      }
      setVendors(prev => prev.filter(v => v.vendor_id !== id));
      setSuccess('Vendor deleted successfully!');
    } catch (err: unknown) {
      setError((err as Error).message);
    }
  };

  const filteredVendors = vendors.filter(v => {
    const matchesLocalSearch = search
      ? v.name.toLowerCase().includes(search.toLowerCase()) ||
        v.contact_email.toLowerCase().includes(search.toLowerCase())
      : true;

    const matchesGlobalSearch = globalSearch
      ? v.name.toLowerCase().includes(globalSearch.toLowerCase()) ||
        v.contact_email.toLowerCase().includes(globalSearch.toLowerCase()) ||
        v.address.toLowerCase().includes(globalSearch.toLowerCase())
      : true;

    return matchesLocalSearch && matchesGlobalSearch;
  });

  const exportToCSV = () => {
    const csv = [
      'Name,Contact Email,Contact Phone,Address',
      ...filteredVendors.map(v => `${v.name},${v.contact_email},${v.contact_phone},${v.address}`),
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'vendors.csv';
    a.click();
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Group justify="space-between" mb="sm">
        <Title order={5}>Vendors</Title>
        <Group>
          <TextInput
            placeholder="Search vendors..."
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
            <th>Contact Email</th>
            <th>Contact Phone</th>
            <th>Address</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredVendors.map(v => (
            <tr key={v.vendor_id}>
              <td>{v.name}</td>
              <td>{v.contact_email}</td>
              <td>{v.contact_phone}</td>
              <td>{v.address}</td>
              <td>
                <Group gap="xs">
                  <Tooltip label="Edit">
                    <ActionIcon onClick={() => { setEditVendor(v); setEditModalOpen(true); }}>
                      <IconEdit size={16} />
                    </ActionIcon>
                  </Tooltip>
                  <Tooltip label="Delete">
                    <ActionIcon color="red" onClick={() => handleDeleteVendor(v.vendor_id)}>
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
        <Button onClick={() => setModalOpen(true)}>Add Vendor</Button>
      </Group>

      {/* Add Modal */}
      <Modal opened={modalOpen} onClose={() => setModalOpen(false)} title="Add Vendor" centered>
        <TextInput
          label="Name"
          placeholder="Enter vendor name"
          value={newVendor.name}
          onChange={e => setNewVendor({ ...newVendor, name: e.currentTarget.value })}
          required
        />
        <TextInput
          label="Contact Email"
          placeholder="Enter contact email"
          value={newVendor.contact_email}
          onChange={e => setNewVendor({ ...newVendor, contact_email: e.currentTarget.value })}
          required
          mt="md"
        />
        <TextInput
          label="Contact Phone"
          placeholder="Enter contact phone"
          value={newVendor.contact_phone}
          onChange={e => setNewVendor({ ...newVendor, contact_phone: e.currentTarget.value })}
          required
          mt="md"
        />
        <TextInput
          label="Address"
          placeholder="Enter address"
          value={newVendor.address}
          onChange={e => setNewVendor({ ...newVendor, address: e.currentTarget.value })}
          required
          mt="md"
        />
        <Group justify="flex-end" mt="md">
          <Button onClick={handleAddVendor}>Add</Button>
        </Group>
      </Modal>

      {/* Edit Modal */}
      {editVendor && (
        <Modal opened={editModalOpen} onClose={() => setEditModalOpen(false)} title="Edit Vendor" centered>
          <TextInput
            label="Name"
            placeholder="Enter vendor name"
            value={editVendor.name}
            onChange={e => setEditVendor({ ...editVendor, name: e.currentTarget.value })}
            required
          />
          <TextInput
            label="Contact Email"
            placeholder="Enter contact email"
            value={editVendor.contact_email}
            onChange={e => setEditVendor({ ...editVendor, contact_email: e.currentTarget.value })}
            required
            mt="md"
          />
          <TextInput
            label="Contact Phone"
            placeholder="Enter contact phone"
            value={editVendor.contact_phone}
            onChange={e => setEditVendor({ ...editVendor, contact_phone: e.currentTarget.value })}
            required
            mt="md"
          />
          <TextInput
            label="Address"
            placeholder="Enter address"
            value={editVendor.address}
            onChange={e => setEditVendor({ ...editVendor, address: e.currentTarget.value })}
            required
            mt="md"
          />
          <Group justify="flex-end" mt="md">
            <Button onClick={handleEditVendor}>Save</Button>
          </Group>
        </Modal>
      )}
    </Card>
  );
}