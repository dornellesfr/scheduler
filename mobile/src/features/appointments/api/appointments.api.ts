import { api } from "../../../lib/api";
import {
  appointmentResponseSchema,
  createAppointmentPayloadSchema,
  professionalCollectionResponseSchema,
  specialtyCollectionResponseSchema,
  type CreateAppointmentPayload,
  type CreatedAppointment,
  type ScheduleProfessional,
  type ScheduleSpecialty,
} from "../schemas/scheduleAppointment";
import type {
  Appointment,
  AppointmentCollectionResponse,
  AppointmentListParams,
  AppointmentResponse,
} from "../interfaces/Appointment";

const DEMO_PATIENT_ID: string = "00000000-0000-4000-8000-000000000001";

export const appointmentsApi = {
  async listSpecialties(): Promise<ScheduleSpecialty[]> {
    const response = await api.get<unknown>("/specialties");

    return specialtyCollectionResponseSchema.parse(response.data).data;
  },

  async listProfessionals(
    specialtyId: string,
  ): Promise<ScheduleProfessional[]> {
    const response = await api.get<unknown>("/professionals", {
      params: { specialty_id: specialtyId },
    });

    return professionalCollectionResponseSchema.parse(response.data).data;
  },

  async list(params: AppointmentListParams = {}): Promise<Appointment[]> {
    const response = await api.get<AppointmentCollectionResponse>(
      "/appointments",
      {
        params: {
          patient_id: DEMO_PATIENT_ID,
          ...(params.status ? { status: params.status } : {}),
        },
      },
    );

    return response.data.data;
  },

  async cancel(id: string): Promise<Appointment> {
    const response = await api.post<AppointmentResponse>(
      `/appointments/${id}/cancel`,
    );

    return response.data.data;
  },

  async create(payload: CreateAppointmentPayload): Promise<CreatedAppointment> {
    const response = await api.post<unknown>(
      "/appointments",
      createAppointmentPayloadSchema.parse(payload),
    );

    return appointmentResponseSchema.parse(response.data).data;
  },
};
