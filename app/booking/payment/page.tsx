"use client";

import { useState, useEffect, useRef } from "react";
import PaymentSummary from "@/components/booking/paymentSummary";
import Navbar from "@/components/navbar";
import BookingSteps from "@/components/booking/bookingSteps";
import PaymentMethodSelector from "@/components/booking/paymentMethodSelector";
import CreditCardForm from "@/components/booking/creditCardForm";
import { AppointmentAPI } from "@/lib/appointmentApi";
import { Appointment } from "@/types/appointment";
import { useRouter } from "next/navigation";
import { BookingAPI } from "@/lib/bookingApi";

export default function PaymentPage() {
  
    const [method, setMethod] =
        useState<"creditcard" | "paypal" | "klarna">("creditcard");

    const [appointment, setAppointment] = useState<Appointment | null>(null);
    const [persons, setPersons] = useState<number>(1);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const creditCardFormRef = useRef<{ validate: () => boolean } | null>(null);

    useEffect(() => {
        const appointmentId = sessionStorage.getItem("appointmentId");
        const storedPersons = sessionStorage.getItem("bookingPersons");

        if (!appointmentId) {
        console.error("No appointmentId in sessionStorage");
        return;
        }

        if (storedPersons) {
        setPersons(Number(storedPersons));
        }

        AppointmentAPI.getById(appointmentId)
        .then(setAppointment)
        .catch(console.error)
        .finally(() => setLoading(false));
    }, []);
    

    const handlePayment = async () => {
        if (method === "creditcard") {
            if (creditCardFormRef.current && !creditCardFormRef.current.validate()) {
                console.log("Credit card validation failed.");
                return;
            }
            console.log("Processing credit card payment...");
        } else if (method === "paypal") {
            console.log("Redirecting to PayPal...");
        } else if (method === "klarna") {
            console.log("Redirecting to Klarna...");
        }

        try {
            const bookingForm = JSON.parse(sessionStorage.getItem("bookingForm") || "{}");
            const packageQuantities = JSON.parse(sessionStorage.getItem("packageQuantities") || "{}");
            const appointmentId = sessionStorage.getItem("appointmentId");

            if (!appointmentId) {
                console.error("No appointmentId found in sessionStorage");
                return;
            }

            console.log("Phone number being sent:", bookingForm.phone);

            const bookingResponse = await BookingAPI.createWithPayment({
                form: bookingForm,
                appointmentId: Number(appointmentId),
                numberOfPersons: persons,
                paymentMethod: method,
                packageQuantities,
                isGroupBooking: false,
                groupName: "",
            });

            router.push(`/booking/confirmation/${bookingResponse.bookingNumber}`);
        } catch (error: any) {
            console.error("Error creating booking:", error);

            if (error.message.includes("Validation failed")) {
                alert("Validation error: Please check your input and try again.");
            } else if (error.message.includes("Payment failed")) {
                alert("Payment failed: Please try a different payment method.");
            } else {
                alert("An unexpected error occurred. Please try again later.");
            }
        }
    };

    if (loading) {
        return (
        <>
            <Navbar />
            <div className="container mt-4">Loading payment…</div>
        </>
        );
    }

    if (!appointment) {
        return (
        <>
            <Navbar />
            <div className="container mt-4 text-danger">
            Appointment not found
            </div>
        </>
        );
    }

    const price = appointment.price ?? 0;
    const total = price * persons;
    const depositPercent = appointment.depositPercent ?? 30;
    const deposit = (total * depositPercent) / 100;


  return (
    <>
      <Navbar />
      <BookingSteps step={2} />

      <div className="container mt-4">
        <div className="row">

          <main className="col-lg-8">
            <div className="card p-4 shadow-sm">
              <h1 className="mb-3">Secure Payment</h1>
              <p className="text-muted">Select your payment method</p>

              <PaymentMethodSelector
                method={method}
                onChange={setMethod}
              />

              {method === "creditcard" && (
                <CreditCardForm
                  isSelected={method === "creditcard"}
                  ref={creditCardFormRef}
                />
              )}

              <div className="d-flex justify-content-between mt-4">
                <button
                    className="btn btn-secondary"
                    onClick={() => router.back()}
                >
                Back
                </button>

                <button
                    className="btn btn-primary"
                    onClick={handlePayment}
                >
                  Pay €{deposit.toFixed(2)}
                </button>
              </div>
            </div>
          </main>

          <aside className="col-lg-4">
            <div className="card p-4 shadow-sm sticky-top" style={{ top: 96 }}>
              <PaymentSummary
                appointment={appointment}
                persons={persons}
                />
            </div>
          </aside>

        </div>
      </div>
    </>
  );
}