"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

import type {DateClickArg} from "@fullcalendar/interaction";
import type {EventClickArg} from "@fullcalendar/core";

import { Appointment } from "@/types/appointment";


type Props = {
  appointments: Appointment[];
  onSelect: (apps: Appointment[]) => void;
};

export default function AppointmentCalendar({ appointments, onSelect }: Props) {
  const events = appointments.map(a => {
    const color =
      a.status === "CANCELLED" || a.status === "EVENTCANCELLED"
        ? "#dc3545"
        : a.status === "EXPIRED"
        ? "#adb5bd"
        : a.availableSlots === 0
        ? "#0d6efd"
        : "#198754";

    return {
      id: String(a.id),
      title: "•",
      start: a.startDate,
      allDay: true,
      backgroundColor: color,
      borderColor: color,
      extendedProps: a
    };
  });

  return (
    <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        height="auto"
        events={events}
        eventClick={(info: EventClickArg) => {
            onSelect([info.event.extendedProps as Appointment]);
        }}

        dateClick={(info: DateClickArg) => {
            const dayApps = appointments.filter(
                a => a.startDate === info.dateStr
            );
            onSelect(dayApps);
        }}

    />
  );
}