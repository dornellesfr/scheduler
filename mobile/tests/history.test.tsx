import { PortalHost } from "@rn-primitives/portal";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  cleanup,
  fireEvent,
  render,
  waitFor,
} from "@testing-library/react-native";
import type { ReactElement } from "react";

import HistoryScreen from "../src/app/(tabs)/history";
import { appointmentsApi } from "../src/features/appointments/api/appointments.api";
import type { Appointment } from "../src/features/appointments/interfaces/Appointment";

jest.mock("@rn-primitives/select", () => {
  const React = jest.requireActual<typeof import("react")>("react");
  const { Pressable, Text, View } =
    jest.requireActual<typeof import("react-native")>("react-native");

  interface MockOption {
    label: string;
    value: string;
  }

  interface MockSelectContextValue {
    onValueChange: (option: MockOption | undefined) => void;
    value: MockOption;
  }

  interface MockRootProps {
    children: React.ReactNode;
    onValueChange: (option: MockOption | undefined) => void;
    value: MockOption;
  }

  interface MockItemProps {
    label: string;
    value: string;
  }

  interface MockChildrenProps {
    children?: React.ReactNode;
  }

  interface MockTriggerProps extends MockChildrenProps {
    accessibilityLabel?: string;
  }

  const SelectContext = React.createContext<MockSelectContextValue | null>(
    null,
  );

  function MockRoot({
    children,
    onValueChange,
    value,
  }: MockRootProps): React.JSX.Element {
    return (
      <SelectContext.Provider value={{ onValueChange, value }}>
        <View>{children}</View>
      </SelectContext.Provider>
    );
  }

  function MockTrigger({
    accessibilityLabel,
    children,
  }: MockTriggerProps): React.JSX.Element {
    return (
      <Pressable accessibilityLabel={accessibilityLabel}>{children}</Pressable>
    );
  }

  function MockValue({
    placeholder,
  }: {
    placeholder: string;
  }): React.JSX.Element {
    const context: MockSelectContextValue = React.useContext(SelectContext) ?? {
      onValueChange: () => undefined,
      value: { label: placeholder, value: "" },
    };

    return <Text>{context.value.label || placeholder}</Text>;
  }

  function MockItem({ label, value }: MockItemProps): React.JSX.Element {
    const context: MockSelectContextValue = React.useContext(SelectContext) ?? {
      onValueChange: () => undefined,
      value: { label, value },
    };

    return (
      <Pressable onPress={() => context.onValueChange({ label, value })}>
        <Text>{label}</Text>
      </Pressable>
    );
  }

  function MockItemText(): null {
    return null;
  }

  function MockPassthrough({ children }: MockChildrenProps): React.JSX.Element {
    return <View>{children}</View>;
  }

  function MockLabel({ children }: MockChildrenProps): React.JSX.Element {
    return <Text>{children}</Text>;
  }

  function MockIndicator({ children }: MockChildrenProps): React.JSX.Element {
    return <>{children}</>;
  }

  return {
    Content: MockPassthrough,
    Group: MockPassthrough,
    Item: MockItem,
    ItemIndicator: MockIndicator,
    ItemText: MockItemText,
    Label: MockLabel,
    Overlay: MockPassthrough,
    Portal: MockPassthrough,
    Root: MockRoot,
    Trigger: MockTrigger,
    Value: MockValue,
  };
});

interface MockFlashListItem {
  id: string;
}

interface MockFlashListProps {
  data: MockFlashListItem[];
  ListEmptyComponent: ReactElement | null;
  renderItem: (info: { item: MockFlashListItem }) => ReactElement;
}

jest.mock("@shopify/flash-list", () => {
  const React = jest.requireActual<typeof import("react")>("react");
  const { View } =
    jest.requireActual<typeof import("react-native")>("react-native");

  function FlashList({
    data,
    ListEmptyComponent,
    renderItem,
  }: MockFlashListProps) {
    if (data.length === 0) return ListEmptyComponent;

    return React.createElement(
      View,
      null,
      data.map((item) =>
        React.createElement(
          React.Fragment,
          { key: item.id },
          renderItem({ item }),
        ),
      ),
    );
  }

  return { FlashList };
});

jest.mock("../src/features/appointments/api/appointments.api", () => ({
  appointmentsApi: {
    cancel: jest.fn(),
    list: jest.fn(),
  },
}));

