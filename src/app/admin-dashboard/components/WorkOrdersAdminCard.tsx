'use client';

import { Card, Title, Table, Button, Modal, TextInput, Select, Textarea, Group } from '@mantine/core';
import { useState, useEffect } from 'react';

export default function WorkOrdersAdminCard() {
  const [workOrders, setWorkOrders] = useState([]);
  const [machines, setMachines] = useState([]);
  const [plants, setPlants] = useState([]);
  const [users, setUsers] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [newWorkOrder, setNewWorkOrder] = useState({
    title: '',
    description: '',
    status: 'pending',
    priority: 'medium',
    machine_id: '',
    plant_id: '',
    assigned_to: '',
    due_date: '',
  });

  // Fetch data for dropdowns
  useEffect(() => {
    const fetchMachines = async () => {
      const res = await fetch('http://localhost:5000/api/machines');
      const data = await res.json();
      setMachines(data);
    };

    const fetchPlants = async () => {
      const res = await fetch('http://localhost:5000/api/plants');
      const data = await res.json();
      setPlants(data);
    };

    const fetchUsers = async () => {
      const res = await fetch('http://localhost:5000/api/users');
      const data = await res.json();
      setUsers(data);
    };

    fetchMachines();
    fetchPlants();
    fetchUsers();
  }, []);

  const handleAddWorkOrder = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/work-orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newWorkOrder),
      });

      if (!res.ok) throw new Error('Failed to add work order');

      const addedWorkOrder = await res.json();
      setWorkOrders((prev) => [...prev, addedWorkOrder]);
      setModalOpen(false);
      setNewWorkOrder({
        title: '',
        description: '',
        status: 'pending',
        priority: 'medium',
        machine_id: '',
        plant_id: '',
        assigned_to: '',
        due_date: '',
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Title order={5} mb="sm">
        Work Orders
      </Title>
      <Table highlightOnHover>
        <thead>
          <tr>
            <th>Title</th>
            <th>Status</th>
            <th>Priority</th>
            <th>Due Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {workOrders.map((order) => (
            <tr key={order.work_order_id}>
              <td>{order.title}</td>
              <td>{order.status}</td>
              <td>{order.priority}</td>
              <td>{order.due_date}</td>
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
        <Button onClick={() => setModalOpen(true)}>Add Work Order</Button>
      </Group>

      <Modal opened={modalOpen} onClose={() => setModalOpen(false)} title="Add Work Order" centered>
        <TextInput
          label="Title"
          placeholder="Enter work order title"
          value={newWorkOrder.title}
          onChange={(e) => setNewWorkOrder({ ...newWorkOrder, title: e.currentTarget.value })}
          required
        />
        <Textarea
          label="Description"
          placeholder="Enter work order description"
          value={newWorkOrder.description}
          onChange={(e) => setNewWorkOrder({ ...newWorkOrder, description: e.currentTarget.value })}
          required
          mt="md"
        />
        <Select
          label="Priority"
          placeholder="Select priority"
          data={[
            { value: 'low', label: 'Low' },
            { value: 'medium', label: 'Medium' },
            { value: 'high', label: 'High' },
            { value: 'critical', label: 'Critical' },
          ]}
          value={newWorkOrder.priority}
          onChange={(value) => setNewWorkOrder({ ...newWorkOrder, priority: value || 'medium' })}
          required
          mt="md"
        />
        <Select
          label="Machine"
          placeholder="Select machine"
          data={machines.map((machine) => ({
            value: machine.machine_id,
            label: machine.name,
          }))}
          value={newWorkOrder.machine_id}
          onChange={(value) => setNewWorkOrder({ ...newWorkOrder, machine_id: value || '' })}
          required
          mt="md"
        />
        <Select
          label="Plant"
          placeholder="Select plant"
          data={plants.map((plant) => ({
            value: plant.plant_id,
            label: plant.name,
          }))}
          value={newWorkOrder.plant_id}
          onChange={(value) => setNewWorkOrder({ ...newWorkOrder, plant_id: value || '' })}
          required
          mt="md"
        />
        <Select
          label="Assigned To"
          placeholder="Select user"
          data={users.map((user) => ({
            value: user.user_id,
            label: user.username,
          }))}
          value={newWorkOrder.assigned_to}
          onChange={(value) => setNewWorkOrder({ ...newWorkOrder, assigned_to: value || '' })}
          required
          mt="md"
        />
        <TextInput
          label="Due Date"
          placeholder="Enter due date"
          value={newWorkOrder.due_date}
          onChange={(e) => setNewWorkOrder({ ...newWorkOrder, due_date: e.currentTarget.value })}
          required
          mt="md"
        />
        <Group position="right" mt="md">
          <Button onClick={handleAddWorkOrder}>Add</Button>
        </Group>
      </Modal>
    </Card>
  );
}