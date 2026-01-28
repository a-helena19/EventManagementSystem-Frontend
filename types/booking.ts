export type BookingForm = {
  firstName: string;
  lastName: string;
  birthdate?: string;
  email: string;
  phone?: string;

  street: string;
  houseNumber: string;
  postalCode: string;
  city: string;
  country?: string;
};

export type PackageQuantities = Record<number, number>;

export type BookingCreateRequest = {
  form: BookingForm;
  appointmentId: number;
  numberOfPersons: number;
  paymentMethod: "creditcard" | "paypal" | "klarna";
  packageQuantities?: PackageQuantities;
  isGroupBooking?: boolean;
  groupName?: string;
};

export type BookingResponse = {
  success: boolean;
  message: string;
  bookingNumber: string;
  id: number;
  firstname: string;
  lastname: string;
  email: string;
};

export type Booking = {
  id: number;
  bookingNumber: string;
  appointmentId: number;
  email: string;
  numberOfPersons: number;
  paidDepositAmount: number;
  additionalPackages?: {
    title: string;
    price: number;
    quantity: number;
  }[];
};