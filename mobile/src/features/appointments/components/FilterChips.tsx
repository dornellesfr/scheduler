import { ScrollView } from "react-native";

import { Button } from "../../../components/ui/Button";
import type { AppointmentStatus } from "../interfaces/Appointment";
import { appointmentStatusLabels } from "../utils/appointmentStatus";

interface FilterChipsProps {
  selectedStatus: AppointmentStatus | null;
  onSelect: (status: AppointmentStatus | null) => void;
}

const filters: { label: string; status: AppointmentStatus | null }[] = [
  { label: "Todos", status: null },
  { label: appointmentStatusLabels.scheduled, status: "scheduled" },
  { label: appointmentStatusLabels.confirmed, status: "confirmed" },
  { label: appointmentStatusLabels.completed, status: "completed" },
  { label: appointmentStatusLabels.canceled, status: "canceled" },
];

export function FilterChips({
  selectedStatus,
  onSelect,
}: FilterChipsProps): React.JSX.Element {
  return (
    <ScrollView
      className="mb-4"
      contentContainerClassName="pr-6"
      horizontal
      showsHorizontalScrollIndicator={false}
    >
      {filters.map((filter) => {
        const isSelected: boolean = selectedStatus === filter.status;

        return (
          <Button
            key={filter.label}
            accessibilityRole="button"
            accessibilityState={{ selected: isSelected }}
            className="mr-2 min-h-0 rounded-full px-4 py-2"
            variant={isSelected ? "primary" : "outline"}
            onPress={() => onSelect(filter.status)}
          >
            {filter.label}
          </Button>
        );
      })}
    </ScrollView>
  );
}
