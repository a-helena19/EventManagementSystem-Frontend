"use client";

import { useState } from "react";
import { Appointment } from "@/types/appointment";

type Props = {
  appointment: Appointment;
  onSuccess: (bookingId: number) => void;
};

export default function GuestForm({ appointment, onSuccess }: Props) {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget;
    const data = {
      appointmentId: appointment.id,
      firstName: form.firstName.value,
      lastName: form.lastName.value,
      birthdate: form.birthdate.value || null,
      phone: form.phone.value,
      email: form.email.value,
      persons: Number(form.persons.value),
    };

    try {
      const res = await fetch("/api/bookings/guest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Booking failed");

      const booking = await res.json();
      onSuccess(booking.id);
    } catch (err) {
      alert("Booking failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="card p-4 shadow-sm" onSubmit={handleSubmit}>
      <h2 className="mb-3">Your Details</h2>

      <input name="firstName" className="form-control mb-2" placeholder="First name" required />
      <input name="lastName" className="form-control mb-2" placeholder="Last name" required />
      <input name="email" type="email" className="form-control mb-2" placeholder="Email" required />

      <input
        name="persons"
        type="number"
        className="form-control mb-3"
        min={1}
        max={appointment.availableSlots ?? 1}
        required
      />

      <button className="btn btn-primary" disabled={loading}>
        {loading ? "Processing…" : "Confirm Booking"}
      </button>
    </form>
  );
}