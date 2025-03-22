'use client';

import { useEffect, useState } from 'react';
import { Container, Title, Grid, Button, Alert } from '@mantine/core';
import WorkOrderStats from './components/WorkOrderStats';
import WorkOrderChart from './components/WorkOrderChart';
import WorkOrderList from './components/WorkOrderList';
import CreateWorkOrderModal from './components/CreateWorkOrderModal';
import WorkOrderDetailsModal from './components/WorkOrderDetailsModal';

export default function WorkOrdersPage() {
  const [workOrders, setWorkOrders] = useState([]);
  const [plants, setPlants] = useState([]);
  const [machines, setMachines] = useState([]);
  const [error, setError] = useState<string | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedWorkOrder, setSelectedWorkOrder] = useState<any>(null);
  const [newWorkOrder, setNewWorkOrder] = useState({
    plant_id: '',
    machine_id: '',
    priority: 'medium',
    due_date: '',
    description: '',
  });
  const [priorities] = useState(['low', 'medium', 'high', 'critical']);

  useEffect(() => {
    const fetchWorkOrders = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/work-orders', {
          method: 'GET',
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch work orders');
        }

        const data = await response.json();
        setWorkOrders(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
      }
    };

    fetchWorkOrders();
  }, []);

  const chartData = {
    labels: ['Pending', 'In Progress', 'Completed', 'Cancelled'],
    datasets: [
      {
        data: [
          workOrders.filter((order) => order.status === 'pending').length,
          workOrders.filter((order) => order.status === 'in_progress').length,
          workOrders.filter((order) => order.status === 'completed').length,
          workOrders.filter((order) => order.status === 'cancelled').length,
        ],
        backgroundColor: ['#36A2EB', '#FFCE56', '#4BC0C0', '#FF6384'],
      },
    ],
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low':
        return 'green';
      case 'medium':
        return 'blue';
      case 'high':
        return 'orange';
      case 'critical':
        return 'red';
      default:
        return 'gray';
    }
  };

  return (
    <Container size="lg" style={{ textAlign: 'center', position: 'relative' }}>
      <Title align="center" mb="sm" size="h3">
        Work Orders Dashboard
      </Title>

      {error && <Alert color="red" mb="sm">{error}</Alert>}

      <WorkOrderStats workOrders={workOrders} />
      <Grid>
        <Grid.Col span={4}>
          <WorkOrderChart chartData={chartData} />
        </Grid.Col>
        <Grid.Col span={8}>
          <WorkOrderList
            workOrders={workOrders}
            getPriorityColor={getPriorityColor}
            onWorkOrderClick={(workOrder) => {
              setSelectedWorkOrder(workOrder);
              setDetailsModalOpen(true);
            }}
          />
        </Grid.Col>
      </Grid>

      <Button
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 1000,
        }}
        size="lg"
        radius="xl"
        onClick={() => setCreateModalOpen(true)}
      >
        + Add Work Order
      </Button>

      <CreateWorkOrderModal
        opened={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        plants={plants}
        machines={machines}
        priorities={priorities}
        newWorkOrder={newWorkOrder}
        setNewWorkOrder={setNewWorkOrder}
        handleCreateWorkOrder={() => {}}
      />

      <WorkOrderDetailsModal
        opened={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        selectedWorkOrder={selectedWorkOrder}
        getPriorityColor={getPriorityColor}
      />
    </Container>
  );
}
