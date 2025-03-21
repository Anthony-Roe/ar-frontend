import { ScrollArea, List, Button } from '@mantine/core';

export default function WorkOrderList({
  workOrders,
  getPriorityColor,
  onWorkOrderClick,
}: {
  workOrders: any[];
  getPriorityColor: (priority: string) => string;
  onWorkOrderClick: (workOrder: any) => void;
}) {
  return (
    <ScrollArea style={{ height: 300 }} type="auto">
      <List spacing="xs" size="sm" center>
        {workOrders.map((workOrder) => (
          <List.Item
            key={workOrder.work_order_id}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Button
              size="xs"
              color={getPriorityColor(workOrder.priority)}
              onClick={() => onWorkOrderClick(workOrder)}
            >
              {workOrder.title}
            </Button>
          </List.Item>
        ))}
      </List>
    </ScrollArea>
  );
}