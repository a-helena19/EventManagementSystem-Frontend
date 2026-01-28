type PaymentMethod = "creditcard" | "paypal" | "klarna";

type Props = {
  method: PaymentMethod;
  onChange: (m: PaymentMethod) => void;
};

export default function PaymentMethodSelector({ method, onChange }: Props) {
  return (
    <div className="mb-4">
      {(["creditcard", "paypal", "klarna"] as PaymentMethod[]).map((m) => (
        <div className="form-check mb-2" key={m}>
          <input
            className="form-check-input"
            type="radio"
            checked={method === m}
            onChange={() => onChange(m)}
          />
          <label className="form-check-label text-capitalize">
            {m}
          </label>
        </div>
      ))}
    </div>
  );
}
