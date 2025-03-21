import { Modal, Select, Textarea, Button, Group } from '@mantine/core';
import { DatePicker } from '@mantine/dates';

export default function CreateWorkOrderModal({
  opened,
  onClose,
  plants,
  machines,
  priorities,
  newWorkOrder,
  setNewWorkOrder,
  handleCreateWorkOrder,
}: {
  opened: boolean;
  onClose: () => void;
  plants: any[];
  machines: any[];
  priorities: string[];
  newWorkOrder: any;
  setNewWorkOrder: (workOrder: any) => void;
  handleCreateWorkOrder: () => void;
}) {
  return (
    <Modal opened={opened} onClose={onClose} title="Create Work Order" centered size="sm">
      <Select
        label="Plant"
        placeholder="Select a plant"
        data={plants.map((plant) => ({
          value: plant.plant_id.toString(),
          label: plant.name,
        }))}
        value={newWorkOrder.plant_id}
        onChange={(value) => setNewWorkOrder({ ...newWorkOrder, plant_id: value || '' })}
        required
      />
      <Select
        label="Machine"
        placeholder="Select a machine"
        data={machines.map((machine) => ({
          value: machine.machine_id.toString(),
          label: machine.name,
        }))}
        value={newWorkOrder.machine_id}
        onChange={(value) => setNewWorkOrder({ ...newWorkOrder, machine_id: value || '' })}
        required
        disabled={!newWorkOrder.plant_id}
      />
      <Select
        label="Priority"
        placeholder="Select priority"
        data={priorities.map((priority) => ({
          value: priority,
          label: priority.charAt(0).toUpperCase() + priority.slice(1),
        }))}
        value={newWorkOrder.priority}
        onChange={(value) => setNewWorkOrder({ ...newWorkOrder, priority: value || 'medium' })}
        required
      />
      <DatePicker
        label="Due Date"
        placeholder="Pick a due date"
        value={newWorkOrder.due_date ? new Date(newWorkOrder.due_date) : null}
        onChange={(date) =>
          setNewWorkOrder({ ...newWorkOrder, due_date: date?.toISOString() || '' })
        }
        required
      />
      <Textarea
        label="Description"
        placeholder="Enter work order description"
        value={newWorkOrder.description}
        onChange={(e) => setNewWorkOrder({ ...newWorkOrder, description: e.currentTarget.value })}
        required
      />
      <Group position="right" mt="md">
        <Button size="xs" onClick={handleCreateWorkOrder}>
          Create
        </Button>
      </Group>
    </Modal>
  );
}