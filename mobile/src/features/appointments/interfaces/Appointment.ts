export type AppointmentStatus =
  "scheduled" | "confirmed" | "completed" | "canceled";

export interface Professional {
  id: string;
  name: string;
  specialty_id: string;
}

export interface Specialty {
  id: string;
  name: string;
}

export interface Appointment {
  id: string;
  patient_id: string;
  professional: Professional | null;
  specialty: Specialty | null;
  scheduled_at: string;
  ends_at: string;
  status: AppointmentStatus;
  observations: string | null;
}

export interface AppointmentListParams {
  status?: AppointmentStatus;
}

export interface AppointmentCollectionResponse {
  data: Appointment[];
}

export interface AppointmentResponse {
  data: Appointment;
}
