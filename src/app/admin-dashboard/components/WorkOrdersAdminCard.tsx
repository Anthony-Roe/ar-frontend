'use client';

import { Card, Title, Table, Button, Modal, TextInput, Select, Group, Notification, ActionIcon, Tooltip, Textarea } from '@mantine/core';
import { useState, useEffect } from 'react';
import { IconSearch, IconDownload, IconEdit, IconTrash, IconInfoCircle } from '@tabler/icons-react';

interface WorkOrder {
  work_order_id: string;
  machine_id: string | null;
  plant_id: string | null;
  assigned_to: string | null;
  title: string;
  description: string;
  status: string;
  priority: string;
  due_date: string;
  machine?: { machine_id: string; name: string };
  plant?: { plant_id: string; name: string };
  assignedUser?: { user_id: string; username: string };
  workOrderParts: Array<{
    work_order_part_id: string;
    inventory_id: string;
    quantity_used: number;
    inventory: { inventory_id: string; name: string };
  }>;
  workOrderLabor: Array<{
    work_order_labor_id: string;
    user_id: string;
    hours_worked: number;
    user: { user_id: string; username: string };
  }>;
}

interface Machine {
  machine_id: string;
  name: string;
}

interface Plant {
  plant_id: string;
  name: string;
}

interface User {
  user_id: string;
  username: string;
}

interface WorkOrdersAdminCardProps {
  globalSearch?: string;
}

