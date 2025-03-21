'use client';

import { Container, SimpleGrid, Title } from '@mantine/core';
import MachinesAdminCard from './components/MachinesAdminCard';
import WorkOrdersAdminCard from './components/WorkOrdersAdminCard';
import PMPlansAdminCard from './components/PMPlansAdminCard';
import StockManagementAdminCard from './components/StockManagementAdminCard';
import AuditsAdminCard from './components/AuditsAdminCard';
import PerformanceReportsAdminCard from './components/PerformanceReportsAdminCard';
import UsersRolesCard from './components/UsersRolesCard';
import PlantsCard from './components/PlantsCard';
import VendorsCard from './components/VendorsCard';

export default function AdminDashboardPage() {
  return (
    <Container size="lg" py="xl">
      <Title align="center" mb="lg">
        Admin Dashboard
      </Title>
      <SimpleGrid cols={3} spacing="lg">
        <MachinesAdminCard />
        <WorkOrdersAdminCard />
        <PerformanceReportsAdminCard />
        <UsersRolesCard />
        <PlantsCard />
        <VendorsCard />
      </SimpleGrid>
    </Container>
  );
}