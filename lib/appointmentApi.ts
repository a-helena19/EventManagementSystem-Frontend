import { Appointment } from "@/types/appointment";

const BASE_URL = "http://localhost:8080";

export const AppointmentAPI = {
    async getByEventId(eventId: string | number): Promise<Appointment[]> {
        const res = await fetch(
        `${BASE_URL}/api/appointments/event/${eventId}`
        );
        if (!res.ok) {
        throw new Error("Failed to load appointments");
        }
        return res.json();
    },

    async getActiveByEventId(eventId: string | number): Promise<Appointment[]> {
        const res = await fetch(
        `${BASE_URL}/api/appointments/event/${eventId}/active`
        );
        if (!res.ok) {
        throw new Error("Failed to load active appointments");
        }
        return res.json();
    },

    async getById(appointmentId: string | number): Promise<Appointment> {
        const res = await fetch(
        `${BASE_URL}/api/appointments/${appointmentId}`
        );
        if (!res.ok) {
        throw new Error("Failed to load appointment");
        }
        return res.json();
    },
};