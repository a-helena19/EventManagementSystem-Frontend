import { Appointment } from "@/types/appointment";

type Props = {
  appointment: Appointment;
  persons: number;
};


export default function PaymentSummary({ appointment }: Props) {
  const price = appointment.price ?? 0;
  const depositPercent = appointment.depositPercent ?? 30;
  const deposit = (price * depositPercent) / 100;

  return (
    <>
      <h5 className="mb-3">Payment Summary</h5>

      <p><strong>Price per person</strong></p>
      <h3>€ {price.toFixed(2)}</h3>

      <p className="mt-2">
        <strong>Deposit ({depositPercent}%)</strong>
      </p>
      <p>€ {deposit.toFixed(2)}</p>
    </>
  );
}