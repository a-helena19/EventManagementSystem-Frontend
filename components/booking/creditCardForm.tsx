import { useState } from "react";
import { forwardRef, useImperativeHandle } from "react";

type Props = {
  isSelected: boolean;
};

const CreditCardForm = forwardRef(function CreditCardForm({ isSelected }: Props, ref) {
  const [form, setForm] = useState({
    cardNumber: "",
    cardholderName: "",
    expiry: "",
    cvv: "",
    phone: "",
  });

  const [errors, setErrors] = useState({
    cardNumber: "",
    cardholderName: "",
    expiry: "",
    cvv: "",
    phone: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" })); // Clear error on change
  };

  const validate = () => {
    const newErrors: typeof errors = { cardNumber: "", cardholderName: "", expiry: "", cvv: "", phone: "" };

    if (!form.cardNumber.trim()) newErrors.cardNumber = "Card Number is required";
    if (!form.cardholderName.trim()) newErrors.cardholderName = "Cardholder Name is required";
    if (!form.expiry.trim()) newErrors.expiry = "Expiry date is required";
    if (!form.cvv.trim()) newErrors.cvv = "CVV is required";

    // Validate phone number format
    const phoneRegex = /^$|^\+[0-9 ]{6,20}$/;
    if (form.phone && !phoneRegex.test(form.phone)) {
      newErrors.phone = "Phone number must start with '+' and contain 6-20 digits";
    }

    setErrors(newErrors);

    return Object.values(newErrors).every((error) => error === "");
  };

  useImperativeHandle(ref, () => ({
    validate,
  }));

  return (
    <>
      {isSelected && (
        <form>
          <div className="mb-3">
            <label className="form-label">Card Number *</label>
            <input
              className="form-control"
              name="cardNumber"
              placeholder="1234 5678 9012 3456"
              value={form.cardNumber}
              onChange={handleChange}
            />
            {errors.cardNumber && <small className="text-danger">{errors.cardNumber}</small>}
          </div>

          <div className="mb-3">
            <label className="form-label">Cardholder Name *</label>
            <input
              className="form-control"
              name="cardholderName"
              value={form.cardholderName}
              onChange={handleChange}
            />
            {errors.cardholderName && <small className="text-danger">{errors.cardholderName}</small>}
          </div>

          <div className="row">
            <div className="col-md-6">
              <label className="form-label">Expiry (MM/YY)</label>
              <input
                className="form-control"
                name="expiry"
                placeholder="MM/YY"
                value={form.expiry}
                onChange={handleChange}
              />
              {errors.expiry && <small className="text-danger">{errors.expiry}</small>}
            </div>
            <div className="col-md-6">
              <label className="form-label">CVV</label>
              <input
                className="form-control"
                name="cvv"
                placeholder="123"
                value={form.cvv}
                onChange={handleChange}
              />
              {errors.cvv && <small className="text-danger">{errors.cvv}</small>}
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Phone Number</label>
            <input
              className="form-control"
              name="phone"
              placeholder="+1234567890"
              value={form.phone}
              onChange={handleChange}
            />
            {errors.phone && <small className="text-danger">{errors.phone}</small>}

            {form.phone && console.log("Phone number input:", form.phone)}
          </div>
        </form>
      )}
    </>
  );
});

export default CreditCardForm;