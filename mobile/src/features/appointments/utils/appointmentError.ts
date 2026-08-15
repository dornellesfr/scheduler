import { isAxiosError } from "axios";
import { z } from "zod";

const apiErrorResponseSchema = z
  .object({
    message: z.string().optional(),
    errors: z.record(z.string(), z.array(z.string())).optional(),
  })
  .passthrough();

export function getAppointmentErrorMessage(error: unknown): string {
  if (!isAxiosError(error)) {
    return "Não foi possível agendar a consulta. Tente novamente.";
  }

  const response = apiErrorResponseSchema.safeParse(error.response?.data);
  if (response.success) {
    const validationMessage = Object.values(response.data.errors ?? {})[0]?.[0];
    if (validationMessage) return validationMessage;
    if (response.data.message) return response.data.message;
  }

  if (!error.response) {
    return "Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.";
  }

  return "Não foi possível agendar a consulta. Tente novamente.";
}
