'use client';

import { Container, SimpleGrid, Title, TextInput, Group, ActionIcon } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import MachinesAdminCard from './components/MachinesAdminCard';
import WorkOrdersAdminCard from './components/WorkOrdersAdminCard';
import PMPlansAdminCard from './components/PMPlansAdminCard';
import StockManagementAdminCard from './components/StockManagementAdminCard';
import AuditsAdminCard from './components/AuditsAdminCard';
import PerformanceReportsAdminCard from './components/PerformanceReportsAdminCard';
import UsersRolesAdminCard from './components/UsersRolesAdminCard';
import PlantsAdminCard from './components/PlantsAdminCard';
import VendorsAdminCard from './components/VendorsAdminCard';
import { useState } from 'react';

export default function AdminDashboardPage() {
  const [globalSearch, setGlobalSearch] = useState('');

  return (
    <Container size="xl" py="xl">
      <Group justify="space-between" mb="lg">
        <Title order={1}>Admin Dashboard</Title>
        <TextInput
          placeholder="Search across all sections..."
          value={globalSearch}
          onChange={e => setGlobalSearch(e.target.value)}
          rightSection={<IconSearch size={16} />}
        />
      </Group>
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
        <MachinesAdminCard globalSearch={globalSearch} />
        <WorkOrdersAdminCard globalSearch={globalSearch} />
        <PMPlansAdminCard globalSearch={globalSearch} />
        <StockManagementAdminCard />
        <AuditsAdminCard />
        <PerformanceReportsAdminCard />
        <UsersRolesAdminCard globalSearch={globalSearch} />
        <PlantsAdminCard globalSearch={globalSearch} />
        <VendorsAdminCard globalSearch={globalSearch} />
      </SimpleGrid>
    </Container>
  );
}