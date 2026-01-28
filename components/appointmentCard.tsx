"use client";

import { Appointment } from "@/types/appointment";

type Props = {
  appointment: Appointment;
  selected: boolean;
  onSelect: () => void;
};

export default function AppointmentCard({
  appointment,
  selected,
  onSelect,
}: Props) {
  const start = new Date(appointment.startDate);
  const end = appointment.endDate ? new Date(appointment.endDate) : null;

  const availableSlots =
    appointment.availableSlots ??
    (appointment.maxParticipants != null
      ? appointment.maxParticipants - (appointment.bookedParticipants ?? 0)
      : "unlimited");

  const statusClass = (() => {
    if (appointment.status === "EVENTCANCELLED") return "bg-danger";
    if (appointment.status === "CANCELLED") return "bg-danger";
    if (appointment.status === "EXPIRED") return "bg-secondary";
    if (appointment.status === "ACTIVE" && availableSlots === 0)
      return "bg-primary";
    return "bg-success";
  })();

  return (
    <div
      className={`appointment-card ${selected ? "selected" : ""}`}
      onClick={onSelect}
      style={{ cursor: "pointer" }}
    >
      {/* DATE */}
      <div className="appointment-date-range">
        <div className="date-box start-date">
          <span className="day">{start.getDate()}</span>
          <span className="month">
            {start.toLocaleString("en", { month: "short" }).toUpperCase()}
          </span>
          <span className="year">{start.getFullYear()}</span>
        </div>

        {end && (
          <>
            <div className="date-separator">until</div>
            <div className="date-box end-date">
              <span className="day">{end.getDate()}</span>
              <span className="month">
                {end.toLocaleString("en", { month: "short" }).toUpperCase()}
              </span>
              <span className="year">{end.getFullYear()}</span>
            </div>
          </>
        )}
      </div>

      {/* DETAILS */}
      <div className="appointment-details">
        {(appointment.startTime || appointment.endTime) && (
          <div className="appointment-time">
            ⏰{" "}
            {appointment.startTime?.slice(0, 5)}
            {appointment.endTime && ` - ${appointment.endTime.slice(0, 5)}`}
          </div>
        )}

        <div className="appointment-location">
          📍{" "}
          {appointment.address
            ? `${appointment.address.street} ${appointment.address.houseNumber}, ${appointment.address.city}`
            : "See event location"}
        </div>

        <div className="appointment-price">
          <strong>€ {appointment.price?.toFixed(2) ?? "-"}</strong>
        </div>

        <div className="appointment-availability">
          {availableSlots} / {appointment.maxParticipants ?? "∞"} slots available
        </div>

        <div className="appointment-cancellation-deadline">
          🚫{" "}
          {appointment.cancelDeadline
            ? `Cancel until ${appointment.cancelDeadline
                .split("-")
                .reverse()
                .join(".")}`
            : "No cancellation deadline"}
        </div>

        {(appointment.status === "CANCELLED" ||
          appointment.status === "EVENTCANCELLED") && (
          <div className="appointment-cancel-info">
            <strong>Cancelled</strong>
          </div>
        )}
      </div>

      {/* STATUS */}
      <div className="appointment-actions">
        <span className={`badge ${statusClass}`}>
          {appointment.status}
        </span>
      </div>
    </div>
  );
}