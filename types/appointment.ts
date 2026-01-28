export type Appointment = {
  id: number;
  eventId: number;
  eventName: string;

  startDate: string;
  endDate?: string;

  startTime?: string;
  endTime?: string;

  price?: number;
  depositPercent?: number;

  cancelDeadline?: string;

  status: "ACTIVE" | "CANCELLED" | "EXPIRED" | "EVENTCANCELLED";

  address?: AppointmentAddress;

  minParticipants?: number;
  maxParticipants?: number;
  bookedParticipants?: number;
  availableSlots?: number;
};

export type AppointmentAddress = {
    street: string;
    houseNumber: string;
    city: string;
    postalCode: string;
    state: string;
    country: string;
};