export default function WorkOrdersAdminCard({ globalSearch = '' }: WorkOrdersAdminCardProps) {
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [machines, setMachines] = useState<Machine[]>([]);
  const [plants, setPlants] = useState<Plant[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [newWorkOrder, setNewWorkOrder] = useState({
    machine_id: null as string | null,
    plant_id: null as string | null,
    assigned_to: null as string | null,
    title: '',
    description: '',
    status: 'pending',
    priority: 'medium',
    due_date: '',
  });
  const [editWorkOrder, setEditWorkOrder] = useState<WorkOrder | null>(null);
  const [selectedWorkOrder, setSelectedWorkOrder] = useState<WorkOrder | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch('http://localhost:5000/api/work-orders', { credentials: 'include' }).then(res => res.json()),
      fetch('http://localhost:5000/api/machines', { credentials: 'include' }).then(res => res.json()),
      fetch('http://localhost:5000/api/plants', { credentials: 'include' }).then(res => res.json()),
      fetch('http://localhost:5000/api/users', { credentials: 'include' }).then(res => res.json()),
    ])
      .then(([workOrdersData, machinesData, plantsData, usersData]) => {
        setWorkOrders(workOrdersData as WorkOrder[]);
        setMachines(machinesData as Machine[]);
        setPlants(plantsData as Plant[]);
        setUsers(usersData as User[]);
      })
      .catch((err: Error) => setError('Failed to load data: ' + err.message));
  }, []);

  const handleAddWorkOrder = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/work-orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(newWorkOrder),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to add work order');
      }
      const addedWorkOrder = await res.json();
      setWorkOrders(prev => [...prev, addedWorkOrder as WorkOrder]);
      setModalOpen(false);
      setNewWorkOrder({
        machine_id: null,
        plant_id: null,
        assigned_to: null,
        title: '',
        description: '',
        status: 'pending',
        priority: 'medium',
        due_date: '',
      });
      setSuccess('Work order added successfully!');
    } catch (err: unknown) {
      setError((err as Error).message);
    }
  };

  const handleEditWorkOrder = async () => {
    if (!editWorkOrder) return;
    try {
      const res = await fetch(`http://localhost:5000/api/work-orders/${editWorkOrder.work_order_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(editWorkOrder),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to update work order');
      }
      const updatedWorkOrder = await res.json();
      setWorkOrders(prev => prev.map(wo => (wo.work_order_id === updatedWorkOrder.work_order_id ? updatedWorkOrder as WorkOrder : wo)));
      setEditModalOpen(false);
      setSuccess('Work order updated successfully!');
    } catch (err: unknown) {
      setError((err as Error).message);
    }
  };

  const handleDeleteWorkOrder = async (id: string) => {
    if (!confirm('Are you sure you want to delete this work order?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/work-orders/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to delete work order');
      }
      setWorkOrders(prev => prev.filter(wo => wo.work_order_id !== id));
      setSuccess('Work order deleted successfully!');
    } catch (err: unknown) {
      setError((err as Error).message);
    }
  };

  const filteredWorkOrders = workOrders.filter(wo => {
    const matchesLocalSearch = search
      ? wo.title.toLowerCase().includes(search.toLowerCase()) ||
        wo.description.toLowerCase().includes(search.toLowerCase())
      : true;

    const matchesGlobalSearch = globalSearch
      ? wo.title.toLowerCase().includes(globalSearch.toLowerCase()) ||
        wo.description.toLowerCase().includes(globalSearch.toLowerCase()) ||
        (wo.machine?.name || '').toLowerCase().includes(globalSearch.toLowerCase()) ||
        (wo.plant?.name || '').toLowerCase().includes(globalSearch.toLowerCase()) ||
        (wo.assignedUser?.username || '').toLowerCase().includes(globalSearch.toLowerCase())
      : true;

    return matchesLocalSearch && matchesGlobalSearch;
  });

  const exportToCSV = () => {
    const csv = [
      'Title,Description,Status,Priority,Due Date,Machine,Plant,Assigned To',
      ...filteredWorkOrders.map(wo =>
        `${wo.title},${wo.description},${wo.status},${wo.priority},${wo.due_date},${wo.machine?.name || 'N/A'},${wo.plant?.name || 'N/A'},${wo.assignedUser?.username || 'N/A'}`
      ),
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'work_orders.csv';
    a.click();
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Group justify="space-between" mb="sm">
        <Title order={5}>Work Orders</Title>
        <Group>
          <TextInput
            placeholder="Search work orders..."
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
            <th>Title</th>
            <th>Status</th>
            <th>Priority</th>
            <th>Due Date</th>
            <th>Machine</th>
            <th>Plant</th>
            <th>Assigned To</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredWorkOrders.map(wo => (
            <tr key={wo.work_order_id}>
              <td>{wo.title}</td>
              <td>{wo.status}</td>
              <td>{wo.priority}</td>
              <td>{wo.due_date}</td>
              <td>{wo.machine?.name || 'N/A'}</td>
              <td>{wo.plant?.name || 'N/A'}</td>
              <td>{wo.assignedUser?.username || 'N/A'}</td>
              <td>
                <Group gap="xs">
                  <Tooltip label="View Details">
                    <ActionIcon onClick={() => { setSelectedWorkOrder(wo); setDetailsModalOpen(true); }}>
                      <IconInfoCircle size={16} />
                    </ActionIcon>
                  </Tooltip>
                  <Tooltip label="Edit">
                    <ActionIcon onClick={() => { setEditWorkOrder(wo); setEditModalOpen(true); }}>
                      <IconEdit size={16} />
                    </ActionIcon>
                  </Tooltip>
                  <Tooltip label="Delete">
                    <ActionIcon color="red" onClick={() => handleDeleteWorkOrder(wo.work_order_id)}>
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
        <Button onClick={() => setModalOpen(true)}>Add Work Order</Button>
      </Group>

      {/* Add Modal */}
      <Modal opened={modalOpen} onClose={() => setModalOpen(false)} title="Add Work Order" centered>
        <TextInput
          label="Title"
          placeholder="Enter work order title"
          value={newWorkOrder.title}
          onChange={e => setNewWorkOrder({ ...newWorkOrder, title: e.currentTarget.value })}
          required
        />
        <Textarea
          label="Description"
          placeholder="Enter description"
          value={newWorkOrder.description}
          onChange={e => setNewWorkOrder({ ...newWorkOrder, description: e.currentTarget.value })}
          required
          mt="md"
        />
        <Select
          label="Status"
          placeholder="Select status"
          data={['pending', 'in-progress', 'completed']}
          value={newWorkOrder.status}
          onChange={value => setNewWorkOrder({ ...newWorkOrder, status: value as string })}
          required
          mt="md"
        />
        <Select
          label="Priority"
          placeholder="Select priority"
          data={['low', 'medium', 'high', 'critical']}
          value={newWorkOrder.priority}
          onChange={value => setNewWorkOrder({ ...newWorkOrder, priority: value as string })}
          required
          mt="md"
        />
        <TextInput
          label="Due Date"
          type="date"
          value={newWorkOrder.due_date}
          onChange={e => setNewWorkOrder({ ...newWorkOrder, due_date: e.currentTarget.value })}
          required
          mt="md"
        />
        <Select
          label="Machine"
          placeholder="Select machine"
          data={machines.map(m => ({ value: m.machine_id, label: m.name }))}
          value={newWorkOrder.machine_id}
          onChange={value => setNewWorkOrder({ ...newWorkOrder, machine_id: value as string })}
          clearable
          mt="md"
        />
        <Select
          label="Plant"
          placeholder="Select plant"
          data={plants.map(p => ({ value: p.plant_id, label: p.name }))}
          value={newWorkOrder.plant_id}
          onChange={value => setNewWorkOrder({ ...newWorkOrder, plant_id: value as string })}
          clearable
          mt="md"
        />
        <Select
          label="Assigned To"
          placeholder="Select user"
          data={users.map(u => ({ value: u.user_id, label: u.username }))}
          value={newWorkOrder.assigned_to}
          onChange={value => setNewWorkOrder({ ...newWorkOrder, assigned_to: value as string })}
          clearable
          mt="md"
        />
        <Group justify="flex-end" mt="md">
          <Button onClick={handleAddWorkOrder}>Add</Button>
        </Group>
      </Modal>

      {/* Edit Modal */}
      {editWorkOrder && (
        <Modal opened={editModalOpen} onClose={() => setEditModalOpen(false)} title="Edit Work Order" centered>
          <TextInput
            label="Title"
            placeholder="Enter work order title"
            value={editWorkOrder.title}
            onChange={e => setEditWorkOrder({ ...editWorkOrder, title: e.currentTarget.value })}
            required
          />
          <Textarea
            label="Description"
            placeholder="Enter description"
            value={editWorkOrder.description}
            onChange={e => setEditWorkOrder({ ...editWorkOrder, description: e.currentTarget.value })}
            required
            mt="md"
          />
          <Select
            label="Status"
            placeholder="Select status"
            data={['pending', 'in-progress', 'completed']}
            value={editWorkOrder.status}
            onChange={value => setEditWorkOrder({ ...editWorkOrder, status: value as string })}
            required
            mt="md"
          />
          <Select
            label="Priority"
            placeholder="Select priority"
            data={['low', 'medium', 'high', 'critical']}
            value={editWorkOrder.priority}
            onChange={value => setEditWorkOrder({ ...editWorkOrder, priority: value as string })}
            required
            mt="md"
          />
          <TextInput
            label="Due Date"
            type="date"
            value={editWorkOrder.due_date}
            onChange={e => setEditWorkOrder({ ...editWorkOrder, due_date: e.currentTarget.value })}
            required
            mt="md"
          />
          <Select
            label="Machine"
            placeholder="Select machine"
            data={machines.map(m => ({ value: m.machine_id, label: m.name }))}
            value={editWorkOrder.machine_id}
            onChange={value => setEditWorkOrder({ ...editWorkOrder, machine_id: value as string })}
            clearable
            mt="md"
          />
          <Select
            label="Plant"
            placeholder="Select plant"
            data={plants.map(p => ({ value: p.plant_id, label: p.name }))}
            value={editWorkOrder.plant_id}
            onChange={value => setEditWorkOrder({ ...editWorkOrder, plant_id: value as string })}
            clearable
            mt="md"
          />
          <Select
            label="Assigned To"
            placeholder="Select user"
            data={users.map(u => ({ value: u.user_id, label: u.username }))}
            value={editWorkOrder.assigned_to}
            onChange={value => setEditWorkOrder({ ...editWorkOrder, assigned_to: value as string })}
            clearable
            mt="md"
          />
          <Group justify="flex-end" mt="md">
            <Button onClick={handleEditWorkOrder}>Save</Button>
          </Group>
        </Modal>
      )}

      {/* Details Modal */}
      {selectedWorkOrder && (
        <Modal opened={detailsModalOpen} onClose={() => setDetailsModalOpen(false)} title={`Work Order Details: ${selectedWorkOrder.title}`} centered size="lg">
          <Title order={6}>General Information</Title>
          <p><strong>Description:</strong> {selectedWorkOrder.description}</p>
          <p><strong>Status:</strong> {selectedWorkOrder.status}</p>
          <p><strong>Priority:</strong> {selectedWorkOrder.priority}</p>
          <p><strong>Due Date:</strong> {selectedWorkOrder.due_date}</p>
          <p><strong>Machine:</strong> {selectedWorkOrder.machine?.name || 'N/A'}</p>
          <p><strong>Plant:</strong> {selectedWorkOrder.plant?.name || 'N/A'}</p>
          <p><strong>Assigned To:</strong> {selectedWorkOrder.assignedUser?.username || 'N/A'}</p>

          <Title order={6} mt="md">Parts Used</Title>
          {selectedWorkOrder.workOrderParts.length > 0 ? (
            <Table>
              <thead>
                <tr>
                  <th>Part Name</th>
                  <th>Quantity Used</th>
                </tr>
              </thead>
              <tbody>
                {selectedWorkOrder.workOrderParts.map(part => (
                  <tr key={part.work_order_part_id}>
                    <td>{part.inventory.name}</td>
                    <td>{part.quantity_used}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <p>No parts used.</p>
          )}

          <Title order={6} mt="md">Labor</Title>
          {selectedWorkOrder.workOrderLabor.length > 0 ? (
            <Table>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Hours Worked</th>
                </tr>
              </thead>
              <tbody>
                {selectedWorkOrder.workOrderLabor.map(labor => (
                  <tr key={labor.work_order_labor_id}>
                    <td>{labor.user.username}</td>
                    <td>{labor.hours_worked}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <p>No labor recorded.</p>
          )}
        </Modal>
      )}
    </Card>
  );
}