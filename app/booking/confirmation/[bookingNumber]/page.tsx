"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/navbar";
import { Appointment } from "@/types/appointment";
import {Booking} from "@/types/booking";
import { Event } from "@/types/event";
import { formatAppointmentDate, formatAppointmentTime, 
  formatAppointmentLocation } from "@/lib/appointmentsUtils";


export default function BookingConfirmation() {
  const [booking, setBooking] = useState<Booking | null>(null);
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [event, setEvent] = useState<Event | null>(null);

  const { bookingNumber } = useParams<{ bookingNumber: string }>();


  useEffect(() => {
    if (!bookingNumber) return;

    (async () => {
      const BASE_URL = "http://localhost:8080/api/";
      const bookingRes = await fetch(
        `${BASE_URL}bookings/byBookingNumber/${encodeURIComponent(bookingNumber)}`
      );
      const bookingData = await bookingRes.json();
      setBooking(bookingData);

      const apptRes = await fetch(`${BASE_URL}appointments/${bookingData.appointmentId}`);
      const apptData = await apptRes.json();
      setAppointment(apptData);

      const eventRes = await fetch(`${BASE_URL}events/${apptData.eventId}`);
      setEvent(await eventRes.json());
    })().catch(console.error);
  }, [bookingNumber]);

  const basePrice = appointment?.price ?? 0;
  const persons = booking?.numberOfPersons ?? 1;
  const baseTotal = basePrice * persons;

  const packageTotal =
    booking?.additionalPackages?.reduce(
      (sum, p) => sum + (p.price ?? 0) * (p.quantity ?? 1),
      0
    ) ?? 0;

  const total = baseTotal + packageTotal;
  const deposit = booking?.paidDepositAmount ?? 0;
  const remaining = total - deposit;

  const router = useRouter();

    if (!booking) {
      return (
        <>
          <Navbar />
          <div className="container mt-4">Loading confirmation…</div>
        </>
      );
    }

    return (
      <>
        <Navbar />

        <div className="container mt-5" style={{ maxWidth: 600 }}>
          <div className="card p-4 shadow-sm text-center">

            <h1 className="mb-3">🎉 Booking Confirmed</h1>
            <p className="text-muted mb-4">
              Thank you for your booking!
            </p>

            <hr />

            <div className="text-start mt-3">
              <p><strong>Booking #</strong>{booking.bookingNumber}</p>
              <p><strong>Event:</strong> {event?.name}</p>
              <p><strong>Date:</strong> {formatAppointmentDate(appointment)}</p>
              <p><strong>Time:</strong> {formatAppointmentTime(appointment)}</p>
              <p><strong>Location:</strong> {formatAppointmentLocation(appointment)}</p>
              <p><strong>Total:</strong> € {total.toFixed(2)}</p>
              <p><strong>Deposit paid:</strong> € {deposit.toFixed(2)}</p>
              <p><strong>Remaining:</strong> € {remaining.toFixed(2)}</p>

            </div>

            <div className="d-flex flex-column align-items-center">
              <button
                className="btn btn-outline-secondary mb-3"
                onClick={() => {
                  const downloadUrl = `http://localhost:8080/storage/booking-confirmation-${booking.bookingNumber}.pdf`;
                  window.open(downloadUrl, "_blank");
                }}
              > <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                Download Confirmation
              </button>

              <button
                className="btn btn-primary"
                onClick={() => router.push("/events")}
              >
                Back to events
              </button>
            </div>

          </div>
        </div>
      </>
    );
}