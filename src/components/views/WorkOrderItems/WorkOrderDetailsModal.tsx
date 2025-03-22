import { Modal, Text, Badge } from '@mantine/core';

export default function WorkOrderDetailsModal({
  opened,
  onClose,
  selectedWorkOrder,
  getPriorityColor,
}: {
  opened: boolean;
  onClose: () => void;
  selectedWorkOrder: any;
  getPriorityColor: (priority: string) => string;
}) {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={selectedWorkOrder?.title || 'Work Order Details'}
      centered
      size="sm"
    >
      {selectedWorkOrder && (
        <>
          <Text size="sm" weight={500}>
            Description:
          </Text>
          <Text size="sm" color="dimmed" mb="xs">
            {selectedWorkOrder.description}
          </Text>
          <Text size="sm" weight={500}>
            Priority:
          </Text>
          <Badge color={getPriorityColor(selectedWorkOrder.priority)} size="sm" mb="xs">
            {selectedWorkOrder.priority}
          </Badge>
          <Text size="sm" weight={500}>
            Due Date:
          </Text>
          <Text size="sm" color="dimmed" mb="xs">
            {selectedWorkOrder.due_date}
          </Text>
        </>
      )}
    </Modal>
  );
}
