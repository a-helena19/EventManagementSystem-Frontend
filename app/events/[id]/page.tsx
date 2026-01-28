"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/navbar";
import { getEventById } from "@/lib/api";
import { AppointmentAPI } from "@/lib/appointmentApi";
import { Event } from "@/types/event";
import { Appointment } from "@/types/appointment";
import AppointmentCalendar from "@/components/appointmentCalendar";
import AppointmentList from "@/components/appointmentList";
import Carousel from "react-bootstrap/Carousel";
import PricingBox from "@/components/pricingBox";


export default function EventDetailsPage() {
  const { id } = useParams<{ id: string }>();

  const [event, setEvent] = useState<Event | null>(null);
  const [allAppointments, setAllAppointments] = useState<Appointment[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [dayAppointments, setDayAppointments] = useState<Appointment[]>([]);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);

  useEffect(() => {
    if (!id) return;

    getEventById(id).then(setEvent).catch(console.error);

    AppointmentAPI.getByEventId(id)
    .then(data => {
      setAllAppointments(data);
      setAppointments(data);
    })
    .catch(console.error);
  }, [id]);

  if (!event) {
    return (
      <>
        <Navbar />
        <div className="container mt-4">Loading event…</div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="container mt-4">
        <div className="row">

          <main className="col-lg-8">

            <section className="card mb-4 p-0 shadow-sm">
              <Carousel style={{ height: "400px" }}>
                {event.imageIds && event.imageIds.length > 0 ? (
                  event.imageIds.map((imageId, index) => (
                    <Carousel.Item key={index}>
                      <img
                        src={`http://localhost:8080/api/events/image/${imageId}`}
                        alt={`Event image ${index + 1}`}
                        className="d-block w-100"
                        style={{ objectFit: "cover", height: "400px" }}
                      />
                    </Carousel.Item>
                  ))
                ) : (
                  <Carousel.Item>
                    <img
                      src="/images/default-event.jpg"
                      alt="Default event"
                      className="d-block w-100"
                      style={{ objectFit: "cover", height: "400px" }}
                    />
                  </Carousel.Item>
                )}
              </Carousel>
            </section>

            <section className="card p-4 mb-4 shadow-sm">
              <h1 className="mb-3">{event.name}</h1>

              <div className="d-flex gap-2 mb-3">
                <span className="badge bg-primary">{event.category}</span>
                <span className="badge bg-success">{event.status}</span>
              </div>

              <div className="event-info">
              </div>
            </section>

            {event.description && (
              <section className="card p-4 mb-4 shadow-sm">
                <h2>About This Experience</h2>
                <p>{event.description}</p>
              </section>
            )}

            {event.organizer && (
              <section className="card p-4 mb-4 shadow-sm">
                <h2>Organizer</h2>
                <div><strong>Name:</strong> {event.organizer.name}</div>
                <div><strong>Email:</strong> {event.organizer.contactEmail}</div>
                {event.organizer.phone && (
                  <div><strong>Phone:</strong> {event.organizer.phone}</div>
                )}
              </section>
            )}

            {event.requirements && event.requirements.length > 0 && (
              <section className="card p-4 mb-4 shadow-sm">
                <h2>Requirements</h2>
                <ul>
                  {event.requirements.map((req, i) => (
                    <li key={i}>{req.description}</li>
                  ))}
                </ul>
              </section>
            )}

            {event.additionalPackages && event.additionalPackages.length > 0 && (
              <section className="card p-4 mb-4 shadow-sm">
                <h2>Additional Packages</h2>
                <ul>
                  {event.additionalPackages.map(pkg => (
                    <li key={pkg.id}>
                      {pkg.title} – €{pkg.price.toFixed(2)}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <section className="card p-4 mb-4">
            <h2>Appointments</h2>

            <select
              className="form-select mb-3"
              onChange={(e) => {
                const value = e.target.value;

                let filtered = allAppointments;

                if (value === "AVAILABLE")
                  filtered = allAppointments.filter(
                    a => a.status === "ACTIVE" && (a.availableSlots ?? 0) > 0
                  );

                if (value === "FULL")
                  filtered = allAppointments.filter(
                    a => a.status === "ACTIVE" && a.availableSlots === 0
                  );

                if (value === "EXPIRED")
                  filtered = allAppointments.filter(a => a.status === "EXPIRED");

                if (value === "CANCELLED" || value === "EVENTCANCELLED")
                  filtered = allAppointments.filter(
                    a => a.status === "CANCELLED" || a.status === "EVENTCANCELLED"
                  );

                setSelectedAppointment(null);
                setAppointments(filtered);
              }}
            >
            <option value="ALL">All</option>
            <option value="AVAILABLE">Available</option>
            <option value="FULL">No availability</option>
            <option value="EXPIRED">Expired</option>
            <option value="CANCELLED">Cancelled</option>
          </select>


            <AppointmentCalendar
              appointments={appointments}
              onSelect={(apps) => {
                setDayAppointments(apps);
                setSelectedAppointment(apps[0] ?? null);
              }}
            />

            <AppointmentList
              appointments={dayAppointments}
              selectedAppointment={selectedAppointment}
              onSelect={setSelectedAppointment}
            />

          </section>

          </main>

          <aside className="col-lg-4">
            <section
              className="card p-4 mb-4 shadow-sm"
              style={{ position: "sticky", top: "96px" }}
            >
              <PricingBox appointment={selectedAppointment} />
            </section>
          </aside>

        </div>
      </div>
    </>
  );
}