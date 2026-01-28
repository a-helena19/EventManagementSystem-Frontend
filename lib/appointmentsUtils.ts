import { Appointment } from "@/types/appointment";

export function formatAppointmentDate(appt?: Appointment | null): string {
  if (!appt?.startDate) return "-";

  const start = new Date(appt.startDate);
  const startStr = start.toLocaleDateString("en-EN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  if (!appt.endDate) return startStr;

  const end = new Date(appt.endDate);
  const endStr = end.toLocaleDateString("en-EN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return `${startStr} – ${endStr}`;
}

export function formatAppointmentTime(appt?: Appointment | null): string {
  if (!appt?.startTime && !appt?.endTime) return "-";

  const format = (t?: string) => t?.slice(0, 5);

  if (appt.startTime && appt.endTime) {
    return `${format(appt.startTime)} – ${format(appt.endTime)}`;
  }

  return format(appt.startTime || appt.endTime) ?? "-";
}

export function formatAppointmentLocation(appt?: Appointment | null): string {
  if (!appt?.address) return "-";

  const streetLine = [appt.address.street, appt.address.houseNumber]
    .filter(Boolean)
    .join(" ");

  const cityLine = [appt.address.postalCode, appt.address.city]
    .filter(Boolean)
    .join(" ");

  return [streetLine, cityLine, appt.address.country]
    .filter(Boolean)
    .join(", ");
}