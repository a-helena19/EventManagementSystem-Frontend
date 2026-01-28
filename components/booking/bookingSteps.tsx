type Props = { step: 1 | 2 | 3 };

export default function BookingSteps({ step }: Props) {
  return (
    <div className="container mt-3">
      <div className="d-flex justify-content-end align-items-center gap-3">
        {[1, 2, 3].map((s) => (
          <div key={s} className="d-flex align-items-center">
            <span
              className={`badge rounded-pill ${
                s < step ? "bg-success" : s === step ? "bg-primary" : "bg-secondary"
              }`}
            >
              {s < step ? "✓" : s}
            </span>
            {s < 3 && (
              <div
                className="flex-grow-1 border-top"
                style={{ maxWidth: 40 }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}