export function formatAppointmentDate(value: string): string {
  const date: Date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  const formattedDate: string = new Intl.DateTimeFormat("pt-BR").format(date);
  const formattedTime: string = new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);

  return `${formattedDate} às ${formattedTime}`;
}