const mockedAppointmentsApi = jest.mocked(appointmentsApi);

const appointment: Appointment = {
  ends_at: "2030-01-01T15:45:00.000000Z",
  id: "appointment-1",
  observations: "Retorno",
  patient_id: "00000000-0000-4000-8000-000000000001",
  professional: {
    id: "professional-1",
    name: "Dra. Carla Mendes",
    specialty_id: "specialty-1",
  },
  scheduled_at: "2030-01-01T15:00:00.000000Z",
  specialty: { id: "specialty-1", name: "Cardiologia" },
  status: "scheduled",
};

async function renderHistory(): Promise<Awaited<ReturnType<typeof render>>> {
  const queryClient: QueryClient = new QueryClient({
    defaultOptions: {
      mutations: { gcTime: 0 },
      queries: { gcTime: 0, retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <HistoryScreen />
      <PortalHost />
    </QueryClientProvider>,
  );
}

describe("History screen", () => {
  afterEach(async () => {
    await cleanup();
  });

  beforeEach(() => {
    mockedAppointmentsApi.cancel.mockReset();
    mockedAppointmentsApi.list.mockReset();
  });

  it("renders the empty state when there are no appointments", async () => {
    mockedAppointmentsApi.list.mockResolvedValue([]);

    const { findByText } = await renderHistory();

    expect(await findByText("Nenhuma consulta encontrada.")).toBeTruthy();
  });

  it("renders loading and error states", async () => {
    let resolveList: (value: Appointment[]) => void = () => undefined;
    mockedAppointmentsApi.list.mockReturnValue(
      new Promise<Appointment[]>((resolve) => {
        resolveList = resolve;
      }),
    );

    const screen = await renderHistory();

    expect(await screen.findByText("Carregando consultas...")).toBeTruthy();
    resolveList([]);

    await waitFor(() =>
      expect(screen.getByText("Nenhuma consulta encontrada.")).toBeTruthy(),
    );

    mockedAppointmentsApi.list.mockRejectedValueOnce(
      new Error("Network error"),
    );
    fireEvent.press(screen.getByLabelText("Filtrar consultas por status"));
    fireEvent.press(await screen.findByText("Confirmada"));

    expect(
      await screen.findByText("Não foi possível carregar suas consultas."),
    ).toBeTruthy();
    expect(screen.getByText("Tentar novamente")).toBeTruthy();
  });

  it("filters appointments and opens their details", async () => {
    mockedAppointmentsApi.list.mockResolvedValue([appointment]);

    const screen = await renderHistory();

    expect(await screen.findByText("Dra. Carla Mendes")).toBeTruthy();
    fireEvent.press(screen.getByLabelText("Filtrar consultas por status"));
    fireEvent.press(await screen.findByText("Confirmada"));

    await waitFor(() => {
      expect(mockedAppointmentsApi.list).toHaveBeenLastCalledWith({
        status: "confirmed",
      });
    });

    fireEvent.press(screen.getByText("Dra. Carla Mendes"));

    expect(await screen.findByText("Detalhes da consulta")).toBeTruthy();
    expect(screen.getByText("Retorno")).toBeTruthy();
  });

  it("confirms cancellation and keeps the detail open with canceled status", async () => {
    const canceledAppointment: Appointment = {
      ...appointment,
      status: "canceled",
    };
    mockedAppointmentsApi.list.mockResolvedValue([appointment]);
    mockedAppointmentsApi.cancel.mockResolvedValue(canceledAppointment);

    const screen = await renderHistory();

    fireEvent.press(await screen.findByText("Dra. Carla Mendes"));
    expect(await screen.findByText("Detalhes da consulta")).toBeTruthy();
    fireEvent.press(screen.getByRole("button", { name: "Cancelar consulta" }));
    const confirmCancellationButton = await waitFor(() =>
      screen.getByRole("button", {
        includeHiddenElements: true,
        name: "Confirmar cancelamento",
      }),
    );
    fireEvent.press(confirmCancellationButton);

    await waitFor(() =>
      expect(mockedAppointmentsApi.cancel).toHaveBeenCalledWith(
        "appointment-1",
      ),
    );
    await waitFor(() =>
      expect(mockedAppointmentsApi.list).toHaveBeenCalledTimes(2),
    );
    expect(screen.getByText("Cancelada")).toBeTruthy();
    expect(screen.queryByText("Cancelar consulta")).toBeNull();
  });
});
