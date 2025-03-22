'use client';

import { useEffect, useState } from 'react';
import { Container, Title, Button, Grid, Alert } from '@mantine/core';
import WorkOrderStats from './WorkOrderItems/WorkOrderStats';
import WorkOrderChart from './WorkOrderItems/WorkOrderChart'; // Ensure this component exists and accepts 'chartData' prop
import WorkOrderList from './WorkOrderItems/WorkOrderList'; // Ensure this component exists and accepts 'workOrders', 'getPriorityColor', and 'onWorkOrderClick' props
import CreateWorkOrderModal from './WorkOrderItems/CreateWorkOrderModal';
import WorkOrderDetailsModal from './WorkOrderItems/WorkOrderDetailsModal';

export default function WorkOrdersView({
  setCurrentView,
}: {
  setCurrentView: (view: 'home' | 'login' | 'createAccount' | 'managePlants' | 'workOrders') => void;
}) {
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