import { z } from "zod";

const appointmentStatusSchema = z.enum([
  "scheduled",
  "confirmed",
  "completed",
  "canceled",
]);

export const scheduleSpecialtySchema = z.object({
  id: z.string(),
  name: z.string(),
});

export const scheduleProfessionalSchema = z.object({
  id: z.string(),
  name: z.string(),
  specialty_id: z.string(),
});

const appointmentSchema = z.object({
  id: z.string(),
  patient_id: z.string(),
  professional: scheduleProfessionalSchema.nullable(),
  specialty: scheduleSpecialtySchema.nullable(),
  scheduled_at: z.string(),
  ends_at: z.string(),
  status: appointmentStatusSchema,
  observations: z.string().nullable(),
});

export const specialtyCollectionResponseSchema = z.object({
  data: z.array(scheduleSpecialtySchema),
});

export const professionalCollectionResponseSchema = z.object({
  data: z.array(scheduleProfessionalSchema),
});

export const appointmentResponseSchema = z.object({
  data: appointmentSchema,
});

export const createAppointmentPayloadSchema = z.object({
  patient_id: z.string().uuid(),
  professional_id: z.string().uuid(),
  scheduled_at: z.string().min(1),
  observations: z.string().nullable().optional(),
});

export const scheduleDraftSchema = z.object({
  specialty: scheduleSpecialtySchema,
  professional: scheduleProfessionalSchema.nullable(),
  date: z.date(),
  time: z.string().nullable(),
  observations: z.string(),
});

export type CreateAppointmentPayload = z.infer<
  typeof createAppointmentPayloadSchema
>;
export type CreatedAppointment = z.infer<typeof appointmentSchema>;
export type ScheduleDraft = z.infer<typeof scheduleDraftSchema>;
export type ScheduleProfessional = z.infer<typeof scheduleProfessionalSchema>;
export type ScheduleSpecialty = z.infer<typeof scheduleSpecialtySchema>;
