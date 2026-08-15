import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  cleanup,
  fireEvent,
  render,
  waitFor,
} from "@testing-library/react-native";
import type { ReactElement } from "react";

import ScheduleScreen from "../src/app/(tabs)/schedule";
import { appointmentsApi } from "../src/features/appointments/api/appointments.api";
import type {
  CreatedAppointment,
  ScheduleProfessional,
  ScheduleSpecialty,
} from "../src/features/appointments/schemas/scheduleAppointment";

interface MockFlashListItem {
  id: string;
}

interface MockFlashListProps {
  data: MockFlashListItem[];
  renderItem: (info: { item: MockFlashListItem }) => ReactElement;
}

const mockReplace = jest.fn();

jest.mock("@shopify/flash-list", () => {
  const React = jest.requireActual<typeof import("react")>("react");
  const { View } =
    jest.requireActual<typeof import("react-native")>("react-native");

  function FlashList({ data, renderItem }: MockFlashListProps) {
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

jest.mock("@react-native-community/datetimepicker", () => {
  const React = jest.requireActual<typeof import("react")>("react");
  const { Pressable, Text } =
    jest.requireActual<typeof import("react-native")>("react-native");

  interface MockDateTimePickerProps {
    onChange: (event: { type: string }, date: Date) => void;
  }

  function DateTimePicker({
    onChange,
  }: MockDateTimePickerProps): React.JSX.Element {
    return React.createElement(
      Pressable,
      {
        onPress: () =>
          onChange({ type: "set" }, new Date(Date.now() + 86400000)),
      },
      React.createElement(Text, null, "Date picker"),
    );
  }

  return { __esModule: true, default: DateTimePicker };
});

jest.mock("expo-router", () => {
  const React = jest.requireActual<typeof import("react")>("react");
  const { Text } =
    jest.requireActual<typeof import("react-native")>("react-native");

  return {
    Tabs: {
      Screen: ({
        options,
      }: {
        options: { title: string };
      }): React.JSX.Element => React.createElement(Text, null, options.title),
    },
    useFocusEffect: jest.fn(),
    useRouter: () => ({ replace: mockReplace }),
  };
});

jest.mock("../src/features/appointments/api/appointments.api", () => ({
  appointmentsApi: {
    cancel: jest.fn(),
    create: jest.fn(),
    list: jest.fn(),
    listProfessionals: jest.fn(),
    listSpecialties: jest.fn(),
  },
}));

const mockedAppointmentsApi = jest.mocked(appointmentsApi);

const specialty: ScheduleSpecialty = {
  id: "11111111-1111-4111-8111-111111111111",
  name: "Cardiologia",
};

const professional: ScheduleProfessional = {
  id: "22222222-2222-4222-8222-222222222222",
  name: "Dra. Ana Martins",
  specialty_id: specialty.id,
};

const createdAppointment: CreatedAppointment = {
  ends_at: "2030-01-01T11:45:00.000000Z",
  id: "appointment-1",
  observations: null,
  patient_id: "00000000-0000-4000-8000-000000000001",
  professional,
  scheduled_at: "2030-01-01T11:00:00.000000Z",
  specialty,
  status: "scheduled",
};

async function renderSchedule(): Promise<Awaited<ReturnType<typeof render>>> {
  const queryClient: QueryClient = new QueryClient({
    defaultOptions: {
      mutations: { gcTime: 0 },
      queries: { gcTime: 0, retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <ScheduleScreen />
    </QueryClientProvider>,
  );
}

async function moveToReview(): Promise<Awaited<ReturnType<typeof render>>> {
  mockedAppointmentsApi.listSpecialties.mockResolvedValue([specialty]);
  mockedAppointmentsApi.listProfessionals.mockResolvedValue([professional]);

  const screen = await renderSchedule();
  fireEvent.press(await screen.findByText(specialty.name));
  fireEvent.press(await screen.findByText(professional.name));
  fireEvent.press(await screen.findByText(/Escolher data:/));
  fireEvent.press(await screen.findByText("Date picker"));
  fireEvent.press(await screen.findByLabelText("Horário 08:00"));

  expect(await screen.findByText("Passo 3 de 3 · Revisão")).toBeTruthy();
  return screen;
}

describe("Schedule screen", () => {
  beforeEach(() => {
    mockReplace.mockReset();
    mockedAppointmentsApi.create.mockReset();
    mockedAppointmentsApi.listProfessionals.mockReset();
    mockedAppointmentsApi.listSpecialties.mockReset();
  });

  afterEach(() => {
    cleanup();
  });

  it("advances through the wizard and confirms an appointment", async () => {
    const screen = await moveToReview();
    mockedAppointmentsApi.create.mockResolvedValueOnce(createdAppointment);

    expect(screen.getByText("Especialidade")).toBeTruthy();
    expect(screen.getByText("Dra. Ana Martins")).toBeTruthy();
    expect(screen.getByText(/\d{2}:\d{2} às \d{2}:\d{2}/)).toBeTruthy();

    fireEvent.press(screen.getByText("Confirmar agendamento"));

    await waitFor(() =>
      expect(mockedAppointmentsApi.create).toHaveBeenCalledWith(
        expect.objectContaining({
          patient_id: "00000000-0000-4000-8000-000000000001",
          professional_id: professional.id,
          scheduled_at: expect.stringMatching(/T08:00:00[+-]\d{2}:\d{2}/),
        }),
      ),
    );
    expect(mockedAppointmentsApi.create.mock.calls[0][0].observations).toBe(
      undefined,
    );
    expect(
      await screen.findByText("Consulta agendada com sucesso."),
    ).toBeTruthy();

    fireEvent.press(screen.getByText("Agendar outra"));
    expect(await screen.findByText("Especialidade")).toBeTruthy();
  });

  it("shows a create error and stays on the review step", async () => {
    const screen = await moveToReview();
    mockedAppointmentsApi.create.mockRejectedValueOnce({
      isAxiosError: true,
      response: { data: { message: "O horário já foi ocupado." } },
    });

    fireEvent.press(screen.getByText("Confirmar agendamento"));

    expect(await screen.findByText("O horário já foi ocupado.")).toBeTruthy();
    expect(
      screen.getByText("Passo 3 de 3 · Revisão", {
        includeHiddenElements: true,
      }),
    ).toBeTruthy();
  });

  it("goes back from review to the specialty list", async () => {
    const screen = await moveToReview();

    fireEvent.press(screen.getByLabelText("Voltar"));
    expect(
      await screen.findByText("Passo 2 de 3 · Data e horário"),
    ).toBeTruthy();
    fireEvent.press(screen.getByLabelText("Voltar"));
    expect(await screen.findByText("Passo 1 de 3 · Profissional")).toBeTruthy();
    fireEvent.press(screen.getByLabelText("Voltar"));
    expect(await screen.findByText("Especialidades")).toBeTruthy();
  });

  it("renders loading, errors, retry and specialties", async () => {
    let resolveSpecialties: (value: ScheduleSpecialty[]) => void = () =>
      undefined;
    mockedAppointmentsApi.listSpecialties.mockReturnValueOnce(
      new Promise<ScheduleSpecialty[]>((resolve) => {
        resolveSpecialties = resolve;
      }),
    );

    const screen = await renderSchedule();

    expect(
      await screen.findByText("Carregando especialidades..."),
    ).toBeTruthy();
    resolveSpecialties([specialty]);
    expect(await screen.findByText(specialty.name)).toBeTruthy();

    mockedAppointmentsApi.listSpecialties.mockRejectedValueOnce(
      new Error("Network error"),
    );
    screen.unmount();
    const errorScreen = await renderSchedule();

    expect(
      await errorScreen.findByText(
        "Não foi possível carregar as especialidades.",
      ),
    ).toBeTruthy();
    mockedAppointmentsApi.listSpecialties.mockResolvedValueOnce([specialty]);
    fireEvent.press(errorScreen.getByText("Tentar novamente"));
    expect(await errorScreen.findByText(specialty.name)).toBeTruthy();
    errorScreen.unmount();
  });
});
