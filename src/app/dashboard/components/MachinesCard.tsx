'use client';

import { Card, Title, List, Tooltip, Button } from '@mantine/core';

export default function MachinesCard() {
  const machines = [
    // Example data; replace with API call
    { machine_id: 1, name: 'Machine A', serial_number: 'SN123', status: 'Active', plant: 'Plant A' },
    { machine_id: 2, name: 'Machine B', serial_number: 'SN456', status: 'Maintenance', plant: 'Plant B' },
  ];

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Title order={5} mb="sm">
        Machines
      </Title>
      <List>
        {machines.map((machine) => (
          <Tooltip
            key={machine.machine_id}
            label={`Serial: ${machine.serial_number}, Plant: ${machine.plant}`}
          >
            <List.Item>{machine.name}</List.Item>
          </Tooltip>
        ))}
      </List>
      <Button fullWidth mt="md" variant="outline">
        View All
      </Button>
    </Card>
  );
}