"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/navbar";
import { AppointmentAPI } from "@/lib/appointmentApi";
import { Appointment } from "@/types/appointment";
import { AdditionalPackage } from "@/types/event";
import { Event } from "@/types/event";
import { getEventById } from "@/lib/api";



export default function BookEventPage() {
  type BookingForm = {
    firstName: string;
    lastName: string;
    email: string;
    birthdate: string;
    phone: string;
    street: string;
    houseNumber: string;
    postalCode: string;
    city: string;
    country: string;
    persons: number;
  };

  const [form, setForm] = useState<BookingForm>({
    firstName: "",
    lastName: "",
    email: "",
    birthdate: "",
    phone: "",
    street: "",
    houseNumber: "",
    postalCode: "",
    city: "",
    country: "",
    persons: 1,
  });

  const [formErrors, setFormErrors] =
    useState<Partial<Record<keyof BookingForm, string>>>({});

    const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const errors: Partial<Record<keyof BookingForm, string>> = {};

    if (!form.firstName.trim()) errors.firstName = "First Name is required";
    if (!form.lastName.trim()) errors.lastName = "Last Name is required";
    if (!form.email.trim()) errors.email = "Email is required";

    if (!form.birthdate) {
      errors.birthdate = "Birth date is required";
    } else {
      const birthdate = new Date(form.birthdate);
      const today = new Date();
      if (birthdate > today) {
        errors.birthdate = "Birth date cannot be in the future";
      }
    }

    if (form.persons < 1) {
      errors.persons = "Number of persons must be at least 1";
    }

    if (!form.street.trim()) errors.street = "Street is required";
    if (!form.houseNumber.trim()) errors.houseNumber = "House Number is required";
    if (!form.postalCode.trim()) errors.postalCode = "Postal Code is required";
    if (!form.city.trim()) errors.city = "City is required";
    if (!form.country.trim()) errors.country = "Country is required";

    if (form.phone && !/^$|^\+[0-9 ]{6,20}$/.test(form.phone)) {
      errors.phone = "Phone number must start with '+' and contain 6-20 digits";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleContinue = () => {
    if (!validateForm()) return;

    sessionStorage.setItem("bookingForm", JSON.stringify(form));
    sessionStorage.setItem("appointmentId", String(appointmentId));
    sessionStorage.setItem("bookingPersons", String(persons));
    sessionStorage.setItem(
      "packageQuantities",
      JSON.stringify(packageQuantities)
    );


    router.push("/booking/payment");
  };

  const handlePersonsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (value >= 1) {
      setPersons(value);
      setFormErrors((prev) => ({ ...prev, persons: undefined }));
    } else {
      setFormErrors((prev) => ({ ...prev, persons: "Number of persons must be at least 1" }));
    }
  };

  const { appointmentId } = useParams<{ appointmentId: string }>();
  const router = useRouter();

  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [event, setEvent] = useState<Event | null>(null);
  const [persons, setPersons] = useState(1);
  const [packageQuantities, updatePackageQuantities] =
  useState<Record<number, number>>({});

  useEffect(() => {
    if (!appointmentId) return;

    AppointmentAPI.getById(appointmentId)
      .then(appt => {
        setAppointment(appt);
        return getEventById(String(appt.eventId));
      })
      .then(eventData => {
        console.log("Fetched event:", eventData);
        console.log("Additional Packages:", eventData.additionalPackages);
        setEvent(eventData);

        if (eventData.additionalPackages?.length) {
          const initialQuantities = eventData.additionalPackages.reduce((acc: Record<number, number>, pkg) => {
            acc[pkg.id] = 0;
            return acc;
          }, {});
          updatePackageQuantities(initialQuantities);
        }
      })
      .catch(console.error);
  }, [appointmentId]);


  if (!appointment) {
    return (
      <>
        <Navbar />
        <div className="container mt-4">Loading booking…</div>
      </>
    );
  }

  
  const price = appointment.price ?? 0;
  const baseTotal = price * persons;

  const packagesTotal =
    event?.additionalPackages?.reduce(
      (sum: number, pkg: AdditionalPackage) => {
        const qty = packageQuantities[pkg.id] ?? 0;
        return sum + qty * pkg.price;
      },
      0
    ) ?? 0;


  const total = baseTotal + packagesTotal;
  const depositPercent = appointment.depositPercent ?? 30;
  const deposit = (total * depositPercent) / 100;
  const remaining = total - deposit;
  


  const date = new Date(appointment.startDate);
    const dateLabel = date.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    });

    const timeLabel =
    appointment.startTime && appointment.endTime
        ? `${appointment.startTime.slice(0,5)} – ${appointment.endTime.slice(0,5)}`
        : "—";

    const address = appointment.address
    ? [
        appointment.address.street,
        appointment.address.houseNumber,
        appointment.address.postalCode,
        appointment.address.city,
        appointment.address.country,
        ].filter(Boolean).join(", ")
    : "See event details";

  if (!appointment || !event) {
    return (
      <>
        <Navbar />
        <div className="container mt-4">Loading booking…</div>
      </>
    );
  }

  return (
    <>
      <Navbar />

        <div className="container mt-3">
            <div className="d-flex justify-content-end align-items-center gap-3">
            <span className="badge rounded-pill bg-primary">1</span>
            <div className="flex-grow-1 border-top" style={{ maxWidth: 40 }} />
            <span className="badge rounded-pill bg-secondary">2</span>
            <div className="flex-grow-1 border-top" style={{ maxWidth: 40 }} />
            <span className="badge rounded-pill bg-secondary">3</span>
            </div>
        </div>


      <div className="container mt-4">
        <div className="mb-3">
          <button
            className="btn btn-link px-0"
            onClick={() => router.back()}
          >
            ← Back to event details
          </button>
        </div>

        <div className="row">
          <main className="col-lg-8">
            <div className="card p-4 mb-4 shadow-sm">
              <h2 className="mb-4">Personal Information</h2>

              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">First Name *</label>
                  <input className="form-control" required name="firstName"
                    value={form.firstName}
                    onChange={handleChange} />
                    {formErrors.firstName && (
                      <small className="text-danger">{formErrors.firstName}</small>
                    )}
                </div>

                <div className="col-md-6">
                  <label className="form-label">Last Name *</label>
                  <input className="form-control" required name="lastName"
                    value={form.lastName}
                    onChange={handleChange} />
                    {formErrors.lastName && (
                      <small className="text-danger">{formErrors.lastName}</small>
                    )}
                </div>

                <div className="col-12">
                  <label className="form-label">Email *</label>
                  <input type="email" className="form-control" required name="email"
                    value={form.email}
                    onChange={handleChange} />
                    {formErrors.email && (
                      <small className="text-danger">{formErrors.email}</small>
                    )}
                </div>

                <div className="col-12">
                  <label className="form-label">Birth date *</label>
                  <input
                    type="date"
                    name="birthdate"
                    className="form-control"
                    value={form.birthdate}
                    onChange={handleChange}
                    required
                  />
                  {formErrors.birthdate && (
                    <small className="text-danger">{formErrors.birthdate}</small>
                  )}
                </div>


                <div className="col-12">
                  <label className="form-label">Phone</label>
                  <input type="tel" className="form-control" name="phone"
                    value={form.phone}
                    onChange={handleChange} />
                    {formErrors.phone && (
                      <small className="text-danger">{formErrors.phone}</small>
                    )}
                </div>

                <div className="row g-3 mt-2">
                    <div className="col-md-8">
                        <label className="form-label">Street *</label>
                        <input className="form-control" required name="street"
                          value={form.street}
                          onChange={handleChange} />
                          {formErrors.street && (
                            <small className="text-danger">{formErrors.street}</small>
                          )}
                    </div>

                    <div className="col-md-4">
                        <label className="form-label">House Number *</label>
                        <input className="form-control" required name="houseNumber"
                          value={form.houseNumber}
                          onChange={handleChange} />
                          {formErrors.houseNumber && (
                            <small className="text-danger">{formErrors.houseNumber}</small>
                          )}
                    </div>

                    <div className="col-md-4">
                        <label className="form-label">Postal Code *</label>
                        <input className="form-control" required name="postalCode"
                          value={form.postalCode}
                          onChange={handleChange} />
                          {formErrors.postalCode && (
                            <small className="text-danger">{formErrors.postalCode}</small>
                          )}
                    </div>

                    <div className="col-md-4">
                        <label className="form-label">City *</label>
                        <input className="form-control" required name="city"
                          value={form.city}
                          onChange={handleChange} />
                          {formErrors.city && (
                            <small className="text-danger">{formErrors.city}</small>
                          )}
                    </div>

                    <div className="col-md-4">
                        <label className="form-label">Country *</label>
                        <input className="form-control" required name="country"
                          value={form.country}
                          onChange={handleChange} />
                          {formErrors.country && (
                            <small className="text-danger">{formErrors.country}</small>
                          )}
                    </div>
                </div>


                <div className="col-md-6">
                  <label className="form-label">Number of persons *</label>
                  <input
                    type="number"
                    min={1}
                    max={appointment.availableSlots ?? 99}
                    className="form-control"
                    value={persons}
                    onChange={handlePersonsChange}
                    required
                  />
                  {formErrors.persons && (
                    <small className="text-danger">{formErrors.persons}</small>
                  )}
                </div>

                {Object.keys(packageQuantities).length > 0 && (
                  <>
                    
                    {(event?.additionalPackages?.length ?? 0) > 0 && (
                      <>
                        <hr />
                        <h5>Additional Packages</h5>

                        {event!.additionalPackages!.map(pkg => (
                          <div
                            key={pkg.id}
                            className="d-flex justify-content-between align-items-center mb-2"
                          >
                            <div>
                              <strong>{pkg.title}</strong>
                              <div className="text-muted">
                                € {pkg.price.toFixed(2)}
                              </div>
                            </div>

                            <input
                              type="number"
                              min={0}
                              max={persons}
                              className="form-control"
                              style={{ width: 80 }}
                              value={packageQuantities[pkg.id] ?? 0}
                              onChange={e =>
                                updatePackageQuantities(prev => ({
                                  ...prev,
                                  [pkg.id]: Math.min(Number(e.target.value), persons), // Ensure the value does not exceed the number of persons
                                }))
                              }
                            />
                          </div>
                        ))}
                      </>
                    )}

                  </>
                )}

              </div>

              <div className="d-flex gap-3 mt-4">
                <button
                  className="btn btn-danger w-50"
                  onClick={() => router.back()}
                >
                  Cancel
                </button>

                <button
                  className="btn btn-primary w-50"
                  onClick={() => {
                    handleContinue();
                  }}
                >
                  Continue to payment
                </button>
              </div>
            </div>
          </main>

          <aside className="col-lg-4">
            <div
              className="card p-4 shadow-sm"
              style={{ position: "sticky", top: "96px" }}
            >
              <h5 className="mb-3">Booking Summary</h5>

                <p className="text-muted mb-1">Event</p>
                <p className="fw-semibold">{appointment.eventName}</p>

                <hr />

                <p className="text-muted mb-1">Date</p>
                <p>{dateLabel}</p>

                <p className="text-muted mb-1">Time</p>
                <p>{timeLabel}</p>

                <p className="text-muted mb-1">Participants</p>
                <p>{persons} person(s)</p>

                <p className="text-muted mb-1">Location</p>
                <p>{address}</p>

                <hr />

                <div className="d-flex justify-content-between">
                <span>Base Price</span>
                <span>€ {price.toFixed(2)} × {persons}</span>
                </div>

                <div className="d-flex justify-content-between">
                <span>Packages</span>
                <span>€ {packagesTotal.toFixed(2)}</span>
                </div>

                <div className="d-flex justify-content-between">
                <span>Total Price</span>
                <strong>€ {total.toFixed(2)}</strong>
                </div>

                <div className="d-flex justify-content-between mt-2">
                <span>Deposit (Pay Now)</span>
                <span>€ {deposit.toFixed(2)}</span>
                </div>

                <div className="d-flex justify-content-between text-muted">
                <span>Remaining (After Event)</span>
                <span>€ {remaining.toFixed(2)}</span>
                </div>

                <hr />

                <p className="text-muted mb-1">Selected Packages</p>
                {event?.additionalPackages?.map(pkg => {
                  const qty = packageQuantities[pkg.id] ?? 0;
                  if (qty > 0) {
                    return (
                      <div key={pkg.id} className="d-flex justify-content-between">
                        <span>{pkg.title} (x{qty})</span>
                        <span>€ {(pkg.price * qty).toFixed(2)}</span>
                      </div>
                    );
                  }
                  return null;
                })}
            
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}