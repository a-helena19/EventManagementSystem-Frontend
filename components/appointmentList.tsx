"use client";

import AppointmentCard from "./appointmentCard";
import { Appointment } from "@/types/appointment";

type Props = {
  appointments: Appointment[];
  selectedAppointment: Appointment | null;
  onSelect: (a: Appointment) => void;
};

export default function AppointmentList({
  appointments,
  selectedAppointment,
  onSelect,
}: Props) {
  if (!appointments.length) {
    return <p className="text-muted">No appointments for selected day.</p>;
  }

  return (
    <>
      {appointments.map((a) => (
        <AppointmentCard
          key={a.id}
          appointment={a}
          selected={selectedAppointment?.id === a.id}
          onSelect={() => onSelect(a)}
        />
      ))}
    </>
  );
}