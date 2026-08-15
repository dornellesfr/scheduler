import type { Option } from "@rn-primitives/select";
import * as SelectPrimitive from "@rn-primitives/select";
import { StyleSheet, View } from "react-native";

import type { AppointmentStatus } from "../interfaces/Appointment";
import { appointmentStatusLabels } from "../utils/appointmentStatus";

interface FilterChipsProps {
  selectedStatus: AppointmentStatus | null;
  onSelect: (status: AppointmentStatus | null) => void;
}

interface FilterOption {
  label: string;
  status: AppointmentStatus | null;
  value: string;
}

const filters: FilterOption[] = [
  { label: "Todos", status: null, value: "all" },
  {
    label: appointmentStatusLabels.scheduled,
    status: "scheduled",
    value: "scheduled",
  },
  {
    label: appointmentStatusLabels.confirmed,
    status: "confirmed",
    value: "confirmed",
  },
  {
    label: appointmentStatusLabels.completed,
    status: "completed",
    value: "completed",
  },
  {
    label: appointmentStatusLabels.canceled,
    status: "canceled",
    value: "canceled",
  },
];

export function FilterChips({
  selectedStatus,
  onSelect,
}: FilterChipsProps): React.JSX.Element {
  const selectedFilter: FilterOption =
    filters.find(({ status }) => status === selectedStatus) ?? filters[0];

  function handleValueChange(option: Option): void {
    if (!option) {
      onSelect(null);
      return;
    }

    const filter: FilterOption | undefined = filters.find(
      ({ value }) => value === option.value,
    );
    if (!filter) return;

    onSelect(filter.status);
  }

  return (
    <SelectPrimitive.Root
      value={{ value: selectedFilter.value, label: selectedFilter.label }}
      onValueChange={handleValueChange}
    >
      <SelectPrimitive.Trigger
        accessibilityLabel="Filtrar consultas por status"
        className="flex-row justify-between items-center bg-white dark:bg-slate-900 mb-4 px-3 border border-slate-300 dark:border-slate-700 rounded-lg w-full h-11"
      >
        <SelectPrimitive.Value
          className="text-slate-900 dark:text-slate-50 text-sm"
          placeholder="Todos"
        />
        <View className="mr-1 border-slate-500 dark:border-slate-400 border-r-2 border-b-2 w-2 h-2 rotate-45" />
      </SelectPrimitive.Trigger>
      <SelectPrimitive.Portal>
        <SelectPrimitive.Overlay
          className="bg-black/20"
          style={StyleSheet.absoluteFill}
        >
          <SelectPrimitive.Content className="bg-white dark:bg-slate-900 shadow-lg p-1 border border-slate-200 dark:border-slate-700 rounded-lg min-w-55">
            <SelectPrimitive.Group>
              <SelectPrimitive.Label className="px-2 py-2 font-medium text-slate-500 dark:text-slate-400 text-xs">
                Status
              </SelectPrimitive.Label>
              {filters.map((filter: FilterOption) => (
                <SelectPrimitive.Item
                  key={filter.value}
                  className="flex-row items-center active:bg-slate-100 dark:active:bg-slate-800 px-2 py-3 rounded-md"
                  label={filter.label}
                  value={filter.value}
                >
                  <SelectPrimitive.ItemText className="text-slate-900 dark:text-slate-50 text-sm" />
                  <View className="right-2 absolute">
                    <SelectPrimitive.ItemIndicator>
                      <View className="bg-blue-600 rounded-full w-2 h-2" />
                    </SelectPrimitive.ItemIndicator>
                  </View>
                </SelectPrimitive.Item>
              ))}
            </SelectPrimitive.Group>
          </SelectPrimitive.Content>
        </SelectPrimitive.Overlay>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  );
}
