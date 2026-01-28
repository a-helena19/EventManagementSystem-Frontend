"use client";

import { Appointment } from "@/types/appointment";

type Props = {
  appointment: Appointment | null;
};

export default function PricingBox({ appointment }: Props) {
  if (!appointment) {
    return <p>Please select an appointment to display prices</p>;
  }

  const price = appointment.price ?? 0;
  const depositPercent = appointment.depositPercent ?? 30;
  const deposit = (price * depositPercent) / 100;

  return (
    <>
        <p><strong>Price per person</strong></p>
        <h3>€ {price.toFixed(2)}</h3>

        <p className="mt-2">
            <strong>Deposit ({depositPercent}%)</strong>
        </p>
        <p>€ {deposit.toFixed(2)}</p>

        <button
        className="btn btn-primary w-100 mt-3"
        disabled={
            appointment.status !== "ACTIVE" ||
            (appointment.availableSlots ?? 0) <= 0
        }
        >
        {appointment.status !== "ACTIVE"
            ? appointment.status
            : (appointment.availableSlots ?? 0) <= 0
            ? "Fully booked"
            : "Book Now"}
        </button>

    </>
  );
}