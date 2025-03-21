'use client';

import { Container, SimpleGrid, Title } from '@mantine/core';
import MachinesCard from './components/MachinesCard';
import WorkOrdersCard from './components/WorkOrdersCard';
import PMPlansCard from './components/PMPlansCard';
import StockManagementCard from './components/StockManagementCard';
import AuditsCard from './components/AuditsCard';
import PerformanceReportsCard from './components/PerformanceReportsCard';

export default function DashboardPage() {
  return (
    <Container size="lg" py="xl">
      <Title align="center" mb="lg">
        Main Dashboard
      </Title>
      <SimpleGrid cols={3} spacing="lg">
        <MachinesCard />
        <WorkOrdersCard />
        <PMPlansCard />
        <StockManagementCard />
        <AuditsCard />
        <PerformanceReportsCard />
      </SimpleGrid>
    </Container>
  );
}